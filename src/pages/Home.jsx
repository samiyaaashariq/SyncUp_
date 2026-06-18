import React from "react";

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SyncUp 🚀</h1>

      <p style={styles.subtitle}>
        Find teammates, build real-world projects, and grow together with
        collaboration-driven learning.
      </p>

      <div style={styles.buttonRow}>
        <button style={styles.primaryBtn}>Join a Project</button>
        <button style={styles.secondaryBtn}>Explore Projects</button>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h2>Collaborate</h2>
          <p>Work with like-minded students on real ideas.</p>
        </div>

        <div style={styles.card}>
          <h2>Build</h2>
          <p>Create real-world projects that matter.</p>
        </div>

        <div style={styles.card}>
          <h2>Grow</h2>
          <p>Improve skills through teamwork and execution.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
    padding: "60px",
  },

  title: {
    fontSize: "52px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "40px",
  },

  primaryBtn: {
    padding: "12px 22px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 22px",
    background: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: "8px",
    cursor: "pointer",
  },

  cardGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "200px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
};

export default Home;
