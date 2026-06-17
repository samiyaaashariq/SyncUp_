import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCbmFYm-SJuqDsvTm2lp4mvtgCMYdKPuZs",
  authDomain: "syncup-a6327.firebaseapp.com",
  projectId: "syncup-a6327",
  storageBucket: "syncup-a6327.firebasestorage.app",
  messagingSenderId: "879637125727",
  appId: "1:879637125727:web:560073b6c7c2ba6d1bd9ea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
