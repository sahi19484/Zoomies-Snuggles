import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbGTJjVvIRW6HdLVJAUWCtUqoDZbmYNGM",
  authDomain: "zoomies-snuggles.firebaseapp.com",
  projectId: "zoomies-snuggles",
  storageBucket: "zoomies-snuggles.firebasestorage.app",
  messagingSenderId: "43405536742",
  appId: "1:43405536742:web:4a83d4c5f2f687811e7a27",
  measurementId: "G-PGVYN4Y5FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Export the services
export { db, auth };