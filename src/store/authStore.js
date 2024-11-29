import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loggedInUsers: [],

  // Fetch all users from Firestore
  fetchUsers: async () => {
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      set({ loggedInUsers: users });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Sign up function
  signUp: async (email, password, name, role) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { email, name, role });

      set({
        user: { uid: user.uid, email, name, role },
        isAuthenticated: true,
      });

      return role === "admin" ? "admin" : "user";
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Unable to sign up. Please try again.");
    }
  },

  // Login function
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({
          user: { uid: user.uid, email, name: userData.name, role: userData.role },
          isAuthenticated: true,
        });

        return userData.role === "admin" ? "admin" : "user";
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Unable to login. Please try again.");
    }
  },

  // Logout function
  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  // Listen to auth state changes
  listenToAuthState: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          set({
            user: { uid: user.uid, ...userDoc.data() },
            isAuthenticated: true,
          });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    });
  },

  // Delete user function
  deleteUser: async (userId) => {
    try {
      // Delete user from Firestore
      await deleteDoc(doc(db, "users", userId));
      console.log("User deleted successfully!");

      // Optionally, fetch updated users after deletion
      await useAuthStore.getState().fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }
  },
}));

export { useAuthStore };
