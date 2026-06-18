import React from "react";

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>SyncUp</h1>

      <p style={styles.subtext}>
        Find teammates, build projects, and bring ideas to life together.
      </p>

      <div style={styles.card}>
        <h2>Welcome to SyncUp 🚀</h2>
        <p>
          A platform where students collaborate, build real-world projects,
          and grow together.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "50px",
  },
  heading: {
    fontSize: "48px",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
  },
  card: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default App;
