import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // LOADING STATE (PREVENT BLANK SCREEN)
  if (loading) {
    return (
      <div style={styles.loading}>
        Loading SyncUp...
      </div>
    );
  }

  // MAIN ROUTING
  return (
    <div style={styles.app}>
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

// SIMPLE SAFE STYLES
const styles = {
  app: {
    minHeight: "100vh",
    background: "#f9fafb"
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    color: "#4f46e5",
    fontSize: "16px"
  }
};
