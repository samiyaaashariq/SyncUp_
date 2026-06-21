import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
const nav = useNavigate();
const user = auth.currentUser;

const projects = [
{
title: “CampusVerse”,
description:
“A student platform to discover opportunities, events, and communities.”,
tech: “React • Firebase”,
},
{
title: “AI Resume Analyzer”,
description:
“Analyze resumes and get AI-powered suggestions for improvement.”,
tech: “React • AI”,
},
{
title: “Hackathon Team Finder”,
description:
“Find teammates based on skills, interests, and project goals.”,
tech: “Web App”,
},
];

const interests = [
“AI”,
“Web Development”,
“Machine Learning”,
“Cybersecurity”,
“App Development”,
];

return (
<div
style={{
minHeight: “100vh”,
backgroundColor: “#f4f6f8”,
padding: “30px”,
fontFamily: “Arial, sans-serif”,
}}
>
{/* Header */}
<div
style={{
background: “#ffffff”,
padding: “20px”,
borderRadius: “12px”,
marginBottom: “20px”,
boxShadow: “0 2px 8px rgba(0,0,0,0.08)”,
}}
>
🚀 SyncUp
Welcome back, {user?.email}
Discover projects, connect with teammates, and build something
impactful.
  {/* Stats */}
  <div
    style={{
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "25px",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "180px",
      }}
    >
      <h3>12+</h3>
      <p>Projects Available</p>
    </div>
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "180px",
      }}
    >
      <h3>100+</h3>
      <p>Student Collaborators</p>
    </div>
    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        minWidth: "180px",
      }}
    >
      <h3>24/7</h3>
      <p>AI Assistant</p>
    </div>
  </div>
  {/* Featured Projects */}
  <h2>🔥 Featured Projects</h2>
  {projects.map((project, index) => (
    <div
      key={index}
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <small>{project.tech}</small>
      <div style={{ marginTop: "12px" }}>
        <button
          onClick={() => alert("Application Submitted!")}
          style={{
            padding: "8px 14px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Apply
        </button>
        <button
          onClick={() => nav("/chat")}
          style={{
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          Discuss
        </button>
      </div>
    </div>
  ))}
  {/* Interests */}
  <h2>🎯 Your Interests</h2>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "25px",
    }}
  >
    {interests.map((interest, index) => (
      <span
        key={index}
        style={{
          background: "#e8f0fe",
          padding: "8px 14px",
          borderRadius: "20px",
        }}
      >
        {interest}
      </span>
    ))}
  </div>
  {/* AI Assistant */}
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h2>🤖 SyncUp AI Assistant</h2>
    <p>
      Ask questions, brainstorm project ideas, and get guidance for your
      next collaboration.
    </p>
    <button
      onClick={() => nav("/chat")}
      style={{
        padding: "10px 16px",
        cursor: "pointer",
      }}
    >
      Open AI Assistant
    </button>
  </div>
</div>

);
}
