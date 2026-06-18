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
  const [page, setPage] = useState("projects");

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
      createdBy: auth.currentUser?.email || "anonymous"
    });

    setTitle("");
    setDesc("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 SyncUp</h1>

      {/* NAV */}
      <button onClick={() => setPage("projects")}>
        Projects
      </button>

      <button onClick={() => setPage("create")}>
        Create
      </button>

      {/* CREATE */}
      {page === "create" && (
        <div style={{ marginTop: "20px" }}>
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

          <button onClick={createProject}>
            Create
          </button>
        </div>
      )}

      {/* PROJECT LIST */}
      {page === "projects" && (
        <div style={{ display: "flex", gap: "20px" }}>
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
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  cursor: "pointer",
                  background:
                    selectedProject?.id === p.id
                      ? "#e0e7ff"
                      : "#fff"
                }}
              >
                <b>{p.title}</b>
              </div>
            ))}
          </div>

          <div>
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

          <ChatBox project={selectedProject} />
        </div>
      )}
    </div>
  );
}
