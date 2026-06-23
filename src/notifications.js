import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const sendNotification = async ({ to, text, type, projectId }) => {
  try {
    if (!to) return;

    await addDoc(collection(db, "notifications", to, "items"), {
      text,
      type,
      projectId: projectId || null,
      read: false,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Notification error:", err);
  }
};
