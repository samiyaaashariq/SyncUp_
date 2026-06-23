import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const sendNotification = async ({
  to,
  text,
  type,
  projectId,
}) => {
  try {
    await addDoc(collection(db, "notifications", to, "items"), {
      text,
      type,
      projectId,
      createdAt: new Date(),
      read: false,
    });
  } catch (err) {
    console.error(err);
  }
};
