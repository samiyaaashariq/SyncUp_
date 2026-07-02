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
  const [activeTab, setActiveTab] = useState("brief");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const GEMINI_API_KEY = "AQ.Ab8RN6IYPTjsPBGm_Igbw5J_K0snpfZ3E4e269Ysm-ZRk1nEwg";

  const callGemini = async (prompt) => {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 1800 }
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`API Error ${res.status}: ${errorData?.error?.message || "Invalid Key"}`);
      }

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    } catch (err) {
      throw err;
    }
  };

  const generateProject = async () => {
    if (!idea.trim()) return alert("Please enter an idea!");

    setLoading(true);
    setErrorMsg("");
    try {
      const prompt = `You are a professional startup mentor. Create a complete project for this idea: "${idea}".

Include these sections in Markdown:
- 🚀 Project Title
- 📝 Detailed Description
- 🛠 Recommended Tech Stack
- ✨ Core Features (8-10 bullet points)
- 📅 8-Week Development Roadmap
- 👥 Suggested Team Roles
- 💻 Sample Code Structure (folder layout + example files)`;

      const aiText = await callGemini(prompt);

      const newProject = {
        title: idea.slice(0, 80),
        fullBrief: aiText,
        idea: idea,
        createdBy: auth.currentUser?.email,
        members: [auth.currentUser?.uid],
        status: "planning",
        aiGenerated: true,
      };

      setGeneratedProject(newProject);
      setChatHistory([{ role: "assistant", content: aiText }]);
    } catch (err) {
      setErrorMsg(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !generatedProject) return;

    const userMsg = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const temp = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      const prompt = `Project Idea: ${generatedProject.idea}\n\nCurrent Plan:\n${generatedProject.fullBrief}\n\nUser Question: ${temp}\nGive a detailed response.`;
      const reply = await callGemini(prompt);
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't respond." }]);
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
        chatHistory,
      });
      alert("Project saved successfully!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Failed to save project.");
    }
  };

  const exportMarkdown = () => {
    if (!generatedProject) return;
    const md = `# ${generatedProject.title}\n\n${generatedProject.fullBrief}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-plan.md";
    a.click();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>AI Project Copilot 🌌</h1>
          <p style={styles.subtitle}>Full Startup Project Generator with Roadmap, Code & Features</p>
        </div>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="I want to build a platform that connects students for hackathons with real-time collaboration..."
          style={styles.textarea}
        />

        <button onClick={generateProject} disabled={loading || !idea.trim()} style={styles.generateBtn}>
          {loading ? "Generating Complete Plan..." : "🚀 Generate Full Project"}
        </button>

        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <h2 style={{ color: "#c084fc" }}>{generatedProject.title}</h2>

            <div style={styles.tabs}>
              {["brief", "chat"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tabBtn,
                    background: activeTab === tab ? "#67e8f9" : "transparent",
                    color: activeTab === tab ? "#0f172a" : "#fff"
                  }}
                >
                  {tab === "brief" ? "📋 Full Plan" : "💬 AI Chat"}
                </button>
              ))}
            </div>

            {activeTab === "brief" && (
              <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />
            )}

            {activeTab === "chat" && (
              <div style={styles.chatContainer}>
                <div style={styles.chatWindow}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
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
                    placeholder="Ask for code examples, roadmap changes, tech alternatives..."
                    style={styles.chatInput}
                  />
                  <button onClick={sendChatMessage} disabled={loading} style={styles.sendBtn}>Send</button>
                </div>
              </div>
            )}

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>💾 Save to SyncUp</button>
              <button onClick={exportMarkdown} style={styles.exportBtn}>📤 Export Markdown</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1c, #1a2338)", color: "#fff", padding: "40px 20px", fontFamily: "Inter, sans-serif" },
  glow: { position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(103,232,249,0.22), transparent 60%)", zIndex: 0 },
  content: { maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "3.4rem", fontWeight: 800, background: "linear-gradient(90deg, #67e8f9, #c084fc, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: "#94a3b8", fontSize: "1.3rem" },
  textarea: { width: "100%", minHeight: "180px", padding: "28px", fontSize: "1.2rem", background: "rgba(15,23,42,0.95)", border: "2px solid rgba(103,232,249,0.5)", borderRadius: "24px", color: "#e2e8f0", resize: "vertical" },
  generateBtn: { width: "100%", padding: "20px", fontSize: "1.35rem", background: "linear-gradient(135deg, #c084fc, #67e8f9)", border: "none", borderRadius: "9999px", cursor: "pointer", boxShadow: "0 10px 30px rgba(103,232,249,0.4)", marginBottom: "30px" },
  result: { background: "rgba(15,23,42,0.97)", border: "1px solid rgba(168,85,247,0.5)", borderRadius: "28px", padding: "40px" },
  tabs: { display: "flex", gap: 15, margin: "25px 0" },
  tabBtn: { padding: "12px 30px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600 },
  brief: { lineHeight: "1.85", padding: "32px", background: "#0f172a", borderRadius: "20px", whiteSpace: "pre-wrap" },
  chatContainer: { marginTop: "30px" },
  chatWindow: { height: "420px", overflowY: "auto", background: "#0f172a", padding: "20px", borderRadius: "16px", border: "1px solid #334155" },
  userMsg: { background: "#334155", padding: "14px 20px", borderRadius: "18px 18px 4px 18px", maxWidth: "80%", marginLeft: "auto", marginBottom: 12 },
  aiMsg: { background: "rgba(103,232,249,0.15)", padding: "14px 20px", borderRadius: "18px 18px 18px 4px", maxWidth: "80%", marginBottom: 12 },
  chatInputArea: { display: "flex", gap: 12, marginTop: 15 },
  chatInput: { flex: 1, padding: "16px", background: "#1e2937", border: "1px solid #67e8f9", borderRadius: "999px", color: "#fff" },
  sendBtn: { padding: "16px 36px", background: "#67e8f9", color: "#0f172a", border: "none", borderRadius: "999px", fontWeight: 600 },
  actions: { marginTop: "40px", display: "flex", gap: 16, flexWrap: "wrap" },
  saveBtn: { padding: "18px 48px", background: "#ec4899", color: "white", border: "none", borderRadius: "999px", fontWeight: 700 },
  exportBtn: { padding: "18px 40px", background: "transparent", border: "1px solid #67e8f9", color: "#67e8f9", borderRadius: "999px" },
  error: { color: "#fda4af", background: "rgba(248,113,113,0.15)", padding: "16px", borderRadius: "12px", marginBottom: "20px" }
};
