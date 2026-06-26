import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const mockTeammates = [
  {
    id: 1,
    name: "Sarah Khan",
    role: "UI/UX Designer",
    skills: ["Figma", "Tailwind", "User Research"],
    bio: "Passionate about creating beautiful and intuitive interfaces.",
    availability: "Available now",
    match: 95,
  },
  {
    id: 2,
    name: "Rahul Sharma",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "Firebase"],
    bio: "Love building scalable web apps with modern tech.",
    availability: "Available in 1 week",
    match: 89,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "AI/ML Engineer",
    skills: ["Python", "Gemini API", "TensorFlow"],
    bio: "Specialized in integrating AI into student projects.",
    availability: "Available now",
    match: 92,
  },
];

export default function TeamMatcher() {
  const [teammates, setTeammates] = useState(mockTeammates);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const filteredTeammates = teammates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = filterRole === "All" || t.role.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  const connectWithUser = (user) => {
    alert(`Connection request sent to ${user.name}! 🎉\n\n(In real app this would create a chat)`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Find Teammates</h1>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={styles.select}>
          <option value="All">All Roles</option>
          <option value="Designer">Designer</option>
          <option value="Developer">Developer</option>
          <option value="Engineer">AI/ML Engineer</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filteredTeammates.map(user => (
          <div key={user.id} style={styles.card}>
            <div style={styles.matchBadge}>{user.match}% Match</div>
            
            <h3 style={styles.name}>{user.name}</h3>
            <p style={styles.role}>{user.role}</p>
            
            <p style={styles.bio}>{user.bio}</p>

            <div style={styles.skills}>
              {user.skills.map((skill, i) => (
                <span key={i} style={styles.skillTag}>{skill}</span>
              ))}
            </div>

            <p style={styles.availability}>{user.availability}</p>

            <button onClick={() => connectWithUser(user)} style={styles.connectBtn}>
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" },
  title: { 
    fontSize: "2.2rem", 
    marginBottom: "30px",
    background: "linear-gradient(90deg, #67e8f9, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  filters: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  searchInput: {
    flex: 1,
    padding: "14px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "12px",
    color: "#fff",
    minWidth: "280px",
  },
  select: {
    padding: "14px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "12px",
    color: "#fff",
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
    gap: "20px" 
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "24px",
    position: "relative",
  },
  matchBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#22d3ee",
    color: "#000",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  name: { fontSize: "1.4rem", color: "#c084fc", marginBottom: "4px" },
  role: { color: "#67e8f9", marginBottom: "16px" },
  bio: { color: "#cbd5e1", marginBottom: "20px", lineHeight: "1.6" },
  skills: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" },
  skillTag: {
    background: "rgba(103,232,249,0.15)",
    color: "#67e8f9",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.85rem",
  },
  availability: { color: "#86efac", marginBottom: "20px", fontWeight: 500 },
  connectBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
