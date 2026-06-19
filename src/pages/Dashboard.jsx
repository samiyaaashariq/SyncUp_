import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const currentUser = auth.currentUser;

  // 🔄 FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const snap = await getDocs(collection(db, "projects"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(data);

      // ✅ FIXED RECOMMENDED LOGIC
      const filtered = data.filter((p) => {
        return p.createdBy !== currentUser?.uid;
      });

      setRecommended(filtered);
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  // ➕ CREATE PROJECT
  const createProject = async () => {
    if (!title || !desc) return;

    try {
      await addDoc(collection(db, "projects"), {
        title,
        desc,
        createdBy: currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDesc("");
      fetchProjects(); // refresh
    } catch (error) {
      console.log("Error creating project:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 SyncUp Dashboard</h1>

      {/* CREATE PROJECT */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Create Project</h2>

        <input
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Project Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <br />

        <button onClick={createProject}>Create</button>
      </div>

      {/* MY PROJECTS */}
      <div>
        <h2>📁 My Projects</h2>
        {projects
          .filter((p) => p.createdBy === currentUser?.uid)
          .map((p) => (
            <div key={p.id} style={{ border: "1px solid gray", margin: 5, padding: 10 }}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
      </div>

      {/* RECOMMENDED PROJECTS */}
      <div style={{ marginTop: "30px" }}>
        <h2>⭐ Recommended Projects</h2>

        {recommended.length === 0 ? (
          <p>No recommendations available</p>
        ) : (
          recommended.map((p) => (
            <div key={p.id} style={{ border: "1px solid blue", margin: 5, padding: 10 }}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
