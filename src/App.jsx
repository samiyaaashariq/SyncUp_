import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Profile from "./pages/Profile";
import ProjectChat from "./pages/ProjectChat";
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
        {/* LOGIN */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* SIGNUP */}
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* 🔥 PROJECT CHAT ROOMS (IMPORTANT FIX) */}
       <Route
  path="/chat"
  element={user ? <ChatBox /> : <Navigate to="/" />}
/>
<Route path="/chat/:id" element={<ProjectChat />} />
<Route
  path="/chat/:projectId"
  element={user ? <ChatBox /> : <Navigate to="/" />}
/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
      
      </Routes>
    </BrowserRouter>
  );
}
