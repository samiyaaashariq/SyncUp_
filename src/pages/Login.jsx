import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 SyncUp</h1>
        <p style={styles.subtitle}>
          Welcome back. Continue building.
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

// 🎨 STYLES (STARTUP LOOK)
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    background: "#f4f6ff"
  },

  card: {
    width: "320px",
    padding: "25px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center"
  },

  title: {
    color: "#4f46e5",
    marginBottom: "5px"
  },

  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "10px"
  }
};
