import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/registration/Login";
import SignUp from "./pages/registration/Signup";
import EventDetails from "./components/admin/EventDetails";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateEvent from "./components/admin/CreateEvent";
import UpdateEvent from "./components/admin/UpdateEvent";
import ForgotPassword from "./pages/registration/ForgotPassword";
import PrivateRoute from "./protectedRoute/PrivateRoute";
import { useAuthStore } from "./store/authStore";
import { MyContextProvider } from "./context/myContext"; // Import the context provider
import SearchBar from "./components/admin/SearchBar"; // Import SearchBar component

function App() {
  const { user, isAuthenticated, listenToAuthState } = useAuthStore((state) => state);

  useEffect(() => {
    listenToAuthState(); // Listen for authentication state changes
  }, [listenToAuthState]);

  return (
    <MyContextProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F7FAFC" }}>
          {/* Header Component with SearchBar */}
          <Header />
          <SearchBar /> {/* Add the SearchBar right below the Header */}
          
          <main style={{ paddingTop: "80px", paddingBottom: "64px", flex: 1, overflowY: "auto" }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login />
                  ) : (
                    <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} />
                  )
                }
              />
              <Route
                path="/signup"
                element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route path="/events/:id" element={<EventDetails />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
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
              <Route
                path="/update-event/:id"
                element={
                  <PrivateRoute adminOnly>
                    <UpdateEvent />
                  </PrivateRoute>
                }
              />

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </MyContextProvider>
  );
}

export default App;
