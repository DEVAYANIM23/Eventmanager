import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Initialize user from localStorage
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true", // Get the auth state from localStorage
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

      // Save to localStorage for persistence
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, email, name, role }));

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

        // Save to localStorage for persistence
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ uid: user.uid, email, name: userData.name, role: userData.role }));

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

    // Remove from localStorage on logout
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  },

  // Listen to auth state changes
  listenToAuthState: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({
            user: { uid: user.uid, ...userData },
            isAuthenticated: true,
          });

          // Store to localStorage for persistence
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify({ uid: user.uid, ...userData }));
        }
      } else {
        set({ user: null, isAuthenticated: false });

        // Clear localStorage on logout
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
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
