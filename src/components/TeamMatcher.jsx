import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

export default function TeamMatcher({ project }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const user = auth.currentUser;

  const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg";

  const generateMatches = async () => {
    if (!project) return;
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
                text: `Project: ${project.title || "Untitled Project"}
Description: ${project.idea || project.fullBrief || project.description || ""}

Suggest ideal teammates for this student project. Return in this format:

**Key Skills Needed:**
- Skill 1, Skill 2...

**Recommended Teammates:**
1. Role - Match % - Reason
2. Role - Match % - Reason

Keep it short and practical.`
              }]
            }]
          })
        }
      );

      const data = await res.json();
      const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Analysis unavailable.";
      setAiAnalysis(analysis);

      setSuggestions([
        { name: "Alex Chen", role: "Frontend Dev", match: "92%", reason: "React + Tailwind" },
        { name: "Priya Sharma", role: "Backend Dev", match: "87%", reason: "Firebase Expert" },
        { name: "Jordan Lee", role: "Designer", match: "79%", reason: "UI/UX Skills" },
      ]);

    } catch (err) {
      console.error(err);
      setAiAnalysis("Matching temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) generateMatches();
  }, [project]);

  if (!project) return null;

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.95)",
      border: "1px solid #334155",
      borderRadius: "16px",
      padding: "24px",
      marginTop: "30px",
      color: "#e0f2f1"
    }}>
      <h3 style={{ color: "#00ff9f", marginBottom: "16px" }}>🤝 Smart Team Matching</h3>

      {aiAnalysis && (
        <div style={{
          background: "#0f172a",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "20px",
          whiteSpace: "pre-wrap"
        }}>
          {aiAnalysis}
        </div>
      )}

      <h4 style={{ color: "#80cbc4" }}>Suggested Teammates</h4>

      {suggestions.map((member, i) => (
        <div key={i} style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#1e2937",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "12px"
        }}>
          <div>
            <strong>{member.name}</strong><br />
            <span style={{ color: "#80cbc4" }}>{member.role}</span><br />
            <small>{member.reason}</small>
          </div>
          <div style={{
            background: "#00ff9f",
            color: "#0a0a0a",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontWeight: "bold",
            alignSelf: "center"
          }}>
            {member.match}
          </div>
        </div>
      ))}
    </div>
  );
}
