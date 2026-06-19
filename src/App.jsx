import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChatBox from "./pages/ChatBox";

import { auth } from "./firebase";

export default function App() {
  const user = auth.currentUser;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/chat/:projectId" element={<ChatBox />} />
      </Routes>
    </BrowserRouter>
  );
}
