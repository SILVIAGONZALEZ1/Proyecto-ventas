import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgzQT807YWdOsv5a2sH0unUQN1lLiU4Gw",
  authDomain: "filtropro-2026.firebaseapp.com",
  projectId: "filtropro-2026",
  storageBucket: "filtropro-2026.firebasestorage.app",
  messagingSenderId: "642723032935",
  appId: "1:642723032935:web:d120ca56709d04f81589c2",
  measurementId: "G-JHTNEQHWEC"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);

export { firebaseApp, firebaseConfig, auth, db, analytics };
