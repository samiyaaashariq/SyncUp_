import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading SyncUp...</h2>
      </div>
    );
  }

  return (
    <div>
      {!user ? <Auth /> : <Dashboard />}
    </div>
  );
}
