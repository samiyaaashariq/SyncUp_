import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function ProjectManage() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);

  // LOAD APPLICANTS
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects", id, "applications"),
      (snap) => {
        setApps(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, [id]);

  // ACCEPT USER → MOVE TO MEMBERS
  const acceptUser = async (app) => {
    await setDoc(
      doc(db, "projects", id, "members", app.applicant),
      {
        email: app.applicant,
        joinedAt: new Date(),
      }
    );

    await deleteDoc(
      doc(db, "projects", id, "applications", app.id)
    );

    alert("User accepted!");
  };

  // REJECT USER
  const rejectUser = async (app) => {
    await deleteDoc(
      doc(db, "projects", id, "applications", app.id)
    );
  };

  return (
    <div style={styles.page}>
      <h2>👑 Project Applications</h2>

      {apps.length === 0 && <p>No applications yet</p>}

      {apps.map((a) => (
        <div key={a.id} style={styles.card}>
          <p>👤 {a.applicant}</p>

          <button onClick={() => acceptUser(a)} style={styles.accept}>
            Accept
          </button>

          <button onClick={() => rejectUser(a)} style={styles.reject}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0b1120",
    color: "#fff",
    minHeight: "100vh",
  },

  card: {
    border: "1px solid #22d3ee",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },

  accept: {
    background: "#22d3ee",
    border: "none",
    padding: "8px",
    marginRight: "10px",
  },

  reject: {
    background: "red",
    border: "none",
    padding: "8px",
    color: "#fff",
  },
};
