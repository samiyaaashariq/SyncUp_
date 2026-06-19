import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

import ChatBox from "./ChatBox";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState("home");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(
        snap.docs.map((d) => ({
          id: d.id,
          members: [],
          applicants: [],
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  const createProject = async () => {
    if (!title || !desc) return alert("Fill all fields");

    await addDoc(collection(db, "projects"), {
      title,
      desc,
      createdBy: auth.currentUser?.email,
      members: [auth.currentUser?.email],
      applicants: [],
      createdAt: new Date()
    });

    setTitle("");
    setDesc("");
  };

  const applyToProject = async (projectId) => {
    const user = auth.currentUser?.email;
    if (!user) return;

    await updateDoc(doc(db, "projects", projectId), {
      applicants: arrayUnion(user)
    });

    alert("Request sent 🚀");
  };

  const acceptMember = async (projectId, email) => {
    await updateDoc(doc(db, "projects", projectId), {
      members: arrayUnion(email),
      applicants: arrayRemove(email)
    });
  };

  // ⭐ NEW: Recommended Projects (STATIC STARTUP IDEAS)
  const recommendedProjects = [
    {
      title: "CampusVerse AI",
      desc: "AI-powered campus social network with smart matchmaking",
    },
    {
      title: "Campus Wars",
      desc: "Inter-college competition platform with leaderboards & challenges",
    },
    {
      title: "SyncUp AI Assistant",
      desc: "AI that suggests teammates based on skills & project history",
    },
    {
      title: "SkillSwap Network",
      desc: "Students exchange skills (coding ↔ design ↔ marketing)",
    },
    {
      title: "Hackathon Finder AI",
      desc: "Auto-detects hackathons and forms teams instantly",
    },
    {
      title: "StudyRoom Live",
      desc: "Real-time group study rooms with focus tracking",
    }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>🚀 SyncUp</h1>

      {/* NAV */}
      <div style={styles.nav}>
        <button onClick={() => setPage("home")}>Projects</button>
        <button onClick={() => setPage("create")}>Create</button>
      </div>

      {/* CREATE PROJECT */}
      {page === "create" && (
        <div style={styles.card}>
          <h3>Create Project</h3>

          <input
            placeholder="Title"
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
            Publish
          </button>
        </div>
      )}

      {/* HOME */}
      {page === "home" && (
        <div>

          {/* ⭐ RECOMMENDED SECTION (NEW) */}
          <h2 style={{ marginTop: 10 }}>⭐ Recommended Projects</h2>

          <div style={styles.recommendedGrid}>
            {recommendedProjects.map((p, i) => (
              <div key={i} style={styles.recommendedCard}>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <button style={styles.secondaryBtn}>
                  Explore Idea
                </button>
              </div>
            ))}
          </div>

          {/* MAIN LAYOUT */}
          <div style={styles.layout}>

            {/* LEFT: LIVE PROJECTS */}
            <div style={styles.left}>
              <h3>🔥 Live Projects</h3>

              {projects.map((p) => (
                <div
                  key={p.id}
                  style={styles.cardSmall}
                  onClick={() => setSelectedProject(p)}
                >
                  <b>{p.title}</b>
                  <p>{p.desc}</p>

                  <button onClick={() => applyToProject(p.id)}>
                    Apply 🚀
                  </button>

                  {p.createdBy === auth.currentUser?.email && (
                    <div>
                      <h5>Applicants</h5>

                      {p.applicants?.map((email) => (
                        <div key={email}>
                          {email}
                          <button
                            onClick={() => acceptMember(p.id, email)}
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT: CHAT */}
            <div style={styles.right}>
              {selectedProject ? (
                <ChatBox project={selectedProject} />
              ) : (
                <p>Select a project to start chatting 💬</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 20, fontFamily: "Arial" },
  logo: { color: "#4f46e5" },

  nav: { display: "flex", gap: 10, marginBottom: 10 },

  layout: { display: "flex", gap: 20, marginTop: 20 },
  left: { width: 320 },
  right: { flex: 1 },

  card: {
    padding: 15,
    background: "#fff",
    border: "1px solid #ddd"
  },

  cardSmall: {
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ddd",
    cursor: "pointer"
  },

  input: { width: "100%", padding: 8 },
  textarea: { width: "100%", padding: 8, height: 80 },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: 10,
    border: "none"
  },

  secondaryBtn: {
    background: "#e5e7eb",
    padding: 6,
    border: "none",
    marginTop: 5
  },

  recommendedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 10,
    marginBottom: 20
  },

  recommendedCard: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 8
  }
};
