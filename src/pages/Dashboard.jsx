import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

import ChatBox from "./ChatBox";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState("projects");
  const [loading, setLoading] = useState(false);

  // 🔥 REALTIME PROJECTS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // 🔥 CREATE PROJECT
  const createProject = async () => {
    if (!title || !desc) return alert("Fill all fields");

    setLoading(true);

    await addDoc(collection(db, "projects"), {
      title,
      desc,
      skillsNeeded: skillsNeeded
        ? skillsNeeded.split(",").map((s) => s.trim())
        : [],
      createdBy: auth.currentUser?.email || "anonymous",
      members: [],
      createdAt: new Date()
    });

    setTitle("");
    setDesc("");
    setSkillsNeeded("");
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 SyncUp</h1>

      {/* NAV */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setPage("projects")}>
          Projects
        </button>

        <button onClick={() => setPage("create")}>
          Create
        </button>
      </div>

      {/* CREATE */}
      {page === "create" && (
        <div>
          <h3>Create Project</h3>

          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br /><br />

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Skills (comma separated)"
            value={skillsNeeded}
            onChange={(e) => setSkillsNeeded(e.target.value)}
          />
          <br /><br />

          <button onClick={createProject} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      )}

      {/* PROJECTS */}
      {page === "projects" && (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* LEFT */}
          <div style={{ width: "250px" }}>
            <h3>Projects</h3>

            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setPage("chat");
                }}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  background:
                    selectedProject?.id === p.id
                      ? "#eef2ff"
                      : "#fff"
                }}
              >
                <b>{p.title}</b>
                <p style={{ fontSize: "12px" }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            <h3>Welcome to SyncUp</h3>
            <p>Select a project to start chat</p>
          </div>
        </div>
      )}

      {/* CHAT */}
      {page === "chat" && selectedProject && (
        <div>
          <button onClick={() => setPage("projects")}>
            ← Back
          </button>

          <h3>{selectedProject.title}</h3>

          {/* 🔥 THIS IS THE FIX */}
          <ChatBox projectId={selectedProject.id} />
        </div>
      )}
    </div>
  );
}
