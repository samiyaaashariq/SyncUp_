import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectChat from "./pages/ProjectChat";
import ProjectManage from "./pages/ProjectManage";
import ProjectMembers from "./pages/ProjectMembers";
import Notifications from "./pages/Notifications";
import AIProjectCopilot from "./pages/AIProjectCopilot";

// Components
import ProjectDiscovery from "./components/ProjectDiscovery";
import TeamMatcher from "./components/TeamMatcher";

// Styles
import "./App.css";

// Protected Route
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading SyncUp...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />

        <Route path="/project/:id" element={<ProtectedRoute user={user}><ProjectDetails /></ProtectedRoute>} />
        <Route path="/project/:id/chat" element={<ProtectedRoute user={user}><ProjectChat /></ProtectedRoute>} />
        <Route path="/project/:id/manage" element={<ProtectedRoute user={user}><ProjectManage /></ProtectedRoute>} />
        <Route path="/project/:id/members" element={<ProtectedRoute user={user}><ProjectMembers /></ProtectedRoute>} />

        <Route path="/notifications" element={<ProtectedRoute user={user}><Notifications /></ProtectedRoute>} />
        
        <Route path="/ai-copilot" element={<ProtectedRoute user={user}><AIProjectCopilot /></ProtectedRoute>} />

        {/* New Routes */}
        <Route path="/discover" element={<ProtectedRoute user={user}><ProjectDiscovery /></ProtectedRoute>} />
        <Route path="/team-match" element={<ProtectedRoute user={user}><TeamMatcher /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
