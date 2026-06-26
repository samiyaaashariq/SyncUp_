import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* glow background */}
      <div style={styles.glow} />

      {/* CARD */}
      <div style={styles.card}>

        <h1 style={styles.logo}>SyncUp</h1>
        <p style={styles.subtitle}>Create your builder account</p>

        <form onSubmit={handleSignup}>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>

      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",

    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)"
  },

  glow: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(79,140,255,0.25), transparent 55%),
      radial-gradient(circle at 80% 30%, rgba(236,72,153,0.15), transparent 60%),
      radial-gradient(circle at 50% 80%, rgba(99,102,241,0.12), transparent 60%)
    `
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "420px",
    padding: "40px 30px",
    borderRadius: "16px",

    background: "rgba(15, 23, 42, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
  },

  logo: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "6px",

    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    textAlign: "center",
    color: "#aab2c0",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",

    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",

    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "#fff",
    fontWeight: "600",

    boxShadow: "0 10px 30px rgba(79,140,255,0.25)"
  },

  error: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: "10px"
  },

  bottomText: {
    textAlign: "center",
    marginTop: "18px",
    color: "#aab2c0"
  },

  link: {
    color: "#4f8cff",
    textDecoration: "none"
  }
};
