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
  const [streamingText, setStreamingText] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const GEMINI_API_KEY = "AQ.Ab8RN6IYPTjsPBGm_Igbw5J_K0snpfZ3E4e269Ysm-ZRk1nEwg";

  // Streaming Response
  const streamGeminiResponse = async (prompt, onChunk) => {
    setStreamingText("");
    let fullText = "";

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.85, maxOutputTokens: 2000 }
          })
        }
      );

      if (!res.ok) throw new Error("API request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.replace('data: ', ''));
              const delta = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
              fullText += delta;
              setStreamingText(fullText);
              onChunk?.(fullText);
            } catch (e) {}
          }
        }
      }
      return fullText;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const generateProject = async () => {
    if (!idea.trim()) return alert("Please enter an idea!");

    setLoading(true);
    setErrorMsg("");
    setStreamingText("");

    try {
      const prompt = `Create a detailed startup project plan for: "${idea}". 
Include sections: Title, Description, Tech Stack, Core Features, 8-Week Roadmap, and Sample Code.`;

      const aiText = await streamGeminiResponse(prompt, (text) => {
        // Live update
      });

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
      setStreamingText("");
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !generatedProject) return;

    const userMsg = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const prompt = `Based on this project: "${generatedProject.idea}"\n\nPlan: ${generatedProject.fullBrief}\n\nUser: ${currentInput}`;
      const reply = await streamGeminiResponse(prompt);
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't respond." }]);
    } finally {
      setLoading(false);
      setStreamingText("");
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
      alert("✅ Project saved!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Failed to save.");
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
  }, [chatHistory, streamingText]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Project Copilot 🌌</h1>
        <p style={styles.subtitle}>Streaming AI • Real-time Chat • Full Project Generation</p>
      </div>

      {errorMsg && <div style={styles.error}>{errorMsg}</div>}

      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your idea in detail..."
        style={styles.textarea}
      />

      <button onClick={generateProject} disabled={loading || !idea.trim()} style={styles.generateBtn}>
        {loading ? "Streaming Response..." : "🚀 Generate Complete Project"}
      </button>

      {generatedProject && (
        <div style={styles.result}>
          <h2>{generatedProject.title}</h2>

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
                {tab === "brief" ? "📋 Full Plan" : "💬 Live Chat"}
              </button>
            ))}
          </div>

          {activeTab === "brief" && (
            <div style={styles.brief}>
              {streamingText || generatedProject.fullBrief}
            </div>
          )}

          {activeTab === "chat" && (
            <div style={styles.chatContainer}>
              <div style={styles.chatWindow}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
                    {msg.content}
                  </div>
                ))}
                {streamingText && <div style={styles.aiMsg}>{streamingText}</div>}
                <div ref={chatEndRef} />
              </div>

              <div style={styles.chatInputArea}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  placeholder="Ask for code snippet, roadmap changes..."
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
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1c, #1a2338)", color: "#fff", padding: "40px 20px" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "3.4rem", background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: "#94a3b8", fontSize: "1.3rem" },
  textarea: { width: "100%", minHeight: "160px", padding: "24px", fontSize: "1.15rem", background: "#1e2937", border: "2px solid #67e8f9", borderRadius: "20px", color: "#e2e8f0" },
  generateBtn: { width: "100%", padding: "20px", fontSize: "1.35rem", background: "linear-gradient(135deg, #c084fc, #67e8f9)", border: "none", borderRadius: "9999px", cursor: "pointer", fontWeight: 700 },
  result: { background: "#1e2937", padding: "35px", borderRadius: "24px", marginTop: "30px" },
  tabs: { display: "flex", gap: 15, margin: "25px 0" },
  tabBtn: { padding: "12px 30px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600 },
  brief: { lineHeight: "1.85", padding: "30px", background: "#0f172a", borderRadius: "16px", whiteSpace: "pre-wrap" },
  chatContainer: { marginTop: "20px" },
  chatWindow: { height: "420px", overflowY: "auto", background: "#0f172a", padding: "20px", borderRadius: "16px" },
  userMsg: { background: "#334155", padding: "14px 20px", borderRadius: "18px 18px 4px 18px", maxWidth: "80%", marginLeft: "auto", marginBottom: 12 },
  aiMsg: { background: "rgba(103,232,249,0.15)", padding: "14px 20px", borderRadius: "18px 18px 18px 4px", maxWidth: "80%", marginBottom: 12 },
  chatInputArea: { display: "flex", gap: 12, marginTop: 15 },
  chatInput: { flex: 1, padding: "16px", background: "#1e2937", border: "1px solid #67e8f9", borderRadius: "999px", color: "#fff" },
  sendBtn: { padding: "16px 36px", background: "#67e8f9", color: "#0f172a", border: "none", borderRadius: "999px" },
  actions: { marginTop: "40px", display: "flex", gap: 16 },
  saveBtn: { padding: "18px 48px", background: "#ec4899", color: "white", border: "none", borderRadius: "999px" },
  exportBtn: { padding: "18px 40px", background: "transparent", border: "1px solid #67e8f9", color: "#67e8f9", borderRadius: "999px" },
  error: { color: "#fda4af", background: "#450a0a", padding: "16px", borderRadius: "12px", marginBottom: "20px" }
};
