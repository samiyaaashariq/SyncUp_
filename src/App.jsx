import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Notification from "./pages/notification";
import ChatBox from "./pages/chatbox";
import Auth from "./pages/auth";

// Temporary safe user (prevents crash)
const user = { email: "demo@syncup.com" };

function ProtectedRoute({ children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Core App */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        {/* ChatBox page (direct route if needed) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatBox />
            </ProtectedRoute>
          }
        />

        {/* Auth helper route (if you are using it internally) */}
        <Route path="/auth" element={<Auth />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
