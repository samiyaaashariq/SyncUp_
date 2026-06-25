import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #121212)",
      color: "#e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        background: "#1f1f1f",
        padding: "40px 30px",
        borderRadius: "16px",
        border: "1px solid #ff00aa",
        width: "100%",
        maxWidth: "420px"
      }}>
        <h1 style={{
          textAlign: "center",
          fontSize: "2.8rem",
          background: "linear-gradient(90deg, #ff00aa, #ff69b4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "10px"
        }}>
          SyncUp
        </h1>
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: "30px" }}>
          Welcome back, builder!
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "15px",
              background: "#0f0f0f",
              border: "1px solid #ff00aa",
              borderRadius: "12px",
              color: "#e0e0e0",
              fontSize: "1.05rem"
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "20px",
              background: "#0f0f0f",
              border: "1px solid #ff00aa",
              borderRadius: "12px",
              color: "#e0e0e0",
              fontSize: "1.05rem"
            }}
            required
          />

          {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(90deg, #ff00aa, #ff1493)",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#aaa" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#ff00aa" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
