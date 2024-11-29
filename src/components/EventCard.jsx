import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react"; // Import the heart icon from lucide-react

function EventCard({ event }) {
  // Get initial favorite status from localStorage
  const getInitialFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(event.id);
  };

  const [isFavorite, setIsFavorite] = useState(getInitialFavoriteStatus); // Set the initial state

  // Handle clicking the heart icon to toggle favorite status
  const handleFavoriteClick = () => {
    setIsFavorite((prevStatus) => {
      const newStatus = !prevStatus; // Toggle the status

      // Get the current list of favorite event IDs from localStorage
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (newStatus) {
        // If it's a new favorite, add to the list
        favorites.push(event.id);
      } else {
        // If it's removed, remove from the list
        favorites = favorites.filter((id) => id !== event.id);
      }

      // Save the updated favorites list back to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));

      return newStatus; // Return the new status
    });
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition">
      <img
        src={event.image || "https://via.placeholder.com/300x200"}
        alt={event.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Date:</strong> {new Date(event.date.seconds * 1000).toLocaleDateString()}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <strong>Location:</strong> {event.location}
      </p>

      <div className="flex items-center justify-between mb-4">
        {/* Heart Icon for Favorite */}
        <button
          onClick={handleFavoriteClick}
          className={`text-lg ${isFavorite ? "text-red-500" : "text-gray-400"} transition-colors`}
        >
          <Heart className="h-6 w-6" />
        </button>
        {/* View Details Link */}
        <Link
          to={`/events/${event.id}`}
          className="text-indigo-600 hover:underline text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
