import React, { useState } from "react";
import { auth } from "../firebase";

export default function Profile() {
  const user = auth.currentUser;

  const [skills, setSkills] = useState(["AI", "Web Dev", "React"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill) return;
    setSkills([...skills, newSkill]);
    setNewSkill("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Inter",
        background: "linear-gradient(135deg,#dbeafe,#f8fafc)",
        color: "#0f172a",
      }}
    >
      {/* PROFILE CARD */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2>👤 My Profile</h2>

        <p><b>Email:</b> {user?.email}</p>

        {/* SKILLS */}
        <h3>Skills</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {skills.map((s, i) => (
            <span
              key={i}
              style={{
                background: "#e0f2fe",
                padding: "6px 10px",
                borderRadius: "20px",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* ADD SKILL */}
        <div style={{ marginTop: "10px" }}>
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill"
            style={{ padding: "8px", marginRight: "10px" }}
          />

          <button onClick={addSkill}>Add</button>
        </div>

        {/* PORTFOLIO */}
        <h3 style={{ marginTop: "20px" }}>Portfolio</h3>

        <ul>
          <li>GitHub: https://github.com/your-profile</li>
          <li>LinkedIn: https://linkedin.com/in/your-profile</li>
        </ul>
      </div>
    </div>
  );
}
