import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser;

  const [projects, setProjects] = useState([]);
  const [commentText, setCommentText] = useState({});

  // REAL-TIME FEED
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setProjects(data);
    });

    return () => unsub();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    const title = prompt("Project title");
    const description = prompt("Project description");

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      tech: "React • Firebase",
      createdBy: user?.email,
      createdAt: new Date(),
    });
  };

  // LIKE TOGGLE
  const toggleLike = async (projectId) => {
    const likeRef = collection(db, "projects", projectId, "likes");

    const existing = await getDocs(likeRef);

    const userLike = existing.docs.find(
      (d) => d.id === user?.uid
    );

    if (userLike) {
      await deleteDoc(doc(db, "projects", projectId, "likes", user.uid));
    } else {
      await addDoc(likeRef, {
        userId: user.uid,
      });
    }
  };

  // ADD COMMENT
  const addComment = async (projectId) => {
    if (!commentText[projectId]) return;

    await addDoc(
      collection(db, "projects", projectId, "comments"),
      {
        text: commentText[projectId],
        user: user.email,
        createdAt: new Date(),
      }
    );

    setCommentText({ ...commentText, [projectId]: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
        fontFamily: "Inter",
        padding: "20px",
        color: "#0f172a",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2>📊 SyncUp Feed</h2>
        <p style={{ color: "#475569" }}>
          Welcome, {user?.email}
        </p>

        <button
          onClick={createProject}
          style={{
            marginTop: "10px",
            padding: "10px 14px",
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Create Post
        </button>
      </div>

      {/* FEED */}
      {projects.map((p) => (
        <div
          key={p.id}
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "15px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* POST HEADER */}
          <h3>{p.title}</h3>
          <p style={{ color: "#475569" }}>{p.description}</p>

          <small>👤 {p.createdBy || "Anonymous"}</small>

          {/* ACTIONS */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => toggleLike(p.id)}
              style={{
                padding: "6px 10px",
                background: "#f43f5e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              ❤️ Like
            </button>

            <button
              onClick={() => nav(`/chat/${p.id}`)}
              style={{
                padding: "6px 10px",
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Discuss
            </button>
          </div>

          {/* COMMENT BOX */}
          <div style={{ marginTop: "10px" }}>
            <input
              value={commentText[p.id] || ""}
              onChange={(e) =>
                setCommentText({
                  ...commentText,
                  [p.id]: e.target.value,
                })
              }
              placeholder="Write a comment..."
              style={{
                padding: "8px",
                width: "70%",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={() => addComment(p.id)}
              style={{
                marginLeft: "10px",
                padding: "8px 10px",
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Post
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
