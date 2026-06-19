import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import ChatBox from "./pages/ChatBox";
import Auth from "./pages/Auth";

// TEMP USER (replace later with Firebase auth)
const user = true;

function ProtectedRoute({ children }) {
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatBox /></ProtectedRoute>} />

        {/* Auth helper */}
        <Route path="/auth" element={<Auth />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
