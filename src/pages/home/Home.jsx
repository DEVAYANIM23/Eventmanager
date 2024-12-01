// HomePage.jsx
import React, { useState, useEffect } from "react";
import { getEvents } from "../../firebase/firestoreService";
import EventCard from "../../components/admin/EventCard";
import CategoryFilter from "../../components/category/CategoryFilter";

function HomePage() {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsList = await getEvents(); // Fetch events from Firestore
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on the selected category
  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter((event) => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No events available</div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
