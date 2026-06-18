import React, { useState, useEffect } from "react";
import ChatBox from "./pages/ChatBox";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("");
  const [projects, setProjects] = useState([
    {
      title: "AI Study Planner",
      desc: "AI-powered daily study schedule generator for exam preparation.",
      tags: ["AI", "Productivity"],
    },
    {
      title: "Hackathon Team Finder",
      desc: "Match students based on skills for hackathons and competitions.",
      tags: ["Web", "Collaboration"],
    },
    {
      title: "CampusVerse",
      desc: "Your campus in one place—events, clubs, hackathons, opportunities, and student communities.",
      tags: ["Campus", "Social"],
      
    },
    ]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      setLoading(false);
    });

  return () => unsubscribe();
  }, []);
  if (loading) {
    return <h2>Loading...</h2>;
  }
  
 
  if (!isLoggedIn) {
  return (
    <div>
      {authMode === "login" ? (
        <>
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          <p>
            New user?{" "}
            <button onClick={() => setAuthMode("signup")}>
              Create Account
            </button>
          </p>
        </>
      ) : (
        <>
          <Signup onSignupSuccess={() => setIsLoggedIn(true)} />
          <p>
            Already have an account?{" "}
            <button onClick={() => setAuthMode("login")}>
              Login
            </button>
          </p>
        </>
      )}
    </div>
  );
}

  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <h1 style={styles.title}>SyncUp 🚀</h1>

      <p style={styles.subtitle}>
        Find teammates, build real-world projects, and grow together through collaboration.
      </p>

      {/* BUTTONS */}
      <div style={styles.buttonRow}>
        <button
          style={styles.primaryBtn}
          onClick={() =>
            document.getElementById("projects").scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          Explore Projects
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => setShowChat(true)}
        >
          Open Chat
        </button>
        <button
          style={styles.primaryBtn}
          onClick={() => setShowCreateProject(true)}
        >
          + Create Project
        </button>
      </div>
      

      {/* PROJECTS SECTION */}
      <div id="projects" style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Projects</h2>

        <div style={styles.grid}>
          {projects.map((p, i) => (
            <div key={i} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.title}</h3>

              <p style={styles.cardDesc}>{p.desc}</p>

              {/* TAGS */}
              <div style={styles.tagRow}>
                {p.tags.map((tag, idx) => (
                  <span key={idx} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* APPLY BUTTON */}
              <button
                style={styles.cardButton}
                onClick={() => {
                  setSelectedProject(p);
                  setShowApply(true);
                }}
              >
                Apply to Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT POPUP (SEPARATE SYSTEM) */}
      {showChat && (
        <div style={styles.overlay}>
          <div style={styles.chatBox}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowChat(false)}
            >
              ✖
            </button>

            <ChatBox />
          </div>
        </div>
      )}

      {/* APPLY SYSTEM POPUP */}
      {showApply && (
        <div style={styles.overlay}>
          <div style={styles.chatBox}>
            <button
              style={styles.closeBtn}
              onClick={() => setShowApply(false)}
            >
              ✖
            </button>

            <h3>Apply to Join Project</h3>
            <p style={{ color: "#666" }}>
              {selectedProject?.title}
            </p>

            <input style={styles.input} placeholder="Your Name" />
            <input style={styles.input} placeholder="Your Skill (e.g. React, AI)" />

            <button
              style={styles.cardButton}
              onClick={() => {
                setApplications([
                  ...applications,
                  selectedProject?.title,
                ]);

                alert("Application Submitted 🚀");
                setShowApply(false);
              }}
            >
              Submit Application
            </button>
          </div>
        </div>
      )}
      {/* APPLY SYSTEM POPUP */}
{showApply && (
  <div style={styles.overlay}>
    <div style={styles.chatBox}>
      ...
    </div>
  </div>
)}

{/* CREATE PROJECT POPUP */}
     
{showCreateProject && (
  <div style={styles.overlay}>
    <div style={styles.chatBox}>
      <button
        style={styles.closeBtn}
        onClick={() => setShowCreateProject(false)}
      >
        ✖
      </button>

      <h3>Create New Project</h3>

      <input
        style={styles.input}
        placeholder="Project Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Project Description"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Tags (comma separated)"
        value={newTags}
        onChange={(e) => setNewTags(e.target.value)}
      />

      <button
        style={styles.cardButton}
        onClick={() => {
          const project = {
            title: newTitle,
            desc: newDesc,
            tags: newTags.split(",").map(tag => tag.trim()),
          };

          setProjects([...projects, project]);

          setNewTitle("");
          setNewDesc("");
          setNewTags("");

          alert("Project Created 🚀");
          setShowCreateProject(false);
        }}
      >
        Create Project
      </button>
    </div>
  </div>
)}
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "50px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  title: {
    fontSize: "52px",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#cbd5e1",
    marginBottom: "25px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "40px",
  },

  primaryBtn: {
    padding: "12px 20px",
    backgroundColor: "#22c55e",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryBtn: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  section: {
    marginTop: "40px",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  card: {
    width: "250px",
    padding: "20px",
    borderRadius: "14px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "left",
  },

  cardTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  cardDesc: {
    fontSize: "14px",
    color: "#cbd5e1",
    marginBottom: "12px",
  },

  tagRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },

  tag: {
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "12px",
    backgroundColor: "#1e293b",
    color: "#fff",
  },

  cardButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBox: {
    width: "350px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    position: "relative",
    overflow: "auto",
    padding: "20px",
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },

  input: {
    width: "90%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
};

export default App;
