import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

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
          path="/chat/:projectId"
          element={user ? <ChatBox /> : <Navigate to="/" />}
        />
        <Route
  path="/chat"
  element={user ? <ChatBox /> : <Navigate to="/" />}
/>
      </Routes>
    </BrowserRouter>
  );
}
