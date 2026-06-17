import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

import ChatBox from "./ChatBox";

export default function Dashboard() {
  // ---------------- STATES ----------------
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [page, setPage] = useState("projects");
  const [loading, setLoading] = useState(false);

  // ---------------- PROFILE LOAD ----------------
  const loadProfile = () => {
    const data = localStorage.getItem("syncup_profile");
    if (data) setProfile(JSON.parse(data));
  };

  // ---------------- REALTIME PROJECTS ----------------
  const fetchProjects = () => {
    const q = collection(db, "projects");

    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setProjects(data);
    });
  };

  // ---------------- CREATE PROJECT ----------------
  const createProject = async () => {
    if (!title || !desc) return alert("Fill all fields");

    setLoading(true);

    await addDoc(collection(db, "projects"), {
      title,
      desc,
      skillsNeeded: skillsNeeded
        ? skillsNeeded.split(",").map(s => s.trim().toLowerCase())
        : [],
      createdBy: auth.currentUser.email,
      members: [auth.currentUser.email],
      applications: [],
      createdAt: new Date()
    });

    setTitle("");
    setDesc("");
    setSkillsNeeded("");

    setLoading(false);
  };

  // ---------------- APPLY ----------------
  const applyToProject = async (project) => {
    const userEmail = auth.currentUser.email;

    const ref = doc(db, "projects", project.id);

    await updateDoc(ref, {
      applications: arrayUnion(userEmail)
    });

    // Notification (safe simple version)
    await addDoc(collection(db, "notifications"), {
      text: `${userEmail} applied to ${project.title}`,
      owner: project.createdBy,
      read: false,
      time: new Date()
    });
  };

  // ---------------- JOIN ----------------
  const joinProject = async (project) => {
    const userEmail = auth.currentUser.email;

    const ref = doc(db, "projects", project.id);

    await updateDoc(ref, {
      members: arrayUnion(userEmail)
    });
  };

  // ---------------- MATCH SCORE ----------------
  const matchScore = (project) => {
    if (!profile?.skills || !project.skillsNeeded) return 0;

    return project.skillsNeeded.filter(skill =>
      profile.skills.includes(skill)
    ).length;
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    fetchProjects();
    loadProfile();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>SyncUp 🚀</h1>

      <button onClick={() => auth.signOut()}>
        Logout
      </button>

      {/* NAV */}
      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setPage("projects")}>
          Projects
        </button>

        <button onClick={() => setPage("create")}>
          Create
        </button>
      </div>

      {/* ---------------- CREATE PAGE ---------------- */}
      {page === "create" && (
        <div>
          <h2>Create Project</h2>

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
            placeholder="Skills needed (react, node, ai)"
            value={skillsNeeded}
            onChange={(e) => setSkillsNeeded(e.target.value)}
          />

          <br /><br />

          <button onClick={createProject} disabled={loading}>
            {loading ? "Posting..." : "Create Project"}
          </button>
        </div>
      )}

      {/* ---------------- PROJECT PAGE ---------------- */}
      {page === "projects" && (
        <>
          <h2>Recommended ⭐</h2>

          {projects
            .sort((a, b) => matchScore(b) - matchScore(a))
            .map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  margin: "10px 0",
                  padding: "10px"
                }}
              >
                <h3>{p.title}</h3>
                <p>{p.desc}</p>

                <p>Match Score: ⭐ {matchScore(p)}</p>

                <p>
                  Skills: {p.skillsNeeded?.join(", ")}
                </p>

                <small>By: {p.createdBy}</small>

                <hr />

                {/* ACTIONS */}
                <button onClick={() => applyToProject(p)}>
                  Apply 🚀
                </button>

                <button onClick={() => joinProject(p)}>
                  Join 🤝
                </button>

                {/* CHAT */}
                <button onClick={() => setActiveChat(p.id)}>
                  Open Chat 💬
                </button>

                {activeChat === p.id && (
                  <ChatBox projectId={p.id} />
                )}
              </div>
            ))}
        </>
      )}
    </div>
  );
}