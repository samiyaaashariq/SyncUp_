import React from "react";

function App() {
  const projects = [
    {
      title: "AI Study Buddy",
      desc: "An AI tool to help students plan and study smarter.",
    },
    {
      title: "Campus Connect",
      desc: "A platform to connect students within the same college.",
    },
    {
      title: "Dev Portfolio Builder",
      desc: "Generate and host developer portfolios easily.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <h1 style={styles.title}>SyncUp 🚀</h1>

      <p style={styles.subtitle}>
        Find teammates, build real-world projects, and grow together through collaboration.
      </p>

      {/* BUTTONS */}
      <div style={styles.buttonRow}>
        <button style={styles.primaryBtn}>Join a Project</button>
        <button style={styles.secondaryBtn}>Explore Projects</button>
      </div>

      {/* PROJECT SECTION */}
      <h2 style={styles.sectionTitle}>Featured Projects</h2>

      <div style={styles.grid}>
        {projects.map((project, index) => (
          <div key={index} style={styles.card}>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },

  title: {
    fontSize: "52px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
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
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 20px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: "8px",
    cursor: "pointer",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "20px",
    marginTop: "20px",
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
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
};

export default App;
