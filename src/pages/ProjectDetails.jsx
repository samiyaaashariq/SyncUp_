import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const STATUS_STEPS = ["Recruiting", "In Progress", "Completed"];
const TEAM_TARGET = 6;

function hashHue(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function formatCreatedAt(createdAt) {
  if (!createdAt) return null;
  const d = typeof createdAt === "number" ? new Date(createdAt) : createdAt.toDate ? createdAt.toDate() : null;
  if (!d || isNaN(d.getTime())) return null;
  return d;
}

function daysSince(date) {
  if (!date) return null;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
}

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
    <div className="pdGaugeWrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(103,232,249,0.12)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#pulseGrad)"
          strokeWidth="10"
          strokeLinecap="round"
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

function CapacityBar({ current, target }) {
  const pct = Math.min(100, (current / target) * 100);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      <div className="pdCapacityLabelRow">
        <span>{current} of {target} target members</span>
        <span style={{ color: pct >= 100 ? "#4ade80" : "#67e8f9" }}>{Math.round(pct)}%</span>
      </div>
      <div className="pdCapacityTrack">
        <div className="pdCapacityFill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function ActivityChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="pdActivityChart">
      {data.map((d, i) => (
        <div key={i} className="pdActivityCol">
          <div className="pdActivityBarTrack">
            <div
              className="activityBar"
              style={{ height: `${(d.count / max) * 100}%`, animationDelay: `${i * 60}ms` }}
              title={`${d.count} message${d.count !== 1 ? "s" : ""}`}
            />
          </div>
          <span className="pdActivityDay">{d.label}</span>
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
      <div className="pdPage">
        <style>{cssBlock}</style>
        <div className="pdContainer">
          <div className="pdSkeletonHero shimmer" />
          <div className="pdSkeletonBody shimmer" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pdPage">
        <style>{cssBlock}</style>
        <div className="pdContainer">
          <p className="pdMuted">Project not found.</p>
        </div>
      </div>
    );
  }

  const members = Array.isArray(project.members) ? project.members : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const created = formatCreatedAt(project.createdAt);
  const age = daysSince(created);
  const statusIndex = Math.max(0, STATUS_STEPS.indexOf(project.status || "Recruiting"));
  const visibleAvatars = members.slice(0, 5);
  const overflow = members.length - visibleAvatars.length;

  return (
    <div className="pdPage">
      <style>{cssBlock}</style>

      <div className="pdContainer">
        <button className="pdBackBtn" onClick={() => navigate("/dashboard")}>← Back</button>
        <div className="pdHero">
          <div className="heroBlob heroBlobA" />
          <div className="heroBlob heroBlobB" />

          <div className="pdHeroContent">
            <div className="pdStepperRow">
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="pdStepItem">
                    <div className={`pdStepDot ${i <= statusIndex ? "pdStepDotActive" : ""} ${i === statusIndex ? "stepPulse" : ""}`} />
                    <span className="pdStepLabel" style={{ opacity: i <= statusIndex ? 1 : 0.4 }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className="pdStepLine" style={{ opacity: i < statusIndex ? 1 : 0.2 }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <h1 className="pdHeroTitle">{project.title}</h1>
            <p className="pdHeroCreator">
              Created by <strong style={{ color: "#67e8f9" }}>{project.creator || "Unknown"}</strong>
              {age !== null && (
                <span style={{ color: "#64748b" }}> · {age === 0 ? "started today" : `${age} day${age !== 1 ? "s" : ""} active`}</span>
              )}
            </p>

            <div className="pdTags">
              {tags.length > 0 ? (
                tags.map((tag, i) => <span key={i} className="pdTag">{tag}</span>)
              ) : (
                <span className="pdMuted">No tags</span>
              )}
            </div>
          </div>
        </div>

        <div className="pdBodyGrid">
          <div className="pdLeftCol">
            <div className="pdCard hoverCard">
              <h3 className="pdCardTitle">About this project</h3>
              <p className="pdDesc">{project.fullBrief || project.description || "No description provided."}</p>

              <div className="pdAvatarRow">
                {visibleAvatars.map((uid, i) => (
                  <div
                    key={uid}
                    className="pdAvatar"
                    style={{ background: `hsl(${hashHue(uid)}, 70%, 55%)`, zIndex: visibleAvatars.length - i, marginLeft: i === 0 ? 0 : -10 }}
                    title={uid}
                  >
                    {uid.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="pdAvatar" style={{ background: "rgba(148,163,184,0.3)", marginLeft: -10 }}>
                    +{overflow}
                  </div>
                )}
                {members.length === 0 && <span className="pdMuted">No members yet — be the first to join</span>}
              </div>

              {!isMember ? (
                <button className="pdJoinBtn" onClick={handleJoin} disabled={joining}>
                  {joining ? "Joining..." : "Join Project"}
                </button>
              ) : (
                <p className="pdMemberBadge">✅ You're a member of this project</p>
              )}

              <div className="pdActionsRow">
                <button
                  className="pdActionBtn"
                  style={{ opacity: isMember ? 1 : 0.4, cursor: isMember ? "pointer" : "not-allowed" }}
                  disabled={!isMember}
                  title={!isMember ? "Only project members can access chat" : ""}
                  onClick={() => isMember && navigate(`/project/${project.id}/chat`)}
                >
                  💬 Chat
                </button>
                <button className="pdActionBtn" onClick={() => navigate(`/project/${project.id}/manage`)}>
                  ⚙️ Manage
                </button>
                <button className="pdActionBtn" onClick={() => navigate(`/project/${project.id}/members`)}>
                  👥 Members
                </button>
              </div>
            </div>
          </div>

          <div className="pdRightCol">
            <div className="pdCard hoverCard" style={{ textAlign: "center" }}>
              <h3 className="pdCardTitle" style={{ justifyContent: "center" }}>Project Pulse</h3>
              <PulseGauge statusIndex={statusIndex} />
              <p className="pdGaugeCaption">{STATUS_STEPS[statusIndex]}</p>
            </div>

            <div className="pdCard hoverCard">
              <h3 className="pdCardTitle">Team Capacity</h3>
              <CapacityBar current={members.length} target={TEAM_TARGET} />
            </div>

            <div className="pdCard hoverCard">
              <h3 className="pdCardTitle">
                Team Activity <span className={`pdLiveDot ${isMember ? "livePulse" : ""}`} />
              </h3>
              {isMember ? (
                activityData ? (
                  <ActivityChart data={activityData} />
                ) : (
                  <p className="pdMuted">Loading activity...</p>
                )
              ) : (
                <div className="pdLockedOverlay">
                  <div className="pdLockedBlurBars">
                    {[40, 65, 30, 80, 50, 70, 45].map((h, i) => (
                      <div key={i} className="pdLockedBar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="pdLockedMessage">
                    <span style={{ fontSize: "1.4rem" }}>🔒</span>
                    <p className="pdLockedText">Join to unlock live team activity</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cssBlock = `
  .pdPage { background: radial-gradient(ellipse at top, #0f172a, #020617); min-height: 100vh; }
  .pdContainer { padding: 30px 20px 60px; max-width: 1000px; margin: 0 auto; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .pdMuted { color: #94a3b8; }
  .pdBackBtn { background: transparent; border: 1px solid rgba(103,232,249,0.3); color: #67e8f9; padding: 8px 16px; border-radius: 10px; cursor: pointer; margin-bottom: 20px; }
  .pdHero { position: relative; overflow: hidden; border-radius: 24px; padding: 36px 32px; background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,60,0.9)); border: 1px solid rgba(103,232,249,0.25); margin-bottom: 24px; }
  .pdHeroContent { position: relative; z-index: 1; }
  .pdStepperRow { display: flex; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 4px; }
  .pdStepItem { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 70px; }
  .pdStepDot { width: 12px; height: 12px; border-radius: 50%; background: rgba(148,163,184,0.3); }
  .pdStepDotActive { background: linear-gradient(135deg, #67e8f9, #c084fc); }
  .pdStepLabel { font-size: 0.7rem; color: #cbd5e1; letter-spacing: 0.3px; white-space: nowrap; }
  .pdStepLine { height: 2px; flex: 1; min-width: 24px; background: linear-gradient(90deg, #67e8f9, #c084fc); margin-bottom: 18px; }
  .pdHeroTitle { font-family: 'Space Grotesk', sans-serif; font-size: 2.4rem; font-weight: 700; margin-bottom: 10px; background: linear-gradient(90deg, #fff, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .pdHeroCreator { color: #94a3b8; margin-bottom: 18px; font-size: 0.95rem; }
  .pdTags { display: flex; gap: 8px; flex-wrap: wrap; }
  .pdTag { background: rgba(103,232,249,0.12); color: #67e8f9; padding: 5px 14px; border-radius: 999px; font-size: 0.82rem; border: 1px solid rgba(103,232,249,0.25); }
  .pdBodyGrid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
  .pdLeftCol, .pdRightCol { display: flex; flex-direction: column; gap: 20px; }
  .pdCard { background: rgba(15,23,42,0.85); border: 1px solid rgba(103,232,249,0.2); border-radius: 18px; padding: 24px; }
  .pdCardTitle { font-family: 'Space Grotesk', sans-serif; color: #c084fc; font-size: 1.05rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .pdDesc { color: #cbd5e1; line-height: 1.7; margin-bottom: 20px; }
  .pdAvatarRow { display: flex; align-items: center; margin-bottom: 20px; min-height: 36px; flex-wrap: wrap; }
  .pdAvatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #0f172a; border: 2px solid #0f172a; }
  .pdJoinBtn { width: 100%; padding: 14px; background: linear-gradient(135deg, #ec4899, #c084fc); color: #fff; border: none; border-radius: 999px; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
  .pdMemberBadge { color: #4ade80; font-weight: 600; margin-bottom: 20px; }
  .pdActionsRow { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .pdActionBtn { padding: 12px 6px; background: rgba(103,232,249,0.1); color: #67e8f9; border: 1px solid rgba(103,232,249,0.3); border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
  .pdGaugeWrap { display: flex; justify-content: center; }
  .pdGaugeCaption { color: #94a3b8; margin-top: 8px; font-size: 0.85rem; }
  .pdCapacityLabelRow { display: flex; justify-content: space-between; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 8px; }
  .pdCapacityTrack { height: 10px; border-radius: 999px; background: rgba(103,232,249,0.1); overflow: hidden; }
  .pdCapacityFill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #67e8f9, #c084fc); transition: width 1s cubic-bezier(.4,0,.2,1); }
  .pdLiveDot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; display: inline-block; }
  .pdActivityChart { display: flex; align-items: flex-end; gap: 8px; height: 110px; }
  .pdActivityCol { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
  .pdActivityBarTrack { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .pdActivityDay { font-size: 0.7rem; color: #64748b; margin-top: 6px; }
  .pdLockedOverlay { position: relative; height: 110px; }
  .pdLockedBlurBars { display: flex; align-items: flex-end; gap: 8px; height: 100%; filter: blur(4px); opacity: 0.5; }
  .pdLockedBar { flex: 1; background: linear-gradient(180deg, #67e8f9, #c084fc); border-radius: 6px 6px 0 0; }
  .pdLockedMessage { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
  .pdLockedText { font-size: 0.8rem; color: #cbd5e1; text-align: center; }
  .pdSkeletonHero { height: 220px; border-radius: 24px; margin-bottom: 24px; }
  .pdSkeletonBody { height: 300px; border-radius: 18px; }

  @keyframes drift { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-15px) scale(1.08); } }
  @keyframes shimmerMove { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
  @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(103,232,249,0.5); } 70% { box-shadow: 0 0 0 10px rgba(103,232,249,0); } 100% { box-shadow: 0 0 0 0 rgba(103,232,249,0); } }
  @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes dotPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }

  .heroBlob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; animation: drift 8s ease-in-out infinite; pointer-events: none; }
  .heroBlobA { width: 260px; height: 260px; background: #67e8f9; top: -80px; left: -60px; }
  .heroBlobB { width: 220px; height: 220px; background: #ec4899; bottom: -80px; right: -40px; animation-delay: 2s; }
  .hoverCard { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
  .hoverCard:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(103,232,249,0.12); border-color: rgba(103,232,249,0.5); }
  .stepPulse { animation: pulseRing 2s infinite; }
  .shimmer { background: linear-gradient(90deg, rgba(15,23,42,0.9) 25%, rgba(103,232,249,0.08) 50%, rgba(15,23,42,0.9) 75%); background-size: 800px 100%; animation: shimmerMove 1.6s infinite linear; }
  .activityBar { width: 100%; background: linear-gradient(180deg, #67e8f9, #c084fc); border-radius: 6px 6px 0 0; transform-origin: bottom; animation: growBar 0.6s ease both; }
  .livePulse { animation: dotPulse 1.6s infinite; }

  @media (max-width: 900px) {
    .pdBodyGrid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .pdContainer { padding: 18px 14px 40px; }
    .pdHero { padding: 24px 18px; border-radius: 18px; }
    .pdHeroTitle { font-size: 1.7rem; }
    .pdCard { padding: 18px; }
    .pdActionsRow { gap: 6px; }
    .pdActionBtn { font-size: 0.75rem; padding: 10px 4px; }
    .pdStepItem { min-width: 56px; }
    .pdStepLabel { font-size: 0.62rem; }
  }
`;
