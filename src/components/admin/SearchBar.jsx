import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "../../firebase/firestoreService"; // Import your firestore service

const SearchBar = () => {
  const [search, setSearch] = useState(""); // The search input state
  const [events, setEvents] = useState([]); // State to hold the fetched events
  const [filteredEvents, setFilteredEvents] = useState([]); // State to hold filtered events
  const navigate = useNavigate();

  // Fetch events from Firestore when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventList = await getEvents(); // Fetch events from the firestoreService
        setEvents(eventList); // Store the fetched events in state
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []); // This runs only once when the component mounts

  // Update the filtered events based on the search input
  useEffect(() => {
    if (search) {
      setFilteredEvents(
        events.filter((event) =>
          event.title.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 8) // Limit the results to 8
      );
    } else {
      setFilteredEvents([]); // If search is empty, clear the results
    }
  }, [search, events]); // Re-run when search or events change

  return (
    <div style={{ position: "relative" }}>
      {/* Search Input */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
        <input
          type="text"
          placeholder="Search for an event"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          style={{
            backgroundColor: "#f7fafc",
            borderRadius: "8px",
            padding: "8px 16px",
            width: "96%",
            maxWidth: "400px",
            outline: "none",
            color: "#333",
          }}
        />
      </div>

      {/* Search Results Dropdown */}
      {search && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            width: "96%",
            maxWidth: "400px",
            backgroundColor: "#f7fafc",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
          }}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={index}
                onClick={() => navigate(`/events/${event.id}`)} // Navigates to the event details
                style={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={event.productImageUrl} // Assuming the event has a productImageUrl field
                  alt={event.title}
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span>{event.title}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: "8px", textAlign: "center" }}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png"
                alt="No results"
                style={{ width: "50px" }}
              />
              <p>No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
