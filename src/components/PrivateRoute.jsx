// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PrivateRoute = ({ children, adminOnly }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If adminOnly is set, check if user is an admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
