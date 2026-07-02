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
  const [mode, setMode] = useState("full");
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // ←←← Paste your AQ key here ←←←
  const GEMINI_API_KEY = "AQ.Ab8RN6IYPTjsPBGm_Igbw5J_K0snpfZ3E4e269Ysm-ZRk1nEwg";

  const callGemini = async (prompt) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 1600, topP: 0.95 },
        })
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`API Error ${res.status}: ${errorData?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error("No response from Gemini. Try again.");
    return aiText;
  };

  const systemPrompt = (userIdea, extraContext = "") => `
You are SyncUp AI Project Copilot — an elite startup mentor.
User Idea: "${userIdea}"
${extraContext ? `Refinement: ${extraContext}` : ""}
Generate a detailed, exciting project plan in clean Markdown with emojis.`;

  const generateProject = async () => {
    if (!idea.trim()) {
      alert("Please enter an idea first!");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const prompt = systemPrompt(idea);
      const aiText = await callGemini(prompt);

      const newProject = {
        title: idea.slice(0, 80) + (idea.length > 80 ? "..." : ""),
        fullBrief: aiText,
        idea: idea,
        createdBy: auth.currentUser?.email || "anonymous",
        members: [auth.currentUser?.uid],
        status: "planning",
        aiGenerated: true,
        generatedAt: new Date().toISOString(),
      };

      setGeneratedProject(newProject);
      setScore(82);
      setChatHistory([{ role: "assistant", content: aiText }]);
      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" }), 300);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      alert("Generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !generatedProject) return;

    const userMsg = { role: "user", content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    const tempInput = chatInput;
    setChatInput("");
    setLoading(true);

    try {
      const prompt = `Project: ${generatedProject.idea}\nBrief: ${generatedProject.fullBrief}\nQuestion: ${tempInput}\nAnswer helpfully.`;
      const reply = await callGemini(prompt);
      setChatHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "⚠️ " + err.message }]);
    } finally {
      setLoading(false);
    }
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
        chatHistory,
      });
      alert("Project saved successfully!");
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
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>AI Project Copilot 🌌</h1>
          <p style={styles.subtitle}>Turn your idea into a full project plan</p>
        </div>

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your project idea here..."
          style={styles.textarea}
        />

        <button onClick={generateProject} disabled={loading || !idea.trim()} style={styles.generateBtn}>
          {loading ? "Generating..." : "🚀 Generate Project"}
        </button>

        {generatedProject && (
          <div id="result-section" style={styles.result}>
            <h2 style={styles.resultTitle}>{generatedProject.title}</h2>
            <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>Save to SyncUp</button>
              <button onClick={exportMarkdown} style={styles.copyBtn}>Export Markdown</button>
              <button onClick={() => window.location.reload()} style={styles.newBtn}>New Idea</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0f1c, #1a2338)", color: "#fff", padding: "40px 20px" },
  glow: { position: "absolute", inset: 0, background: "radial-gradient(circle, rgba(103,232,249,0.15), transparent)", zIndex: 0 },
  content: { maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "3rem", background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: "#94a3b8", fontSize: "1.3rem" },
  textarea: { width: "100%", minHeight: "180px", padding: "20px", fontSize: "1.1rem", background: "#1e2937", border: "2px solid #67e8f9", borderRadius: "16px", color: "#fff" },
  generateBtn: { width: "100%", padding: "18px", fontSize: "1.3rem", background: "linear-gradient(135deg, #67e8f9, #c084fc)", border: "none", borderRadius: "999px", cursor: "pointer", margin: "20px 0" },
  result: { background: "#1e2937", padding: "30px", borderRadius: "20px", marginTop: "30px" },
  resultTitle: { color: "#67e8f9", marginBottom: "20px" },
  brief: { lineHeight: "1.8", background: "#0f172a", padding: "25px", borderRadius: "16px", whiteSpace: "pre-wrap" },
  actions: { marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" },
  saveBtn: { padding: "14px 32px", background: "#ec4899", color: "white", border: "none", borderRadius: "999px", cursor: "pointer" },
  copyBtn: { padding: "14px 32px", background: "transparent", border: "1px solid #67e8f9", color: "#67e8f9", borderRadius: "999px", cursor: "pointer" },
  newBtn: { padding: "14px 32px", background: "transparent", border: "1px solid #94a3b8", color: "#94a3b8", borderRadius: "999px", cursor: "pointer" },
  errorBox: { color: "#fda4af", background: "rgba(248,113,113,0.1)", padding: "15px", borderRadius: "12px", marginBottom: "20px" }
};
