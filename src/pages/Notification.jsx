import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("owner", "==", auth.currentUser.email)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotifs(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications 🔔</h2>

      {notifs.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifs.map((n) => (
          <div key={n.id} style={{ padding: "10px", border: "1px solid #ddd" }}>
            {n.text}
          </div>
        ))
      )}
    </div>
  );
}