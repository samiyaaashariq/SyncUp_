import React from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

function TestHome() {
  const navigate = useNavigate();
  return (
    <div style={{ 
      padding: "80px", 
      textAlign: "center", 
      background: "#0a0a0a", 
      color: "#fff", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ fontSize: "3rem" }}>SyncUp Test</h1>
      <p style={{ fontSize: "1.3rem", margin: "30px 0" }}>If buttons work, Router is fixed.</p>
      
      <button 
        onClick={() => navigate("/login")}
        style={{ padding: "18px 50px", background: "#ff00aa", color: "#000", border: "none", fontSize: "1.2rem", margin: "10px", borderRadius: "50px" }}
      >
        Go to Login
      </button>

      <button 
        onClick={() => navigate("/signup")}
        style={{ padding: "18px 50px", background: "#ff00aa", color: "#000", border: "none", fontSize: "1.2rem", margin: "10px", borderRadius: "50px" }}
      >
        Go to Signup
      </button>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TestHome />} />
        <Route path="/login" element={<div style={{ padding: "100px", color: "#fff", background: "#0a0a0a", minHeight: "100vh" }}>Login Page (Test)</div>} />
        <Route path="/signup" element={<div style={{ padding: "100px", color: "#fff", background: "#0a0a0a", minHeight: "100vh" }}>Signup Page (Test)</div>} />
      </Routes>
    </HashRouter>
  );
}
