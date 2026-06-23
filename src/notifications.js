import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export const sendNotification = async ({ to, text, type, projectId }) => {
  if (!to) return;

  await addDoc(collection(db, "notifications", to, "items"), {
    text,
    type,
    projectId,
    createdAt: new Date(),
    read: false,
  });
};
