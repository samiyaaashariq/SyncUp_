import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

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

import { auth } from "./firebase";

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
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* CHAT SYSTEM (FIXED) */}
        <Route
          path="/chat"
          element={user ? <ChatBox /> : <Navigate to="/" />}
        />
        <Route
          path="/chat/:id"
          element={user ? <ProjectChat /> : <Navigate to="/" />}
        />

        {/* PROJECT SYSTEM */}
        <Route
          path="/project/:id"
          element={user ? <ProjectDetails /> : <Navigate to="/" />}
        />

        <Route
          path="/manage/:id"
          element={user ? <ProjectManage /> : <Navigate to="/" />}
        />

        <Route
          path="/members/:id"
          element={user ? <ProjectMembers /> : <Navigate to="/" />}
        />

        {/* EXTRA */}
        <Route
          path="/notifications"
          element={user ? <Notifications /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}
