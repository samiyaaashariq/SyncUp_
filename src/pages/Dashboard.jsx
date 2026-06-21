import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
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
    const title = prompt("Enter project title");
    const description = prompt("Enter project description");

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      tech: "React • Firebase",
      createdBy: user?.email,
      createdAt: new Date(),
    });
  };

  // LIKE SYSTEM (simple toggle using subcollection doc id = user.uid)
  const toggleLike = async (projectId) => {
    const likeRef = doc(db, "projects", projectId, "likes", user.uid);

    try {
      await deleteDoc(likeRef);
    } catch {
      await addDoc(collection(db, "projects", projectId, "likes"), {
        userId: user.uid,
      });
    }
  };

  // COMMENT
  const addComment = async (projectId) => {
    if (!commentText[projectId]) return;

    await addDoc(collection(db, "projects", projectId, "comments"), {
      text: commentText[projectId],
      user: user.email,
      createdAt: new Date(),
    });

    setCommentText({ ...commentText, [projectId]: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "20px",
        color: "#0f172a",
      }}
    >
      {/* CENTER CONTAINER */}
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* HEADER */}
        <div
          style={{
            background: "#fff",
            padding: "18px",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontWeight: "800", color: "#0f172a" }}>
            📊 SyncUp Feed
          </h2>

          <p style={{ color: "#334155", fontWeight: "500" }}>
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
              borderRadius: "10px",
              fontWeight: "600",
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
              background: "#ffffff",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              marginBottom: "15px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px)")
            }
          >
            {/* TITLE */}
            <h3 style={{ fontWeight: "800", color: "#0f172a" }}>
              {p.title}
            </h3>

            {/* DESCRIPTION */}
            <p style={{ color: "#334155", fontWeight: "500" }}>
              {p.description}
            </p>

            {/* META */}
            <small style={{ color: "#64748b" }}>
              👤 {p.createdBy || "Anonymous"}
            </small>

            {/* ACTIONS */}
            <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleLike(p.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#f43f5e",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❤️ Like
              </button>

              <button
                onClick={() => nav(`/chat/${p.id}`)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                💬 Discuss
              </button>
            </div>

            {/* COMMENT BOX */}
            <div style={{ marginTop: "12px" }}>
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
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                }}
              />

              <button
                onClick={() => addComment(p.id)}
                style={{
                  marginLeft: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#22c55e",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
