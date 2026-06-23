import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProjectDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const ref = doc(db, "projects", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() });
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div style={{ padding: 20, color: "#fff" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, color: "#fff", background: "#0b1120", minHeight: "100vh" }}>
      
      <button onClick={() => nav(-1)} style={{ marginBottom: 20 }}>
        ⬅ Back
      </button>

      <h1 style={{ color: "#22d3ee" }}>{project.title}</h1>

      <p>👤 {project.createdBy}</p>
      <p>🎯 {project.roleNeeded}</p>
      <p>⚙️ {project.techStack}</p>

      <p style={{ marginTop: 10 }}>{project.description}</p>

    </div>
  );
}
