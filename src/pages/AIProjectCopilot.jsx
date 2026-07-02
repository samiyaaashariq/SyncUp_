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

    if (!res.ok) throw new Error("API Error - Check your key or quota");
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  const generateProject = async () => {
    if (!idea.trim()) return alert("Enter an idea!");

    setLoading(true);
    setErrorMsg("");
    try {
      const prompt = `Create a complete startup project plan for: "${idea}".
Include: Title, Description, Tech Stack, Core Features (8-10), 8-week Roadmap, Team Roles, and sample code structure. Use Markdown.`;

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
      const reply = await callGemini(`Project: ${generatedProject.idea}\nBrief: ${generatedProject.fullBrief}\nQuestion: ${temp}`);
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Error getting response" }]);
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
    alert("Project Saved!");
    navigate(`/project/${docRef.id}`);
  };

  const exportMarkdown = () => {
    if (!generatedProject) return;
    const md = `# ${generatedProject.title}\n\n${generatedProject.fullBrief}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-plan.md';
    a.click();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <h1 style={styles.title}>AI Project Copilot 🌌</h1>
        <p style={styles.subtitle}>Full startup project generator with roadmap, code & more</p>

        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        <textarea
          value={idea}
          onChange={e => setIdea(e.target.value)}
          placeholder="Describe your idea..."
          style={styles.textarea}
        />

        <button onClick={generateProject} disabled={loading || !idea.trim()} style={styles.generateBtn}>
          {loading ? "Generating Full Plan..." : "🚀 Generate Complete Project"}
        </button>

        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <h2>{generatedProject.title}</h2>

            <div style={styles.tabs}>
              {["brief", "roadmap", "features", "chat"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.tabBtn, background: activeTab === tab ? "#67e8f9" : "transparent", color: activeTab === tab ? "#0f172a" : "#fff"}}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === "brief" && <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />}

            {activeTab === "chat" && (
              <div style={styles.chatContainer}>
                <div style={styles.chatWindow}>
                  {chatHistory.map((m, i) => <div key={i} style={m.role === "user" ? styles.userMsg : styles.assistantMsg}>{m.content}</div>)}
                  <div ref={chatEndRef} />
                </div>
                <div style={styles.chatInputArea}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === "Enter" && sendChatMessage()} placeholder="Ask for code, changes, etc..." style={styles.chatInput} />
                  <button onClick={sendChatMessage} style={styles.sendBtn}>Send</button>
                </div>
              </div>
            )}

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>Save Project</button>
              <button onClick={exportMarkdown} style={styles.copyBtn}>Export MD</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1c, #1a2338)", color: "#fff", padding: "40px 20px" },
  glow: { position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(103,232,249,0.2), transparent)", zIndex: 0 },
  content: { maxWidth: "1100px", margin: "0 auto", zIndex: 1 },
  title: { fontSize: "3.2rem", textAlign: "center", background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { textAlign: "center", color: "#94a3b8" },
  textarea: { width: "100%", minHeight: "160px", padding: "24px", fontSize: "1.1rem", background: "#1e2937", border: "2px solid #67e8f9", borderRadius: "20px" },
  generateBtn: { width: "100%", padding: "20px", fontSize: "1.4rem", background: "linear-gradient(135deg, #c084fc, #67e8f9)", border: "none", borderRadius: "999px", margin: "25px 0" },
  result: { background: "#1e2937", padding: "30px", borderRadius: "20px", marginTop: "30px" },
  tabs: { display: "flex", gap: 10, margin: "20px 0" },
  tabBtn: { padding: "10px 20px", borderRadius: "999px", border: "none", cursor: "pointer" },
  brief: { lineHeight: "1.8", padding: "25px", background: "#0f172a", borderRadius: "16px" },
  chatContainer: { marginTop: "20px" },
  chatWindow: { height: "400px", overflowY: "auto", background: "#0f172a", padding: "20px", borderRadius: "16px" },
  userMsg: { background: "#334155", padding: "12px", borderRadius: "12px", margin: "8px 0", maxWidth: "80%", marginLeft: "auto" },
  assistantMsg: { background: "#1e40af", padding: "12px", borderRadius: "12px", margin: "8px 0", maxWidth: "80%" },
  chatInputArea: { display: "flex", gap: 10, marginTop: 15 },
  chatInput: { flex: 1, padding: "14px", borderRadius: "999px", background: "#1e2937", border: "1px solid #67e8f9" },
  sendBtn: { padding: "14px 28px", background: "#67e8f9", color: "#0f172a", border: "none", borderRadius: "999px" },
  actions: { marginTop: "30px", display: "flex", gap: 15 },
  saveBtn: { padding: "16px 40px", background: "#ec4899", color: "white", border: "none", borderRadius: "999px" },
  copyBtn: { padding: "16px 32px", background: "transparent", border: "1px solid #67e8f9", color: "#67e8f9", borderRadius: "999px" },
  error: { color: "red", background: "#450a0a", padding: "15px", borderRadius: "12px" }
};
