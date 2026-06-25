import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AIProjectCopilot() {
  const [idea, setIdea] = useState("");
  const [generatedProject, setGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg"; // ← Your key

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

User has this idea: "${idea}"

Generate a complete project brief in this exact format:

**🚀 Project Title**
(One catchy title)

**📝 Description**
(2-3 engaging paragraphs)

**🛠 Tech Stack**
- Frontend:
- Backend:
- Database:
- Other:

**✨ Key Features**
- Feature 1
- Feature 2
- etc.

**👥 Suggested Team Roles** (3-5 roles with why they are needed)

**📅 Development Roadmap**
1. Week 1-2: ...
2. Week 3-4: ...

**🎯 Success Metrics**
- Metric 1
- Metric 2

Make it exciting and realistic for students. Use emojis.`
              }]
            }]
          })
        }
      );

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate.";

      setGeneratedProject({
        title: idea.split(" ").slice(0, 6).join(" ") + "...",
        fullBrief: aiText,
        idea: idea,
        createdBy: user?.email,
        createdAt: new Date(),
        members: [user?.uid],
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

      alert("Project created successfully! 🎉");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to save project.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "30px",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{
          fontSize: "2.8rem",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "10px"
        }}>
          AI Project Copilot 🌌
        </h1>
        <p style={{ color: "#80cbc4", fontSize: "1.2rem" }}>
          Describe your idea → AI builds the full project plan
        </p>

        <div style={{ marginTop: "30px" }}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I want to build a food delivery app for college students..."
            style={{
              width: "100%",
              height: "140px",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#e0f2f1",
              fontSize: "1.1rem",
              resize: "vertical"
            }}
          />

          <button
            onClick={generateProject}
            disabled={loading || !idea.trim()}
            style={{
              marginTop: "16px",
              padding: "14px 32px",
              background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Generating Magic..." : "Generate Full Project Brief"}
          </button>
        </div>

        {generatedProject && (
          <div style={{
            marginTop: "40px",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid #334155",
            borderRadius: "16px",
            padding: "30px"
          }}>
            <h2 style={{ color: "#00ff9f" }}>AI Generated Project</h2>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", marginTop: "20px" }}>
              {generatedProject.fullBrief}
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
              <button
                onClick={saveProject}
                style={{
                  padding: "14px 28px",
                  background: "#00ff9f",
                  color: "#0a0a0a",
                  border: "none",
                  borderRadius: "9999px",
                  fontWeight: "700"
                }}
              >
                ✅ Save & Go to Project
              </button>

              <button
                onClick={() => setGeneratedProject(null)}
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "#80cbc4",
                  border: "1px solid #334155",
                  borderRadius: "9999px"
                }}
              >
                Generate New Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
