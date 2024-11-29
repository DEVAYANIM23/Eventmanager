import React, { useEffect, useState } from "react";
import { Ticket, Calendar, Heart, Bell } from "lucide-react";
import { useAuthStore } from "../store/authStore"; // Import the auth store

const bookings = [
  {
    id: 1,
    event: "Summer Music Festival 2024",
    date: "2024-07-15",
    tickets: 2,
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400",
  },
  // Add more bookings as needed
];

function UserDashboard() {
  // Fetch the current logged-in user from the auth store
  const { user } = useAuthStore((state) => state); // Access the `user` state from the auth store
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  // Function to handle profile image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Update profile image on state change
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Update profile image when user changes the profile image
    setProfileImage(user?.profileImage || "");
  }, [user]);

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
                  {/* Button to allow profile image change */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 text-sm text-indigo-600"
                  />
                </div>
              </div>

              <nav className="space-y-2">
                <a href="#bookings" className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-md">
                  <Ticket className="h-5 w-5 mr-3" />
                  My Bookings
                </a>
                <a href="#upcoming" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  <Calendar className="h-5 w-5 mr-3" />
                  Upcoming Events
                </a>
                <a href="#wishlist" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  <Heart className="h-5 w-5 mr-3" />
                  Wishlist
                </a>
                <a href="#notifications" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  <Bell className="h-5 w-5 mr-3" />
                  Notifications
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <img
                      src={booking.image}
                      alt={booking.event}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-semibold">{booking.event}</h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Ticket className="h-4 w-4 mr-2" />
                          <span>{booking.tickets} tickets</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
