import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AIProjectCopilot() {
  const [idea, setIdea] = useState("");
  const [generatedProject, setGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg"; // Keep your key

  const generateProject = async () => {
    if (!idea.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are SyncUp AI Project Copilot. 
User Idea: "${idea}"

Generate a professional, exciting project brief in this exact format:

**🚀 Project Title**
(A catchy title)

**📝 Description**
(2-3 inspiring paragraphs)

**🛠 Recommended Tech Stack**
- Frontend:
- Backend:
- Database:
- Others:

**✨ Core Features**
- Feature 1
- Feature 2
- etc.

**👥 Ideal Team Roles** (4-5 roles)

**📅 Suggested Roadmap**
1. Week 1-2: ...
2. Week 3-4: ...

Make it realistic and inspiring for students. Use emojis.`
              }]
            }]
          })
        }
      );

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate.";

      setGeneratedProject({
        title: idea.slice(0, 60) + (idea.length > 60 ? "..." : ""),
        fullBrief: aiText,
        idea: idea,
        createdBy: auth.currentUser?.email,
        members: [auth.currentUser?.uid],
        status: "planning"
      });
    } catch (err) {
      console.error(err);
      alert("AI generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!generatedProject) return;
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...generatedProject,
        createdAt: serverTimestamp(),
      });
      alert("Project saved successfully!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Failed to save project.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.content}>
        <h1 style={styles.title}>AI Project Copilot 🌌</h1>
        <p style={styles.subtitle}>Describe your idea. AI builds a complete professional project plan.</p>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="I want to build a platform where students can find teammates for hackathons..."
          style={styles.textarea}
        />

        <button
          onClick={generateProject}
          disabled={loading || !idea.trim()}
          style={styles.generateBtn}
        >
          {loading ? "Generating Magic..." : "✨ Generate Project with AI"}
        </button>

        {generatedProject && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>AI Generated Project</h2>
            <div style={styles.brief}>{generatedProject.fullBrief}</div>

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>
                ✅ Save & Continue to Project
              </button>
              <button onClick={() => setGeneratedProject(null)} style={styles.newBtn}>
                Generate Another Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================== PREMIUM STYLES ====================== */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)",
    color: "#fff",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 20% 20%, rgba(236,72,153,0.15), transparent 60%), 
                 radial-gradient(circle at 80% 30%, rgba(79,140,255,0.12), transparent 70%)`,
    zIndex: 0,
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "2.8rem",
    textAlign: "center",
    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "12px",
  },
  subtitle: {
    textAlign: "center",
    color: "#b7c0d1",
    fontSize: "1.25rem",
    marginBottom: "40px",
  },
  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: "22px",
    fontSize: "1.1rem",
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.3)",
    borderRadius: "20px",
    color: "#fff",
    resize: "vertical",
    marginBottom: "24px",
  },
  generateBtn: {
    width: "100%",
    padding: "18px",
    fontSize: "1.2rem",
    fontWeight: 600,
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    marginBottom: "40px",
  },
  result: {
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "22px",
    padding: "36px",
  },
  resultTitle: {
    color: "#ec4899",
    marginBottom: "20px",
  },
  brief: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
    background: "rgba(0,0,0,0.3)",
    padding: "28px",
    borderRadius: "16px",
    fontSize: "15px",
    marginBottom: "32px",
  },
  actions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  saveBtn: {
    padding: "16px 36px",
    background: "#ec4899",
    color: "white",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
  newBtn: {
    padding: "16px 36px",
    background: "transparent",
    color: "#b7c0d1",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "999px",
    cursor: "pointer",
  },
};
