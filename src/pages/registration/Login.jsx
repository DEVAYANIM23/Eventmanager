import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Track the forgot password state
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setError(null);

    if (isForgotPassword) {
      // Handle Forgot Password
      try {
        await sendPasswordResetEmail(auth, email);
        setError(null);
        alert("Password reset email sent! Check your inbox.");
        navigate("/login"); // Navigate back to login page after sending the email
      } catch (err) {
        setError(err.message || "Failed to send password reset email.");
      }
    } else {
      // Handle Login
      try {
        const roleRedirect = await login(email, password);
        if (roleRedirect === "admin") {
          navigate("/admin"); // Redirect to admin dashboard if role is admin
        } else {
          navigate("/dashboard"); // Otherwise, redirect to user dashboard
        }
      } catch (err) {
        setError(err.message || "An error occurred during login.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">
          {isForgotPassword ? "Forgot Password" : "Login"}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAction}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          {!isForgotPassword && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            {isForgotPassword ? "Reset Password" : "Login"}
          </button>
        </form>

        {/* Toggle between Login and Forgot Password */}
        <div className="mt-4 text-center">
          {isForgotPassword ? (
            <p>
              Remembered your password?{" "}
              <span
                onClick={() => setIsForgotPassword(false)}
                className="text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p>
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 cursor-pointer"
              >
                Forgot Password?
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
