import React from “react”;
import { auth } from “../firebase”;
import { useNavigate } from “react-router-dom”;

export default function Dashboard() {
const nav = useNavigate();
const user = auth.currentUser;

const projects = [
{
title: “CampusVerse”,
tech: “React • Firebase”,
desc: “A platform for students to discover opportunities and events.”,
},
{
title: “AI Resume Analyzer”,
tech: “AI • React”,
desc: “Analyze resumes and provide improvement suggestions.”,
},
{
title: “Hackathon Team Finder”,
tech: “Web App”,
desc: “Find teammates based on skills and interests.”,
},
];

return (
<div style={{ padding: “20px”, fontFamily: “Arial” }}>
🚀 SyncUp
Welcome, {user?.email}

  <h2>Recommended Projects</h2>
  {projects.map((project, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      <h3>{project.title}</h3>
      <p>{project.desc}</p>
      <small>{project.tech}</small>
      <br />
      <br />
      <button onClick={() => alert("Application Submitted!")}>
        Apply
      </button>
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => nav("/chat")}
      >
        Discuss
      </button>
    </div>
  ))}
  <h2>Your Interests</h2>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    <button>AI</button>
    <button>Web Dev</button>
    <button>ML</button>
    <button>Cybersecurity</button>
    <button>App Dev</button>
  </div>
  <br />
  <button onClick={() => nav("/chat")}>
    Open SyncUp AI Assistant
  </button>
</div>

);
}
