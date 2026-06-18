import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

import ChatBox from "./ChatBox";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState("home");

  // REALTIME PROJECTS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    if (!title || !desc) return alert("Fill all fields");

    await addDoc(collection(db, "projects"), {
      title,
      desc,
      createdBy: auth.currentUser?.email || "anonymous",
      createdAt: new Date()
    });

    setTitle("");
    setDesc("");
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <h1 style={styles.logo}>🚀 SyncUp</h1>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={() => setPage("home")}>Projects</button>
        <button onClick={() => setPage("create")}>Create</button>
      </div>

      {/* CREATE */}
      {page === "create" && (
        <div style={styles.card}>
          <h3>Create Project</h3>

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

          <button onClick={createProject} style={styles.primaryBtn}>
            Publish Project
          </button>
        </div>
      )}

      {/* PROJECT LIST */}
      {page === "home" && (
        <div style={styles.layout}>
          
          {/* LEFT */}
          <div style={styles.left}>
            <h3>Projects</h3>

            {projects.map((p) => (
              <div
                key={p.id}
                style={{
                  ...styles.cardSmall,
                  border:
                    selectedProject?.id === p.id
                      ? "2px solid #4f46e5"
                      : "1px solid #ddd"
                }}
                onClick={() => setSelectedProject(p)}
              >
                <b>{p.title}</b>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div style={styles.right}>
            {selectedProject ? (
              <ChatBox projectId={selectedProject.id} />
            ) : (
              <div style={{ color: "#666" }}>
                Select a project to start chatting 💬
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// STYLES (STARTUP CLEAN UI)
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
    background: "#f9fafb",
    minHeight: "100vh"
  },

  logo: {
    color: "#4f46e5"
  },

  nav: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px"
  },

  layout: {
    display: "flex",
    gap: "20px"
  },

  left: {
    width: "280px"
  },

  right: {
    flex: 1
  },

  card: {
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
    maxWidth: "400px"
  },

  cardSmall: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#fff"
  },

  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px"
  },

  textarea: {
    width: "100%",
    padding: "8px",
    height: "80px",
    marginBottom: "10px"
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px"
  }
};
