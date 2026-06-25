import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

/* Pages */
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ProjectMembers from "./pages/ProjectMembers";
import ProjectChat from "./pages/ProjectChat";
import ProjectManage from "./pages/ProjectManage";
import ProjectDetails from "./pages/ProjectDetails";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChatBox from "./pages/ChatBox";

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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading SyncUp...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
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
          path="/chat/:id"
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
<Route path="/ai-copilot" element={<AIProjectCopilot />} />
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

        {/* EXTRA */}
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

      </Routes>
    </BrowserRouter>
  );
}
