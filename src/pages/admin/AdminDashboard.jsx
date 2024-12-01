import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, Calendar, PlusCircle } from "lucide-react";
import { getEvents, deleteEvent } from "../../firebase/firestoreService"; // Import Firestore functions
import { useAuthStore } from "../../store/authStore";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchUsers = useAuthStore((state) => state.fetchUsers);
  const loggedInUsers = useAuthStore((state) => state.loggedInUsers);
  const deleteUser = useAuthStore((state) => state.deleteUser);

  // Fetch events and users when the tab is changed
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "events") {
          const eventList = await getEvents(); // Fetch events from Firestore
          setEvents(eventList);
        }
        if (activeTab === "users") {
          await fetchUsers(); // Fetch users from the auth store
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, fetchUsers]);

  // Handle delete user action
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId); // Delete user from Firestore
      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle delete event action
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId); // Delete event from Firestore
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId)); // Remove from local state
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Handle update event action
  const handleUpdateEvent = (eventId) => {
    navigate(`/update-event/${eventId}`); // Navigate to the update page for the event
  };

  // Calculate metrics for Overview
  const totalEvents = events.length;

  const totalBookings = events.reduce((acc, event) => {
    return acc + (event.bookedTickets ? event.bookedTickets : 0); // Ensure bookedTickets is a valid number
  }, 0);

  const totalRevenue = events.reduce((acc, event) => {
    const price = event.price ? event.price : 0; // Ensure price is a valid number
    const bookedTickets = event.bookedTickets ? event.bookedTickets : 0; // Ensure bookedTickets is a valid number
    return acc + price * bookedTickets; // Calculate total revenue
  }, 0);

  const totalUsers = loggedInUsers.length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => navigate("/create-event")}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <nav className="px-4 py-6 space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center px-4 py-2 w-full text-left ${activeTab === "overview" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"} rounded-md`}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center px-4 py-2 w-full text-left ${activeTab === "users" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"} rounded-md`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`flex items-center px-4 py-2 w-full text-left ${activeTab === "events" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"} rounded-md`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Events
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700">{totalEvents}</p>
                    <p className="text-gray-500">Total Events</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700">{totalBookings}</p>
                    <p className="text-gray-500">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700">${totalRevenue.toFixed(2)}</p>
                    <p className="text-gray-500">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700">{totalUsers}</p>
                    <p className="text-gray-500">Total Users</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Events</h2>
                {loading ? (
                  <p className="text-center text-gray-500">Loading events...</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked Tickets</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date.seconds * 1000).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.venue}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${event.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.bookedTickets || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleUpdateEvent(event.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Users</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loggedInUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
