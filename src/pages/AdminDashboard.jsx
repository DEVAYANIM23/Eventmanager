import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, Calendar, FileText, PlusCircle } from "lucide-react";
import { getEvents, deleteEvent } from "../firebase/firestoreService"; // Import Firestore functions
import { useAuthStore } from "../store/authStore";
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
  const totalBookings = events.reduce((acc, event) => acc + (event.bookedTickets || 0), 0);
  const totalRevenue = events.reduce(
    (acc, event) => acc + (event.price * (event.bookedTickets || 0)),
    0
  );
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
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-gray-500">Total Events</p>
                    <p className="text-xl font-bold">{totalEvents}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-gray-500">Total Bookings</p>
                    <p className="text-xl font-bold">{totalBookings}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-gray-500">Total Revenue</p>
                    <p className="text-xl font-bold">{totalRevenue}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-gray-500">Total Users</p>
                    <p className="text-xl font-bold">{totalUsers}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold bg-blue-500 text-white p-4 rounded-md">Users</h2>
                <div className="overflow-x-auto mt-6">
                  <table className="min-w-full table-auto">
                    <thead className="bg-blue-500">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-white">User Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-white">Email</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loggedInUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="py-3 px-4 text-sm text-gray-700">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="events-heading">Events</h2>
                {loading ? (
                  <div>Loading events...</div>
                ) : (
                  <div className="overflow-x-auto mt-6">
                    <table className="events-table min-w-full table-auto">
                      <thead className="events-table-header">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Event Name</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Location</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Venue</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Booked Tickets</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id}>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {new Date(event.date.seconds * 1000).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.location}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.venue}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.price}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.bookedTickets}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{event.category}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <button
                                onClick={() => handleUpdateEvent(event.id)}
                                className="text-blue-500 hover:text-blue-700 mr-3"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-500 hover:text-red-700"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
