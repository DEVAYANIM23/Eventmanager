import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

// Fetch all events
export const getEvents = async () => {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "Unnamed Event",
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Fetch a single event by ID
export const getEvent = async (id) => {
  try {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error("Event not found");
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// Add a new event
export const addEvent = async (eventData, id = null) => {
  try {
    const docRef = id ? doc(db, "events", id) : doc(collection(db, "events"));
    await setDoc(docRef, eventData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (id, updatedData) => {
  try {
    const eventDocRef = doc(db, "events", id);
    await setDoc(eventDocRef, updatedData, { merge: true });
    console.log(`Event with ID: ${id} updated.`);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const eventDocRef = doc(db, "events", eventId);
    await deleteDoc(eventDocRef);
    console.log(`Event with ID: ${eventId} deleted.`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Fetch upcoming events
export const getUpcomingEvents = async () => {
  try {
    const eventsCollection = collection(db, "events");
    const today = new Date();
    const q = query(eventsCollection, where("date", ">=", today));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};
