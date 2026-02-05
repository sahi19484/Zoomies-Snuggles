import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbGTJjVvIRW6HdLVJAUWCtUqoDZbmYNGM",
  authDomain: "zoomies-snuggles.firebaseapp.com",
  projectId: "zoomies-snuggles",
  storageBucket: "zoomies-snuggles.appspot.com",   // ✅ fixed
  messagingSenderId: "43405536742",
  appId: "1:43405536742:web:4a83d4c5f2f687811e7a27",
  measurementId: "G-PGVYN4Y5FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Warn if running on a host that may not be authorized for redirects
if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  const authDomain = getApp().options?.authDomain || '';
  if (authDomain && !authDomain.includes(host) && host !== 'localhost') {
    console.warn(`⚠️ Firebase authDomain ("${authDomain}") may not match current host ("${host}"). Add the host to Firebase Authentication Authorized domains if you use sign-in redirects.`);
  }
}

// Initialize Firebase services
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { db, auth };
