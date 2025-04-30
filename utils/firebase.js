import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPY5Tm9L_TAnl4sXlJOBcOcBTjjbhaU18",
  authDomain: "frame-17b3a.firebaseapp.com",
  projectId: "frame-17b3a",
  storageBucket: "frame-17b3a.appspot.com", // ✅ fixed typo here
  messagingSenderId: "140727981599",
  appId: "1:140727981599:web:bb20cb0199df8979d3672a",
  measurementId: "G-F03KEQRBR9",
};

// Initialize Firebase app once
const app = initializeApp(firebaseConfig);

// Core services
const auth = getAuth(app);
const db = getFirestore(app);

// Do not export analytics directly — it's optional in SSR
let analytics = null;

if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
    isSupported().then((yes) => {
      if (yes) {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      }
    });
  });
}

export { app, auth, db };
