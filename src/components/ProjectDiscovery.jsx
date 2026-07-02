import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ProjectDiscovery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joiningId, setJoiningId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isMember = (project) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    const inMembers = Array.isArray(project.members) && project.members.includes(currentUser.uid);
    const isCreator = project.creator === currentUser.email;
    return inMembers || isCreator;
  };

  const handleJoin = async (project) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return navigate("/login");
    setJoiningId(project.id);
    try {
      const ref = doc(db, "projects", project.id);
      await updateDoc(ref, { members: arrayUnion(currentUser.uid) });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, members: [...(Array.isArray(p.members) ? p.members : []), currentUser.uid] }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to join project.");
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Explore Projects</h1>
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={styles.grid}>
          {filteredProjects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            filteredProjects.map(project => {
              const memberAccess = isMember(project);
              return (
                <div key={project.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{project.title}</h3>
                  <p style={styles.desc}>{project.fullBrief?.substring(0, 120)}...</p>

                  <div style={styles.tags}>
                    {project.tags?.map((tag, i) => <span key={i} style={styles.tag}>{tag}</span>) || "No tags"}
                  </div>

                  <button
                    style={styles.joinBtn}
                    onClick={() => handleJoin(project)}
                    disabled={memberAccess || joiningId === project.id}
                  >
                    {memberAccess ? "✅ Joined" : joiningId === project.id ? "Joining..." : "Join Project"}
                  </button>

                  <div style={styles.actionsRow}>
                    <button style={styles.actionBtn} onClick={() => navigate(`/project/${project.id}`)}>
                      Details
                    </button>

                    <button
                      style={{
                        ...styles.actionBtn,
                        opacity: memberAccess ? 1 : 0.4,
                        cursor: memberAccess ? "pointer" : "not-allowed",
                      }}
                      disabled={!memberAccess}
                      title={!memberAccess ? "Only project members can access chat" : ""}
                      onClick={() => memberAccess && navigate(`/project/${project.id}/chat`)}
                    >
                      💬 Chat
                    </button>

                    <button style={styles.actionBtn} onClick={() => navigate(`/project/${project.id}/manage`)}>
                      ⚙️ Manage
                    </button>

                    <button style={styles.actionBtn} onClick={() => navigate(`/project/${project.id}/members`)}>
                      👥 Members
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" },
  title: { fontSize: "2.2rem", marginBottom: "20px", background: "linear-gradient(90deg, #67e8f9, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  search: {
    width: "100%",
    padding: "14px",
    marginBottom: "30px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1.1rem",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "24px",
  },
  cardTitle: { color: "#c084fc", marginBottom: "12px" },
  desc: { color: "#cbd5e1", marginBottom: "20px", lineHeight: "1.6" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  tag: { background: "rgba(103,232,249,0.15)", color: "#67e8f9", padding: "4px 12px", borderRadius: "999px", fontSize: "0.85rem" },
  joinBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "12px",
  },
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  actionBtn: {
    padding: "10px 6px",
    background: "rgba(103,232,249,0.1)",
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};
