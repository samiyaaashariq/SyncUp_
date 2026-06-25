import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

/* Pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChatBox from "./pages/ChatBox";
import ProjectChat from "./pages/ProjectChat";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectManage from "./pages/ProjectManage";
import ProjectMembers from "./pages/ProjectMembers";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// NEW PAGES - Make sure these files exist
import AIProjectCopilot from "./pages/AIProjectCopilot";
import Landing from "./pages/Landing";   // ← Create this if not exists

/* 🔐 Protected Route Wrapper */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a, #001a14)",
        color: "#e0f2f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem"
      }}>
        Loading SyncUp...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* AI COPILOT */}
        <Route
          path="/ai-copilot"
          element={
            <ProtectedRoute user={user}>
              <AIProjectCopilot />
            </ProtectedRoute>
          }
        />

        {/* CHAT SYSTEM */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute user={user}>
              <ChatBox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:projectId"
          element={
            <ProtectedRoute user={user}>
              <ProjectChat />
            </ProtectedRoute>
          }
        />

        {/* PROJECT SYSTEM */}
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute user={user}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage/:id"
          element={
            <ProtectedRoute user={user}>
              <ProjectManage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members/:id"
          element={
            <ProtectedRoute user={user}>
              <ProjectMembers />
            </ProtectedRoute>
          }
        />

        {/* OTHER PAGES */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute user={user}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
