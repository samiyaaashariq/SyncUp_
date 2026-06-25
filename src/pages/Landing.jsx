import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#000", 
      color: "#fff", 
      padding: "50px", 
      textAlign: "center" 
    }}>
      <h1 style={{ fontSize: "3rem" }}>SyncUp</h1>
      <p style={{ fontSize: "1.5rem", margin: "20px 0" }}>
        Find Projects. Find Teammates. Build Together.
      </p>

      <button 
        onClick={() => navigate("/login")}
        style={{ 
          padding: "15px 40px", 
          margin: "10px", 
          background: "#ff00aa", 
          color: "#000", 
          border: "none", 
          fontSize: "1.2rem" 
        }}
      >
        Login
      </button>

      <button 
        onClick={() => navigate("/signup")}
        style={{ 
          padding: "15px 40px", 
          margin: "10px", 
          background: "#ff00aa", 
          color: "#000", 
          border: "none", 
          fontSize: "1.2rem" 
        }}
      >
        Signup
      </button>

      <p style={{ marginTop: "50px" }}>If buttons work, the app is running.</p>
    </div>
  );
}
