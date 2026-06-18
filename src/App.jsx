import React from "react";

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>SyncUp</h1>

      <p style={styles.subtext}>
        Find teammates, build projects, and bring ideas to life together.
      </p>

      {/* Buttons Section */}
      <div style={styles.buttonContainer}>
        <button style={styles.primaryButton}>Join Project</button>
        <button style={styles.secondaryButton}>Explore Projects</button>
      </div>

      {/* Info Card */}
      <div style={styles.card}>
        <h2>Build Together 🚀</h2>
        <p>
          A platform where students collaborate, build real-world projects,
          and grow together through teamwork and innovation.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "60px",
  },

  heading: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  subtext: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "25px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
  },

  primaryButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#fff",
    color: "#000",
    border: "1px solid #000",
    borderRadius: "6px",
    cursor: "pointer",
  },

  card: {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
};

export default App;
