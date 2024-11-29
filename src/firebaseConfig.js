// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxEk6_lzGX_MV9BrUrUzkFmW_Wfm8TbQk",
  authDomain: "event-manager-7dde7.firebaseapp.com",
  projectId: "event-manager-7dde7",
  storageBucket: "event-manager-7dde7.firebasestorage.app",
  messagingSenderId: "629007602181",
  appId: "1:629007602181:web:9998c610dde685b85b426c",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Set up Firebase Authentication and Firestore Database
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firestore DB and Auth services for use in other parts of the app
export { auth, db };

// Firestore utility functions - Example for adding and getting events

// Function to get event details from Firestore
export const getEvent = async (id) => {
  try {
    const docRef = doc(db, 'events', id); // Reference to the 'events' collection and specific event document
    const docSnap = await getDoc(docRef); // Get the document snapshot
    if (docSnap.exists()) {
      return docSnap.data(); // Return the event data if the document exists
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error("Error getting event data:", error);
  }
};

// Function to add a new event to Firestore
export const addEvent = async (eventData) => {
  try {
    const docRef = doc(collection(db, 'events'), eventData.id); // Create a new document in the 'events' collection
    await setDoc(docRef, eventData); // Set the document data
    console.log("Event successfully added!");
  } catch (error) {
    console.error("Error adding event:", error);
  }
};
