import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, user } = useAuthStore((state) => state);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    // If trying to access an admin route, redirect to user dashboard if not admin
    return <Navigate to="/dashboard" />;
  }

  return children; // If authenticated and authorized, render the child component
};

export default PrivateRoute;
