import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AIProjectCopilot() {
  const [idea, setIdea] = useState("");
  const [generatedProject, setGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const GEMINI_API_KEY = "AQ.Ab8RN6LNrYOk5ZmkfFq7dYzfRfDupZUJCiCt_rRe9zBr-kAhJQ";

  const improvedPrompt = (userIdea, extraRefine = "") => `
You are SyncUp AI Project Copilot — a futuristic mentor for student builders.

User Idea: "${userIdea}"
${extraRefine ? `Refinement: ${extraRefine}` : ""}

Generate in this **exact** markdown format with emojis:

**🚀 Project Title**
(Catchy title)

**📝 Description**
(2-3 inspiring paragraphs)

**🛠 Recommended Tech Stack**
- **Frontend:** 
- **Backend:** 
- **Database:** 
- **Others:**

**✨ Core Features**
- 6-8 realistic features

**👥 Ideal Team Roles** (4-5 roles)

**📅 Suggested 8-Week Roadmap**
1. Week 1-2: ...
...

**💡 Pro Tips for Students**

Make it exciting, realistic, and portfolio-worthy for students.`;

  const generateProject = async (isRefine = false) => {
    const currentIdea = isRefine ? (generatedProject?.idea || idea) : idea;
    if (!currentIdea.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: improvedPrompt(currentIdea, isRefine ? refinePrompt : "") }] }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 1300 },
          })
        }
      );

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Generation failed. Try again.";

      const newProject = {
        title: currentIdea.slice(0, 65) + (currentIdea.length > 65 ? "..." : ""),
        fullBrief: aiText,
        idea: currentIdea,
        createdBy: auth.currentUser?.email,
        members: [auth.currentUser?.uid],
        status: "planning",
        aiGenerated: true,
      };

      setGeneratedProject(newProject);

      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch (err) {
      console.error(err);
      alert("AI generation failed. Check console or API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveProject = async () => {
    if (!generatedProject) return;
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...generatedProject,
        createdAt: serverTimestamp(),
      });
      alert("🚀 Project saved successfully!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Failed to save project.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Project Copilot 🌌</h1>
            <p style={styles.subtitle}>Describe your idea → Get a full professional project plan instantly.</p>
          </div>
        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="I want to build a platform where students can find teammates for hackathons..."
          style={styles.textarea}
        />

        <button
          onClick={() => generateProject(false)}
          disabled={loading || !idea.trim()}
          style={styles.generateBtn}
        >
          {loading ? "Generating Magic..." : "✨ Generate Project with AI"}
        </button>

        {/* Quick Examples */}
        <div style={styles.examples}>
          <p style={{ color: '#64748b', marginBottom: 10 }}>Quick ideas:</p>
          {["Hackathon teammate matcher", "AI study buddy with flashcards", "Campus lost & found QR system", "Student freelance gig board"].map((ex, i) => (
            <button key={i} onClick={() => setIdea(ex)} style={styles.exampleTag}>
              {ex}
            </button>
          ))}
        </div>

        {/* Result */}
        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>✨ Your AI Project Brief</h2>
              <button onClick={() => copyToClipboard(generatedProject.fullBrief)} style={styles.copyBtn}>
                📋 {copied ? "Copied!" : "Copy Brief"}
              </button>
            </div>

            <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />

            {/* Refine */}
            <div style={styles.refineSection}>
              <h4 style={{ color: '#67e8f9', marginBottom: 12 }}>Refine this brief</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Make it more mobile friendly or add AR features..."
                  style={styles.refineInput}
                />
                <button onClick={() => generateProject(true)} disabled={loading} style={styles.refineBtn}>
                  🔄 Refine
                </button>
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>
                ✅ Save to SyncUp
              </button>
              <button onClick={() => { setGeneratedProject(null); setRefinePrompt(""); }} style={styles.newBtn}>
                New Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0f1c 0%, #1a2338 50%, #05070f 100%)",
    color: "#fff",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 25% 25%, rgba(103,232,249,0.18), transparent 60%), radial-gradient(circle at 75% 65%, rgba(168,85,247,0.16), transparent 70%)`,
    zIndex: 0,
  },
  content: { maxWidth: "980px", margin: "0 auto", position: "relative", zIndex: 1 },
  header: { marginBottom: "32px" },
  title: {
    fontSize: "2.9rem",
    fontWeight: 700,
    background: "linear-gradient(90deg, #67e8f9, #c084fc, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#94a3b8", fontSize: "1.25rem" },
  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "24px",
    fontSize: "1.15rem",
    background: "rgba(15,23,42,0.92)",
    border: "2px solid rgba(103,232,249,0.4)",
    borderRadius: "20px",
    color: "#e2e8f0",
    resize: "vertical",
    marginBottom: "20px",
  },
  generateBtn: {
    width: "100%",
    padding: "18px",
    fontSize: "1.25rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #c084fc, #67e8f9)",
    border: "none",
    borderRadius: "9999px",
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(103,232,249,0.5)",
  },
  examples: { margin: "30px 0" },
  exampleTag: {
    padding: "8px 18px",
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(103,232,249,0.4)",
    borderRadius: "9999px",
    color: "#bae6fd",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "8px",
  },
  result: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(168,85,247,0.4)",
    borderRadius: "24px",
    padding: "40px",
  },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  resultTitle: { color: "#c084fc", fontSize: "1.8rem" },
  copyBtn: { 
    padding: "10px 22px", 
    background: "transparent", 
    border: "1px solid #67e8f9", 
    color: "#67e8f9", 
    borderRadius: "9999px", 
    cursor: "pointer" 
  },
  brief: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.85",
    background: "rgba(2,6,23,0.8)",
    padding: "32px",
    borderRadius: "18px",
    fontSize: "1.02rem",
    borderLeft: "5px solid #67e8f9",
    marginBottom: "32px",
  },
  refineSection: {
    background: "rgba(0,0,0,0.35)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px dashed rgba(103,232,249,0.5)",
    marginBottom: "32px",
  },
  refineInput: {
    flex: 1,
    padding: "14px 20px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid rgba(103,232,249,0.5)",
    borderRadius: "9999px",
    color: "#fff",
  },
  refineBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #67e8f9, #c084fc)",
    color: "#0f172a",
    fontWeight: 600,
    border: "none",
    borderRadius: "9999px",
    cursor: "pointer",
  },
  actions: { display: "flex", gap: "16px", flexWrap: "wrap" },
  saveBtn: {
    padding: "16px 40px",
    background: "linear-gradient(135deg, #ec4899, #c026d3)",
    color: "white",
    border: "none",
    borderRadius: "9999px",
    fontWeight: 700,
    cursor: "pointer",
  },
  newBtn: {
    padding: "16px 40px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(148,163,184,0.6)",
    borderRadius: "9999px",
    cursor: "pointer",
  },
};
