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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 SyncUp</h1>

      {/* CREATE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={createProject}>
          Create
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* PROJECT LIST */}
        <div style={{ width: "250px" }}>
          <h3>Projects</h3>

          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
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

        {/* CHAT AREA */}
        <div style={{ flex: 1 }}>
          {selectedProject ? (
            <ChatBox projectId={selectedProject.id} />
          ) : (
            <p>Select a project to open chat</p>
          )}
        </div>
      </div>
    </div>
  );
}
