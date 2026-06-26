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
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.card}>
        <div style={styles.logo}>SyncUp</div>
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Creating account..." : "Create Account"}
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

/* ====================== STYLES (same premium theme) ====================== */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Inter, system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f0519 0%, #1a0f2e 45%, #0c0a1f 100%)",
    color: "#f3e8ff",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(167,139,250,0.18), transparent 60%),
      radial-gradient(circle at 80% 30%, rgba(103,232,249,0.12), transparent 70%)
    `,
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "420px",
    padding: "48px 36px",
    borderRadius: "24px",
    background: "rgba(15, 10, 35, 0.92)",
    border: "1px solid rgba(167,139,250,0.3)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
  },
  logo: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: 700,
    color: "#c4b5fd",
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#e0d0ff",
    marginBottom: "32px",
    fontSize: "15px",
  },
  input: {
    width: "100%",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(167,139,250,0.3)",
    background: "rgba(26,15,46,0.8)",
    color: "#f3e8ff",
    fontSize: "15px",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #67e8f9, #a78bfa)",
    color: "#0f0519",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "#ff6b6b",
    textAlign: "center",
    margin: "12px 0",
  },
  bottomText: {
    textAlign: "center",
    marginTop: "28px",
    color: "#e0d0ff",
  },
  link: {
    color: "#67e8f9",
    textDecoration: "none",
    fontWeight: 500,
  },
};
