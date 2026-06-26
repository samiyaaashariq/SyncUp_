import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Copy, RefreshCw, Save, Sparkles, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AIProjectCopilot() {
  const [idea, setIdea] = useState("");
  const [generatedProject, setGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const resultRef = useRef(null);   // ← New for PDF

  const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg";

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
      if (!isRefine) setHistory(prev => [newProject, ...prev].slice(0, 5));

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
    setTimeout(() => setCopied(false), 1800);
  };

  // NEW: PDF Export Function
  const exportToPDF = async () => {
    if (!generatedProject || !resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0a0f1c",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${generatedProject.title.replace(/[^a-z0-9]/gi, '_')}_SyncUp_Project.pdf`);

      alert("📄 PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      alert("PDF export failed. Please try again.");
    }
  };

  const saveProject = async () => {
    if (!generatedProject) return;
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...generatedProject,
        createdAt: serverTimestamp(),
      });
      alert("🚀 Project saved!");
      navigate(`/project/${docRef.id}`);
    } catch (e) {
      alert("Save failed. Check Firebase.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>AI Project Copilot <span style={{ color: '#22d3ee' }}>🌌</span></h1>
            <p style={styles.subtitle}>Describe your idea → Get a full professional project plan instantly.</p>
          </div>
          <Sparkles size={36} style={{ color: '#a855f7' }} />
        </div>

        {/* Input Section */}
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
          {loading ? <>Generating Magic... <RefreshCw size={18} style={{ animation: "spin 1s linear infinite", marginLeft: 8 }} /></> : "✨ Generate Project with AI"}
        </button>

        {/* Examples */}
        <div style={styles.examples}>
          <p style={{ color: '#64748b', marginBottom: 10 }}>Quick ideas:</p>
          {["Hackathon teammate matcher", "AI study buddy with flashcards", "Campus lost & found QR system", "Student freelance gig board"].map((ex, i) => (
            <button key={i} onClick={() => setIdea(ex)} style={styles.exampleTag}>
              {ex}
            </button>
          ))}
        </div>

        {/* Result with PDF support */}
        {generatedProject && (
          <div id="result-section" ref={resultRef} style={styles.result}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>✨ Your AI Project Brief</h2>
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => copyToClipboard(generatedProject.fullBrief)} style={styles.copyBtn}>
                  <Copy size={18} /> {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={exportToPDF} style={styles.pdfBtn}>
                  <Download size={18} /> Export PDF
                </button>
              </div>
            </div>

            <div style={styles.brief} dangerouslySetInnerHTML={{ __html: generatedProject.fullBrief.replace(/\n/g, '<br>') }} />

            {/* Refine Section */}
            <div style={styles.refineSection}>
              <h4 style={{ color: '#67e8f9', marginBottom: 12 }}>Refine this brief</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Add mobile-first design, include AR feature..."
                  style={styles.refineInput}
                />
                <button onClick={() => generateProject(true)} disabled={loading} style={styles.refineBtn}>
                  <RefreshCw size={18} /> Refine
                </button>
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={saveProject} style={styles.saveBtn}>
                <Save size={18} style={{ marginRight: 8 }} /> Save to SyncUp
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
  // ... your existing styles (unchanged) ...
  container: { /* ... */ },
  glow: { /* ... */ },
  content: { /* ... */ },
  header: { /* ... */ },
  title: { /* ... */ },
  subtitle: { /* ... */ },
  textarea: { /* ... */ },
  generateBtn: { /* ... */ },
  examples: { /* ... */ },
  exampleTag: { /* ... */ },
  result: { /* ... */ },
  resultHeader: { /* ... */ },
  resultTitle: { /* ... */ },
  copyBtn: { /* ... */ },
  brief: { /* ... */ },
  refineSection: { /* ... */ },
  refineInput: { /* ... */ },
  refineBtn: { /* ... */ },
  actions: { /* ... */ },
  saveBtn: { /* ... */ },
  newBtn: { /* ... */ },

  // NEW PDF Button Style
  pdfBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 22px",
    background: "linear-gradient(135deg, #22d3ee, #a855f7)",
    color: "#0f172a",
    border: "none",
    borderRadius: "9999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
