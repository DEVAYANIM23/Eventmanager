import { db } from '../firebaseConfig';  // Import Firestore instance from firebaseConfig
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';  // Firestore methods

// Fetch events from Firestore
export const getEvents = async () => {
  try {
    const eventsCollection = collection(db, "events"); // Reference to "events" collection
    const snapshot = await getDocs(eventsCollection); // Fetch the data
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;  // Rethrow to handle further up
  }
};

// Add a new event to Firestore
export const addEvent = async (eventData) => {
  try {
    const eventsCollection = collection(db, "events");
    const docRef = await addDoc(eventsCollection, eventData);
    console.log("Event added with ID: ", docRef.id);
    return docRef.id; // Return the new document ID if needed
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;  // Rethrow to handle further up
  }
};

// Delete an event from Firestore
export const deleteEvent = async (eventId) => {
  try {
    const eventDocRef = doc(db, "events", eventId);  // Reference to the event document
    await deleteDoc(eventDocRef);  // Delete the document
    console.log(`Event with ID: ${eventId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;  // Rethrow to handle further up
  }
};

// Optional: Fetch events by a specific field (e.g., upcoming events)
export const getUpcomingEvents = async () => {
  try {
    const eventsCollection = collection(db, "events");
    const q = query(eventsCollection, where("date", ">=", new Date())); // Fetch events with date >= today
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;  // Rethrow to handle further up
  }
};
