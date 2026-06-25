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

  const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg";

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
(A catchy, professional title)

**📝 Description**
(2-3 strong paragraphs)

**🛠 Recommended Tech Stack**
- Frontend:
- Backend:
- Database:
- Others:

**✨ Core Features**
- Feature 1
- Feature 2
- etc.

**👥 Ideal Team Roles** (4-5 roles with why needed)

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
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate project.";

      setGeneratedProject({
        title: idea.slice(0, 60) + (idea.length > 60 ? "..." : ""),
        fullBrief: aiText,
        idea: idea,
        createdBy: user?.email,
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

      alert("✅ Project Created Successfully!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      console.error(e);
      alert("Failed to save project.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      padding: "40px 20px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{
          fontSize: "3rem",
          textAlign: "center",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "10px"
        }}>
          AI Project Copilot 🌌
        </h1>
        <p style={{ textAlign: "center", color: "#80cbc4", fontSize: "1.2rem" }}>
          Describe your idea → AI builds complete project plan
        </p>

        <div style={{ marginTop: "40px" }}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I want to build a platform where students can find teammates for hackathons..."
            style={{
              width: "100%",
              minHeight: "160px",
              padding: "20px",
              fontSize: "1.1rem",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              color: "#e0f2f1",
              resize: "vertical"
            }}
          />

          <button
            onClick={generateProject}
            disabled={loading || !idea.trim()}
            style={{
              marginTop: "20px",
              padding: "16px 40px",
              background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "50px",
              fontSize: "1.15rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%"
            }}
          >
            {loading ? "Generating Project Brief..." : "Generate Project with AI"}
          </button>
        </div>

        {generatedProject && (
          <div style={{
            marginTop: "50px",
            background: "rgba(15, 23, 42, 0.95)",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #334155"
          }}>
            <h2 style={{ color: "#00ff9f" }}>AI Generated Project</h2>
            <div style={{ 
              whiteSpace: "pre-wrap", 
              lineHeight: "1.8", 
              marginTop: "20px",
              background: "#0f172a",
              padding: "25px",
              borderRadius: "12px"
            }}>
              {generatedProject.fullBrief}
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <button
                onClick={saveProject}
                style={{
                  padding: "16px 36px",
                  background: "#00ff9f",
                  color: "#0a0a0a",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: "700"
                }}
              >
                ✅ Save Project & Continue
              </button>

              <button
                onClick={() => setGeneratedProject(null)}
                style={{
                  padding: "16px 36px",
                  background: "transparent",
                  color: "#80cbc4",
                  border: "2px solid #334155",
                  borderRadius: "50px"
                }}
              >
                Generate Another Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
