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
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 2000 }
        })
      }
    );

    if (!res.ok) throw new Error("API Error 401 - Key issue");
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  const generateProject = async () => {
    if (!idea.trim()) return alert("Please describe your idea");

    setLoading(true);
    setErrorMsg("");
    try {
      const prompt = `Create a complete professional project for: "${idea}".
Sections: 
- Title
- Description
- Tech Stack
- 10 Core Features
- 8 Week Roadmap
- Sample Code Structure`;

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
      const reply = await callGemini(`Project Idea: ${generatedProject.idea}\n\n${generatedProject.fullBrief}\n\nQuestion: ${temp}`);
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!generatedProject) return;
    const docRef = await addDoc(collection(db, "projects"), {
      ...generatedProject,
      createdAt: serverTimestamp(),
      chatHistory
    });
    alert("Project Saved Successfully!");
    navigate(`/project/${docRef.id}`);
  };

  const exportMarkdown = () => {
    if (!generatedProject) return;
    const md = `# ${generatedProject.title}\n\n${generatedProject.fullBrief}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "full-project-plan.md";
    a.click();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <h1 style={styles.title}>AI Project Copilot <span style={{fontSize:"2.8rem"}}>🌌</span></h1>
        <p style={styles.subtitle}>Full-featured AI that generates roadmap, features, code & more</p>

        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your startup idea in detail..."
          style={styles.textarea}
        />

        <button onClick={generateProject} disabled={loading || !idea.trim()} style={styles.generateBtn}>
          {loading ? "Creating Full Project Plan..." : "🚀 Generate Complete Project"}
        </button>

        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <h2 style={{ color: "#c084fc" }}>{generatedProject.title}</h2>

            <div style={styles.tabContainer}>
              {["brief", "roadmap", "features", "chat"].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{...styles.tab, background: activeTab === t ? "#67e8f9" : "transparent", color: activeTab === t ? "#0f172a" : "#fff"}}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === "brief" && <div style={styles.contentArea} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />}

            {activeTab === "chat" && (
              <div>
                <div style={styles.chatWindow}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={msg.role === "user" ? styles.userBubble : styles.aiBubble}>
                      {msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div style={styles.chatInputRow}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask for code snippet, changes, tech alternatives..."
                    style={styles.chatInput}
                  />
                  <button onClick={sendChatMessage} style={styles.sendButton}>Send</button>
                </div>
              </div>
            )}

            <div style={styles.actionBar}>
              <button onClick={saveProject} style={styles.saveButton}>💾 Save to SyncUp</button>
              <button onClick={exportMarkdown} style={styles.exportButton}>📤 Export Markdown</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1c, #1a2338)", color: "#fff", padding: "40px 20px", fontFamily: "Inter, sans-serif" },
  glow: { position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(103,232,249,0.25), transparent)", zIndex: 0 },
  content: { maxWidth: "1100px", margin: "0 auto", zIndex: 1 },
  title: { fontSize: "3.5rem", textAlign: "center", marginBottom: 10, background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { textAlign: "center", color: "#94a3b8", fontSize: "1.4rem" },
  textarea: { width: "100%", minHeight: "180px", padding: "24px", fontSize: "1.15rem", background: "#1e2937", border: "2px solid #67e8f9", borderRadius: "20px", color: "#e2e8f0", marginBottom: "20px" },
  generateBtn: { width: "100%", padding: "22px", fontSize: "1.4rem", background: "linear-gradient(135deg, #c084fc, #67e8f9)", border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 700 },
  result: { background: "#1e2937", padding: "40px", borderRadius: "24px", marginTop: "30px", border: "1px solid #334155" },
  tabContainer: { display: "flex", gap: 12, margin: "25px 0", flexWrap: "wrap" },
  tab: { padding: "12px 28px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600 },
  contentArea: { lineHeight: "1.85", padding: "30px", background: "#0f172a", borderRadius: "18px", fontSize: "1.05rem" },
  chatWindow: { height: "420px", overflowY: "auto", background: "#0f172a", padding: "20px", borderRadius: "16px", marginBottom: "15px" },
  userBubble: { background: "#334155", padding: "14px 20px", borderRadius: "18px 18px 4px 18px", maxWidth: "75%", marginLeft: "auto", marginBottom: 12 },
  aiBubble: { background: "rgba(103,232,249,0.15)", padding: "14px 20px", borderRadius: "18px 18px 18px 4px", maxWidth: "75%", marginBottom: 12 },
  chatInputRow: { display: "flex", gap: 12 },
  chatInput: { flex: 1, padding: "16px", background: "#1e2937", border: "1px solid #67e8f9", borderRadius: "999px", color: "#fff" },
  sendButton: { padding: "16px 36px", background: "#67e8f9", color: "#0f172a", border: "none", borderRadius: "999px", fontWeight: 600 },
  actionBar: { marginTop: "40px", display: "flex", gap: 16, flexWrap: "wrap" },
  saveButton: { padding: "18px 48px", background: "#ec4899", color: "white", border: "none", borderRadius: "999px", fontWeight: 700 },
  exportButton: { padding: "18px 40px", background: "transparent", border: "1px solid #67e8f9", color: "#67e8f9", borderRadius: "999px" },
  error: { color: "#fda4af", background: "#450a0a", padding: "16px", borderRadius: "12px", marginBottom: "20px" }
};
