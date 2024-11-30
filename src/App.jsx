import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // Import Footer component
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import { useAuthStore } from "./store/authStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const listenToAuthState = useAuthStore((state) => state.listenToAuthState);

  // Initialize the auth state listener
  useEffect(() => {
    listenToAuthState();
  }, [listenToAuthState]);

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F7FAFC" }}>
        {/* Fixed Header */}
        <Header />

        {/* Main Content */}
        <main style={{ paddingTop: "80px", paddingBottom: "64px", flex: 1, overflowY: "auto" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />}
            />

            {/* Event Details */}
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <PrivateRoute adminOnly>
                  <CreateEvent />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {/* Fixed Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
