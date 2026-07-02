import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AIProjectCopilot() {
  const [idea, setIdea] = useState("");
  const [generatedProject, setGeneratedProject] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("full"); // full, tech, roadmap, features
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState(null);

  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  // ←←← Replace with your real Gemini API key ←←←
  const GEMINI_API_KEY = "AQ.Ab8RN6IHb5u2NxidxT99lxdaGY1T_XlzgMa3cTds1bczy1IUcw";

  const systemPrompt = (userIdea, extraContext = "") => `
You are SyncUp AI Project Copilot — an elite startup mentor for student developers and indie hackers.

User Idea: "${userIdea}"
${extraContext ? `Additional Context: ${extraContext}` : ""}

Generate extremely high-quality, realistic, and exciting project plans suitable for portfolios, hackathons, and startup MVPs.

Always respond in clean Markdown with proper headings and emojis.`;

  const generateProject = async (isRefine = false, customPrompt = "") => {
    const currentIdea = isRefine ? (generatedProject?.idea || idea) : idea;
    if (!currentIdea.trim()) {
      alert("Please enter an idea first!");
      return;
    }

    setLoading(true);
    try {
      const prompt = customPrompt || systemPrompt(currentIdea, isRefine ? chatInput : "");

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.82, maxOutputTokens: 1500, topP: 0.95 },
          })
        }
      );

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) throw new Error("Empty response from AI");

      const newProject = {
        title: currentIdea.slice(0, 80) + (currentIdea.length > 80 ? "..." : ""),
        fullBrief: aiText,
        idea: currentIdea,
        createdBy: auth.currentUser?.email || "anonymous",
        members: [auth.currentUser?.uid],
        status: "planning",
        aiGenerated: true,
        generatedAt: new Date().toISOString(),
        mode,
      };

      setGeneratedProject(newProject);
      setScore(calculateProjectScore(aiText));
      setChatHistory([{ role: "assistant", content: aiText }]);
      
      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !generatedProject) return;

    const userMsg = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      const context = generatedProject.fullBrief;
      const prompt = `You are helping refine this project: "${generatedProject.idea}"\n\nCurrent Brief:\n${context}\n\nUser Question: ${currentInput}\n\nGive a helpful, detailed response.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
          })
        }
      );

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: "assistant", content: "⚠️ Failed to get response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectScore = (brief) => {
    let score = 75;
    if (brief.includes("MVP") || brief.includes("scal")) score += 8;
    if (brief.includes("authentication") || brief.includes("user")) score += 7;
    if (brief.toLowerCase().includes("ai") || brief.toLowerCase().includes("ml")) score += 10;
    return Math.min(98, score);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const saveProject = async () => {
    if (!generatedProject) return;
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...generatedProject,
        createdAt: serverTimestamp(),
        chatHistory: chatHistory,
      });
      alert("🎉 Project saved successfully!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Failed to save to database.");
    }
  };

  const exportMarkdown = () => {
    if (!generatedProject) return;
    const md = `# ${generatedProject.title}\n\n${generatedProject.fullBrief}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedProject.title.replace(/\s+/g, '-')}.md`;
    a.click();
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>AI Project Copilot <span style={{ fontSize: "2rem" }}>🌌</span></h1>
          <p style={styles.subtitle}>Turn your idea into a complete, ready-to-build startup project in seconds.</p>
        </div>

        {/* Idea Input */}
        <textarea
          ref={textareaRef}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="I want to build a platform where students can find teammates for hackathons and collaborate in real-time..."
          style={styles.textarea}
        />

        <div style={styles.modeSelector}>
          {["full", "tech", "roadmap", "features"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ ...styles.modeBtn, background: mode === m ? "#67e8f9" : "transparent", color: mode === m ? "#0f172a" : "#67e8f9" }}
            >
              {m === "full" ? "Full Plan" : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => generateProject(false)}
          disabled={loading || !idea.trim()}
          style={styles.generateBtn}
        >
          {loading ? "✨ Thinking..." : "🚀 Generate Project Plan"}
        </button>

        {/* Quick Examples */}
        <div style={styles.examples}>
          <p style={{ color: '#64748b', marginBottom: 8 }}>Try these ideas:</p>
          {[
            "Hackathon teammate matcher with AI recommendations",
            "AI-powered campus lost & found with QR codes",
            "Real-time collaborative whiteboard for students",
            "Student freelance marketplace with skill matching"
          ].map((ex, i) => (
            <button key={i} onClick={() => setIdea(ex)} style={styles.exampleTag}>
              {ex}
            </button>
          ))}
        </div>

        {/* Results Section */}
        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <div style={styles.resultHeader}>
              <div>
                <h2 style={styles.resultTitle}>{generatedProject.title}</h2>
                <div style={styles.score}>Project Score: <strong>{score}/100</strong> 🔥</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => copyToClipboard(generatedProject.fullBrief)} style={styles.copyBtn}>
                  📋 {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={exportMarkdown} style={styles.copyBtn}>⬇️ Export MD</button>
              </div>
            </div>

            <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />

            {/* AI Chat Copilot */}
            <div style={styles.chatContainer}>
              <h3 style={{ color: "#c084fc", marginBottom: 12 }}>💬 Ask your AI Copilot</h3>
              <div style={styles.chatWindow}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={msg.role === "user" ? styles.userMsg : styles.assistantMsg}>
                    {msg.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={styles.chatInputArea}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Ask anything... (e.g., add authentication, tech alternatives, monetization ideas)"
                  style={styles.chatInput}
                />
                <button onClick={sendChatMessage} disabled={loading} style={styles.sendBtn}>Send</button>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>✅ Save to SyncUp</button>
              <button onClick={() => { setGeneratedProject(null); setChatHistory([]); }} style={styles.newBtn}>
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
    fontFamily: "Inter, system-ui, sans-serif",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 30% 20%, rgba(103,232,249,0.22), transparent 60%), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.18), transparent 70%)`,
    zIndex: 0,
  },
  content: { maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "40px" },
  title: {
    fontSize: "3.2rem",
    fontWeight: 800,
    background: "linear-gradient(90deg, #67e8f9, #c084fc, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 8,
  },
  subtitle: { color: "#94a3b8", fontSize: "1.3rem" },
  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: "28px",
    fontSize: "1.2rem",
    background: "rgba(15,23,42,0.95)",
    border: "2px solid rgba(103,232,249,0.5)",
    borderRadius: "24px",
    color: "#e2e8f0",
    resize: "vertical",
    marginBottom: "20px",
  },
  modeSelector: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  modeBtn: {
    padding: "10px 20px",
    borderRadius: "9999px",
    border: "1px solid #67e8f9",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  generateBtn: {
    width: "100%",
    padding: "20px",
    fontSize: "1.3rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #c084fc, #67e8f9)",
    border: "none",
    borderRadius: "9999px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(103,232,249,0.4)",
    marginBottom: "30px",
  },
  examples: { margin: "30px 0" },
  exampleTag: {
    padding: "10px 20px",
    background: "rgba(30,41,59,0.9)",
    border: "1px solid rgba(103,232,249,0.4)",
    borderRadius: "9999px",
    color: "#bae6fd",
    cursor: "pointer",
    margin: "4px 6px 4px 0",
  },
  result: {
    background: "rgba(15,23,42,0.97)",
    border: "1px solid rgba(168,85,247,0.5)",
    borderRadius: "28px",
    padding: "40px",
    marginTop: "30px",
  },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 },
  resultTitle: { color: "#c084fc", fontSize: "2.1rem", margin: 0 },
  score: { color: "#4ade80", fontSize: "1.1rem", marginTop: 6 },
  brief: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.85",
    background: "rgba(2,6,23,0.9)",
    padding: "36px",
    borderRadius: "20px",
    fontSize: "1.05rem",
    borderLeft: "6px solid #67e8f9",
    margin: "30px 0",
  },
  chatContainer: { marginTop: "40px" },
  chatWindow: {
    height: "380px",
    overflowY: "auto",
    background: "rgba(0,0,0,0.4)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid rgba(103,232,249,0.2)",
  },
  userMsg: { background: "#1e2937", padding: "14px 18px", borderRadius: "18px 18px 4px 18px", marginBottom: 12, maxWidth: "85%", alignSelf: "flex-end", marginLeft: "auto" },
  assistantMsg: { background: "rgba(103,232,249,0.1)", padding: "14px 18px", borderRadius: "18px 18px 18px 4px", marginBottom: 12, maxWidth: "85%" },
  chatInputArea: { display: "flex", gap: 12 },
  chatInput: {
    flex: 1,
    padding: "16px 20px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "9999px",
    color: "#fff",
  },
  sendBtn: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #67e8f9, #c084fc)",
    color: "#0f172a",
    border: "none",
    borderRadius: "9999px",
    fontWeight: 600,
    cursor: "pointer",
  },
  actions: { display: "flex", gap: "16px", marginTop: "40px", flexWrap: "wrap" },
  saveBtn: {
    padding: "18px 48px",
    background: "linear-gradient(135deg, #ec4899, #c026d3)",
    color: "white",
    border: "none",
    borderRadius: "9999px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1.1rem",
  },
  newBtn: {
    padding: "18px 40px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid rgba(148,163,184,0.7)",
    borderRadius: "9999px",
    cursor: "pointer",
  },
  copyBtn: {
    padding: "10px 24px",
    background: "transparent",
    border: "1px solid #67e8f9",
    color: "#67e8f9",
    borderRadius: "9999px",
    cursor: "pointer",
  },
};
