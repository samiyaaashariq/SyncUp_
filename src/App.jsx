import React, { useState } from "react";
import ChatBox from "./pages/ChatBox";

function App() {
  const [showChat, setShowChat] = useState(false);

  const projects = [
    {
      title: "AI Study Buddy",
      desc: "Helps students plan studies smarter using AI.",
    },
    {
      title: "Campus Connect",
      desc: "Connects students working on similar ideas.",
    },
    {
      title: "Dev Portfolio Builder",
      desc: "Create and deploy portfolios easily.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* HERO */}
      <h1 style={styles.title}>SyncUp 🚀</h1>

      <p style={styles.subtitle}>
        Find teammates, build real-world projects, and grow together through collaboration.
      </p>

      {/* BUTTONS */}
      <div style={styles.buttonRow}>
  
  {/* Explore → scroll to projects */}
  <button
    style={styles.secondaryBtn}
    onClick={() =>
      document.getElementById("projects").scrollIntoView({ behavior: "smooth" })
    }
  >
    Explore Projects
  </button>

  {/* Join → opens project form */}
  <button
    style={styles.primaryBtn}
    onClick={() => setShowChat(false)}
  >
    Join a Project
  </button>

</div>
      {/* PROJECTS */}
      <div id="projects" style={styles.section}>
  <h2>Featured Projects</h2>

  {/* Add Project Form */}
  <div style={styles.form}>
    <input id="title" placeholder="Project Title" style={styles.input} />
    <input id="desc" placeholder="Project Description" style={styles.input} />

    <button
      style={styles.primaryBtn}
      onClick={() => {
        const title = document.getElementById("title").value;
        const desc = document.getElementById("desc").value;

        if (!title || !desc) return;

        setProjects([...projects, { title, desc }]);

        document.getElementById("title").value = "";
        document.getElementById("desc").value = "";
      }}
    >
      Add Project
    </button>
  </div>

  {/* Project List */}
  <div style={styles.grid}>
    {projects.map((p, i) => (
      <div key={i} style={styles.card}>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>

        <button
          style={styles.secondaryBtn}
          onClick={() => setShowChat(true)}
        >
          Open Chat
        </button>
      </div>
    ))}
  </div>
</div>
      {/* CHAT POPUP */}
      {showChat && (
        <div style={styles.chatOverlay}>
          <div style={styles.chatBox}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowChat(false)}
            >
              ✖
            </button>

            <ChatBox />
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "50px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  title: {
    fontSize: "52px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#cbd5e1",
    marginBottom: "25px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "40px",
  },

  primaryBtn: {
    padding: "12px 20px",
    backgroundColor: "#22c55e",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryBtn: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "220px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
  },

  chatOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBox: {
    width: "350px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    position: "relative",
    overflow: "hidden",
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },
  section: {
  marginTop: "40px",
},

form: {
  marginBottom: "20px",
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  flexWrap: "wrap",
},

input: {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
},
};

export default App;
