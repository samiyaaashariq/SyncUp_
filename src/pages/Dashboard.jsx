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

  // REALTIME PROJECTS
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

  // CREATE PROJECT
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

  // APPLY TO JOIN
  const applyToProject = async (projectId) => {
    const user = auth.currentUser?.email;
    if (!user) return;

    await updateDoc(doc(db, "projects", projectId), {
      applicants: arrayUnion(user)
    });

    alert("Request sent 🚀");
  };

  // ACCEPT MEMBER
  const acceptMember = async (projectId, email) => {
    await updateDoc(doc(db, "projects", projectId), {
      members: arrayUnion(email),
      applicants: arrayRemove(email)
    });
  };

  return (
    <div style={styles.container}>
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

      {/* PROJECT LIST */}
      {page === "home" && (
        <div style={styles.layout}>
          {/* LEFT */}
          <div style={styles.left}>
            <h3>Projects</h3>

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

                {/* OWNER PANEL */}
                {p.createdBy === auth.currentUser?.email && (
                  <div>
                    <h5>Applicants</h5>

                    {p.applicants?.map((email) => (
                      <div key={email}>
                        {email}
                        <button
                          onClick={() =>
                            acceptMember(p.id, email)
                          }
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

          {/* RIGHT */}
          <div style={styles.right}>
            {selectedProject ? (
              <ChatBox project={selectedProject} />
            ) : (
              <p>Select a project</p>
            )}
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
  layout: { display: "flex", gap: 20 },
  left: { width: 300 },
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

  right: { padding: 10 }
};
