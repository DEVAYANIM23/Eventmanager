import React, { useEffect, useState } from "react";
import { Ticket, Calendar, Heart, Bell } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { getUpcomingEvents } from "../../firebase/firestoreService";

function UserDashboard() {
  const { user } = useAuthStore((state) => state);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [wishlistEvents, setWishlistEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [currentView, setCurrentView] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
    fetchWishlistEvents();
    fetchBookedEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    setLoading(true);
    try {
      const events = await getUpcomingEvents();
      setUpcomingEvents(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistEvents = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setWishlistEvents(upcomingEvents.filter((event) => favorites.includes(event.id)));
  };

  const fetchBookedEvents = async () => {
    try {
      // Mocking booked events. Replace this with your actual API/Firestore call.
      const bookedEvents = [
        {
          id: "event1",
          name: "Booked Event 1",
          location: "Location 1",
          date: { seconds: 1714953600 },
          image: "https://via.placeholder.com/150",
        },
        {
          id: "event2",
          name: "Booked Event 2",
          location: "Location 2",
          date: { seconds: 1714953600 },
          image: "https://via.placeholder.com/150",
        },
      ];
      setBookedEvents(bookedEvents);
    } catch (error) {
      console.error("Error fetching booked events:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const renderContent = () => {
    let eventsToRender;

    switch (currentView) {
      case "wishlist":
        eventsToRender = wishlistEvents;
        break;
      case "bookings":
        eventsToRender = bookedEvents;
        break;
      default:
        eventsToRender = upcomingEvents;
    }

    return (
      <>
        <h1 className="text-2xl font-bold mb-6">
          {currentView === "wishlist"
            ? "Wishlist"
            : currentView === "bookings"
            ? "My Bookings"
            : "Upcoming Events"}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {eventsToRender.length === 0 ? (
              <p className="text-gray-500">No events found.</p>
            ) : (
              eventsToRender.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleViewDetails(event.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={event.image || "https://via.placeholder.com/150"}
                      alt={event.name}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-4">
                          <strong>Location:</strong> {event.location || "Not specified"}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(event.date.seconds * 1000).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <img
                  src={profileImage || "https://via.placeholder.com/150"}
                  alt="User"
                  className="h-16 w-16 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">{user?.name || "John Doe"}</h2>
                  <p className="text-gray-500">{user?.email || "user@example.com"}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 text-sm text-indigo-600"
                  />
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentView("upcoming")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentView === "upcoming" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Upcoming Events
                </button>
                <button
                  onClick={() => {
                    setCurrentView("wishlist");
                    fetchWishlistEvents();
                  }}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentView === "wishlist" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </button>
                <button
                  onClick={() => setCurrentView("bookings")}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    currentView === "bookings" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  My Bookings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
