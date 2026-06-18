import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(undefined); // IMPORTANT (undefined = loading state)
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u);
        },
        (err) => {
          console.log(err);
          setError("Auth error");
          setUser(null);
        }
      );

      return () => unsub();
    } catch (e) {
      console.log(e);
      setError("Firebase init failed");
      setUser(null);
    }
  }, []);

  // 🔵 LOADING STATE (CRITICAL - prevents blank page)
  if (user === undefined) {
    return (
      <div style={styles.center}>
        Loading SyncUp...
      </div>
    );
  }

  // 🔴 ERROR STATE (safety fallback)
  if (error) {
    return (
      <div style={styles.center}>
        Something went wrong. Please refresh.
      </div>
    );
  }

  // 🟢 MAIN ROUTING
  return user ? <Dashboard /> : <Login />;
}

const styles = {
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    color: "#4f46e5"
  }
};
