import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCEm_M5YDGXJATaPmUS6PEfsj9EqACTmkg",
  authDomain: "syncup-e31b6.firebaseapp.com",
  projectId: "syncup-e31b6",
  storageBucket: "syncup-e31b6.firebasestorage.app",
  messagingSenderId: "382502575211",
  appId: "1:382502575211:web:e6f207c74162259c3e252e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
