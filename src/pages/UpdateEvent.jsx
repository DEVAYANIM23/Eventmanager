import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, updateEvent } from "../firebase/firestoreService"; // Import Firestore functions

const UpdateEvent = () => {
  const { eventId } = useParams(); // Get event ID from URL params
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    venue: "",
    price: 0,
    bookedTickets: 0,
    category: ""
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(eventId); // Fetch event details from Firestore
        setEvent(eventData);
        setFormData({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          venue: eventData.venue,
          price: eventData.price,
          bookedTickets: eventData.bookedTickets,
          category: eventData.category
        });
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(eventId, formData); // Update event in Firestore
      navigate("/admin-dashboard"); // Redirect to the admin dashboard
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-4">Update Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Event Name"
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Event Description"
            className="w-full p-2 border rounded-md"
          />
          {/* Add other form fields for date, location, price, etc. */}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
