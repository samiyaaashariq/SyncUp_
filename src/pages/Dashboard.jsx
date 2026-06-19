import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser;

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 SyncUp</h1>
      <h3>Welcome {user?.email}</h3>

      <button onClick={() => nav("/chat")}>Explore Projects</button>
      <button onClick={() => nav("/chat")}>Create Project</button>

      <h2>Your Interests</h2>

      <div>
        <button>AI</button>
        <button>Web Dev</button>
        <button>ML</button>
        <button>Cybersecurity</button>
        <button>App Dev</button>
      </div>
    </div>
  );
}
