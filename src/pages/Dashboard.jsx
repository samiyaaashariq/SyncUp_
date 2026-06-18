import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

import ChatBox from "./ChatBox";

export default function Dashboard() {
  // ---------------- STATES ----------------
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("projects");

  // ---------------- REALTIME PROJECTS ----------------
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setProjects(data);
    });

    return () => unsub();
  }, []);

  // ---------------- CREATE PROJECT ----------------
  const createProject = async () => {
    if (!title || !desc) return alert("Fill all fields");

    setLoading(true);

    try {
      await addDoc(collection(db, "projects"), {
        title,
        desc,
        skillsNeeded: skillsNeeded
          ? skillsNeeded.split(",").map((s) => s.trim().toLowerCase())
          : [],
        createdBy: auth.currentUser?.email || "anonymous",
        members: [auth.currentUser?.email || "anonymous"],
        applications: [],
        createdAt: new Date()
      });

      setTitle("");
      setDesc("");
      setSkillsNeeded("");
    } catch (err) {
      console.log("Create project error:", err);
    }

    setLoading(false);
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <h1 style={styles.heading}>🚀 SyncUp</h1>
      <p style={styles.subheading}>
        Where collaboration begins
      </p>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={() => setPage("projects")}>
          Projects
        </button>

        <button onClick={() => setPage("create")}>
          Create
        </button>
      </div>

      {/* ---------------- CREATE PAGE ---------------- */}
      {page === "create" && (
        <div style={styles.card}>
          <h2>Create Project</h2>

          <input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={styles.textarea}
          />

          <input
            placeholder="Skills (react, node, ai)"
            value={skillsNeeded}
            onChange={(e) => setSkillsNeeded(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={createProject}
            disabled={loading}
            style={styles.primaryBtn}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      )}

      {/* ---------------- PROJECTS + CHAT ---------------- */}
      {page === "projects" && (
        <div style={styles.layout}>
          {/* LEFT PROJECT LIST */}
          <div style={styles.sidebar}>
            <h3>Projects</h3>

            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setPage("chat");
                }}
                style={{
                  ...styles.projectCard,
                  background:
                    selectedProject?.id === p.id
                      ? "#e0e7ff"
                      : "#fff"
                }}
              >
                <h4>{p.title}</h4>
                <small>{p.createdBy}</small>
              </div>
            ))}
          </div>

          {/* RIGHT INFO */}
          <div style={styles.infoBox}>
            <h2>Welcome to SyncUp</h2>
            <p>Select a project to start collaboration chat.</p>
          </div>
        </div>
      )}

      {/* ---------------- CHAT PAGE ---------------- */}
      {page === "chat" && selectedProject && (
        <div style={styles.chatPage}>
          <div style={styles.chatHeader}>
            <button
              onClick={() => setPage("projects")}
              style={styles.backBtn}
            >
              ← Back
            </button>

            <h3>{selectedProject.title}</h3>
          </div>

          <ChatBox projectId={selectedProject.id} />
        </div>
      )}
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial"
  },

  heading: {
    marginBottom: "0"
  },

  subheading: {
    marginTop: "5px",
    color: "#666"
  },

  nav: {
    margin: "15px 0",
    display: "flex",
    gap: "10px"
  },

  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    maxWidth: "400px"
  },

  input: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  textarea: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    height: "80px"
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px"
  },

  layout: {
    display: "flex",
    gap: "20px"
  },

  sidebar: {
    width: "250px",
    borderRight: "1px solid #ddd",
    paddingRight: "10px"
  },

  projectCard: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer"
  },

  infoBox: {
    flex: 1,
    padding: "20px",
    color: "#666"
  },

  chatPage: {
    marginTop: "20px"
  },

  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },

  backBtn: {
    padding: "5px 10px",
    cursor: "pointer"
  }
};
