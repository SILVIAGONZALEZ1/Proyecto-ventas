import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const FiltroAuth = {
  currentUser: null,

  async init() {
    await new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profileRef = doc(db, "users", user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            this.currentUser = {
              uid: user.uid,
              ...profileSnap.data(),
            };
          } else {
            this.currentUser = null;
          }
        } else {
          this.currentUser = null;
        }
        resolve();
      });
    });
  },

  async login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profileRef = doc(db, "users", credential.user.uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      throw new Error("Perfil de usuario no encontrado en Firestore.");
    }
    this.currentUser = {
      uid: credential.user.uid,
      ...profileSnap.data(),
    };
    return this.currentUser;
  },

  async register(name, email, password, role) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = {
      uid: credential.user.uid,
      name,
      email,
      role,
    };
    await setDoc(doc(db, "users", credential.user.uid), newUser);
    this.currentUser = newUser;
    return newUser;
  },

  async logout() {
    await signOut(auth);
    this.currentUser = null;
  },

  get isAuthenticated() {
    return Boolean(this.currentUser);
  },

  hasRole(role) {
    return this.currentUser?.role === role;
  },
};

export { FiltroAuth };
