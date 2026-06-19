import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("");

  const user = auth.currentUser;

  // 🔄 FETCH ALL PROJECTS
  const fetchProjects = async () => {
    try {
      const snap = await getDocs(collection(db, "projects"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(data);

      // ⭐ Recommended = not your own projects
      const filtered = data.filter((p) => p.createdBy !== user?.uid);
      setRecommended(filtered);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  // ➕ CREATE PROJECT (with tags)
  const createProject = async () => {
    if (!title || !desc) return;

    try {
      await addDoc(collection(db, "projects"), {
        title,
        desc,
        tag: tag || "general",
        createdBy: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDesc("");
      setTag("");
      fetchProjects();
    } catch (err) {
      console.log("Create error:", err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 SyncUp Dashboard</h1>

      {/* CREATE PROJECT */}
      <div style={{ marginBottom: 20 }}>
        <h2>Create Project</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <br />

        {/* TAGS SYSTEM */}
        <input
          placeholder="Tag (AI, WebDev, ML...)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <br />

        <button onClick={createProject}>Create Project</button>
      </div>

      {/* MY PROJECTS */}
      <div>
        <h2>📁 My Projects</h2>

        {projects
          .filter((p) => p.createdBy === user?.uid)
          .map((p) => (
            <div
              key={p.id}
              style={{ border: "1px solid gray", margin: 5, padding: 10 }}
            >
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <small>🏷 {p.tag}</small>
            </div>
          ))}
      </div>

      {/* RECOMMENDED PROJECTS */}
      <div style={{ marginTop: 30 }}>
        <h2>⭐ Recommended Projects</h2>

        {recommended.length === 0 ? (
          <p>No recommendations available</p>
        ) : (
          recommended.map((p) => (
            <div
              key={p.id}
              style={{ border: "1px solid blue", margin: 5, padding: 10 }}
            >
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <small>🏷 {p.tag}</small>
            </div>
          ))
        )}
      </div>

      {/* SIMPLE CHAT BOX (RESTORED BASE VERSION) */}
      <div style={{ marginTop: 40 }}>
        <h2>💬 Chat Box</h2>

        <div
          style={{
            border: "1px solid black",
            height: 150,
            overflowY: "scroll",
            padding: 10,
          }}
        >
          <p>Chat system will be connected next (Firebase real-time)</p>
        </div>

        <input placeholder="Type message..." />
        <button>Send</button>
      </div>
    </div>
  );
}
