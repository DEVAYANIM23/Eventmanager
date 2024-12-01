import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, MapPin } from "lucide-react";

function EventCard({ event }) {
  // Get initial favorite status from localStorage
  const getInitialFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(event.id);
  };

  const [isFavorite, setIsFavorite] = useState(getInitialFavoriteStatus);

  // Handle toggling favorite status
  const handleFavoriteClick = () => {
    setIsFavorite((prevStatus) => {
      const newStatus = !prevStatus;
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if (newStatus) {
        favorites.push(event.id);
      } else {
        favorites = favorites.filter((id) => id !== event.id);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      return newStatus;
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:shadow-lg relative group">
      {/* Event Image */}
      <div className="relative">
        <img
          src={event.image || "https://via.placeholder.com/300x200"}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-md ${
            isFavorite ? "text-red-500" : "text-gray-400"
          } hover:text-red-600`}
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 truncate">{event.title}</h2>
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {new Date(event.date.seconds * 1000).toLocaleDateString()} •{" "}
            {new Date(event.date.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{event.location || "Location not specified"}</span>
        </div>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.description || "No description available."}</p>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-100 border-t flex justify-between items-center">
        <Link
          to={`/events/${event.id}`}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          View Details
        </Link>
        <button
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          onClick={() => alert(`Book event: ${event.title}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default EventCard;
