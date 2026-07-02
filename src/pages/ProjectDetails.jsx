import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const STATUS_STEPS = ["Recruiting", "In Progress", "Completed"];
const TEAM_TARGET = 6; // ideal team size, used for the capacity bar

function hashHue(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function formatDate(createdAt) {
  if (!createdAt) return null;
  const d = typeof createdAt === "number" ? new Date(createdAt) : createdAt.toDate ? createdAt.toDate() : null;
  if (!d || isNaN(d.getTime())) return null;
  return d;
}

function daysSince(date) {
  if (!date) return null;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// --- Circular gauge: status progress ---
function PulseGauge({ statusIndex }) {
  const pct = ((statusIndex + 1) / STATUS_STEPS.length) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.gaugeWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(103,232,249,0.12)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke="url(#pulseGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
        />
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <text x="70" y="64" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="Space Grotesk, sans-serif">
          {Math.round(pct)}%
        </text>
        <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#94a3b8" letterSpacing="0.5">
          COMPLETE
        </text>
      </svg>
    </div>
  );
}

// --- Horizontal capacity bar ---
function CapacityBar({ current, target }) {
  const pct = Math.min(100, (current / target) * 100);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      <div style={styles.capacityLabelRow}>
        <span>{current} of {target} target members</span>
        <span style={{ color: pct >= 100 ? "#4ade80" : "#67e8f9" }}>{Math.round(pct)}%</span>
      </div>
      <div style={styles.capacityTrack}>
        <div style={{ ...styles.capacityFill, width: `${width}%` }} />
      </div>
    </div>
  );
}

// --- 7-day message activity bar chart ---
function ActivityChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div style={styles.activityChart}>
      {data.map((d, i) => (
        <div key={i} style={styles.activityCol}>
          <div style={styles.activityBarTrack}>
            <div
              className="activityBar"
              style={{
                height: `${(d.count / max) * 100}%`,
                animationDelay: `${i * 60}ms`,
              }}
              title={`${d.count} message${d.count !== 1 ? "s" : ""}`}
            />
          </div>
          <span style={styles.activityDay}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activityData, setActivityData] = useState(null);

  // Inject display font once
  useEffect(() => {
    if (document.getElementById("sp-grotesk-font")) return;
    const link = document.createElement("link");
    link.id = "sp-grotesk-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);
        if (snap.exists()) setProject({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const currentUser = auth.currentUser;
  const isMember =
    project &&
    currentUser &&
    ((Array.isArray(project.members) && project.members.includes(currentUser.uid)) ||
      project.creator === currentUser.email);

  // Real activity data — only fetched for members (matches Firestore rules; also doubles as a join incentive)
  useEffect(() => {
    if (!isMember) return;
    const q = query(collection(db, "projects", id, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ key: d.toDateString(), label: d.toLocaleDateString(undefined, { weekday: "short" }), count: 0 });
      }
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const ts = data.createdAt?.toDate ? data.createdAt.toDate() : null;
        if (!ts) return;
        const key = ts.toDateString();
        const day = days.find((d) => d.key === key);
        if (day) day.count += 1;
      });
      setActivityData(days);
    });
    return () => unsubscribe();
  }, [isMember, id]);

  const handleJoin = async () => {
    if (!currentUser) return navigate("/login");
    setJoining(true);
    try {
      const ref = doc(db, "projects", id);
      await updateDoc(ref, { members: arrayUnion(currentUser.uid) });
      setProject((prev) => ({
        ...prev,
        members: [...(Array.isArray(prev.members) ? prev.members : []), currentUser.uid],
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to join project. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.skeletonHero} className="shimmer" />
        <div style={styles.skeletonBody} className="shimmer" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.container}>
        <p style={styles.muted}>Project not found.</p>
      </div>
    );
  }

  const members = Array.isArray(project.members) ? project.members : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const created = formatDate(project.createdAt);
  const age = daysSince(created);
  const statusIndex = Math.max(0, STATUS_STEPS.indexOf(project.status || "Recruiting"));
  const visibleAvatars = members.slice(0, 5);
  const overflow = members.length - visibleAvatars.length;

  return (
    <div style={styles.page}>
      <style>{cssBlock}</style>

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

        {/* HERO */}
        <div style={styles.hero}>
          <div className="heroBlob heroBlobA" />
          <div className="heroBlob heroBlobB" />

          <div style={styles.heroContent}>
            <div style={styles.stepperRow}>
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div style={styles.stepItem}>
                    <div
                      style={{
                        ...styles.stepDot,
                        ...(i <= statusIndex ? styles.stepDotActive : {}),
                      }}
                      className={i === statusIndex ? "stepPulse" : ""}
                    />
                    <span style={{ ...styles.stepLabel, opacity: i <= statusIndex ? 1 : 0.4 }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ ...styles.stepLine, opacity: i < statusIndex ? 1 : 0.2 }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <h1 style={styles.heroTitle}>{project.title}</h1>
            <p style={styles.heroCreator}>
              Created by <strong style={{ color: "#67e8f9" }}>{project.creator || "Unknown"}</strong>
              {age !== null && <span style={{ color: "#64748b" }}> · {age === 0 ? "started today" : `${age} day${age !== 1 ? "s" : ""} active`}</span>}
            </p>

            <div style={styles.tags}>
              {tags.length > 0 ? tags.map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              )) : <span style={styles.muted}>No tags</span>}
            </div>
          </div>
        </div>

        {/* BODY GRID */}
        <div style={styles.bodyGrid}>
          {/* LEFT: About + actions */}
          <div style={styles.leftCol}>
            <div style={{ ...styles.card, ...styles.hoverCardStyle }} className="hoverCard">
              <h3 style={styles.cardTitle}>About this project</h3>
              <p style={styles.desc}>{project.fullBrief || project.description || "No description provided."}</p>

              <div style={styles.avatarRow}>
                {visibleAvatars.map((uid, i) => (
                  <div
                    key={uid}
                    style={{
                      ...styles.avatar,
                      background: `hsl(${hashHue(uid)}, 70%, 55%)`,
                      zIndex: visibleAvatars.length - i,
                      marginLeft: i === 0 ? 0 : -10,
                    }}
                    title={uid}
                  >
                    {uid.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {overflow > 0 && (
                  <div style={{ ...styles.avatar, background: "rgba(148,163,184,0.3)", marginLeft: -10 }}>
                    +{overflow}
                  </div>
                )}
                {members.length === 0 && <span style={styles.muted}>No members yet — be the first to join</span>}
              </div>

              {!isMember ? (
                <button style={styles.joinBtn} onClick={handleJoin} disabled={joining}>
                  {joining ? "Joining..." : "Join Project"}
                </button>
              ) : (
                <p style={styles.memberBadge}>✅ You're a member of this project</p>
              )}

              <div style={styles.actionsRow}>
                <button
                  style={{
                    ...styles.actionBtn,
                    opacity: isMember ? 1 : 0.4,
                    cursor: isMember ? "pointer" : "not-allowed",
                  }}
                  disabled={!isMember}
                  title={!isMember ? "Only project members can access chat" : ""}
                  onClick={() => isMember && navigate(`/project/${project.id}/chat`)}
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
          </div>

          {/* RIGHT: Insights */}
          <div style={styles.rightCol}>
            <div style={{ ...styles.card, ...styles.hoverCardStyle, textAlign: "center" }} className="hoverCard">
              <h3 style={styles.cardTitle}>Project Pulse</h3>
              <PulseGauge statusIndex={statusIndex} />
              <p style={styles.gaugeCaption}>{STATUS_STEPS[statusIndex]}</p>
            </div>

            <div style={{ ...styles.card, ...styles.hoverCardStyle }} className="hoverCard">
              <h3 style={styles.cardTitle}>Team Capacity</h3>
              <CapacityBar current={members.length} target={TEAM_TARGET} />
            </div>

            <div style={{ ...styles.card, ...styles.hoverCardStyle, position: "relative", overflow: "hidden" }} className="hoverCard">
              <h3 style={styles.cardTitle}>
                Team Activity <span style={styles.liveDot} className={isMember ? "livePulse" : ""} />
              </h3>
              {isMember ? (
                activityData ? (
                  <ActivityChart data={activityData} />
                ) : (
                  <p style={styles.muted}>Loading activity...</p>
                )
              ) : (
                <div style={styles.lockedOverlay}>
                  <div style={styles.lockedBlurBars}>
                    {[40, 65, 30, 80, 50, 70, 45].map((h, i) => (
                      <div key={i} style={{ ...styles.lockedBar, height: `${h}%` }} />
                    ))}
                  </div>
                  <div style={styles.lockedMessage}>
                    <span style={{
