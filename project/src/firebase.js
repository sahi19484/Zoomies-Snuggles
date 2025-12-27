import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbGTJjVvIRW6HdLVJAUWCtUqoDZbmYNGM",
  authDomain: "zoomies-snuggles.firebaseapp.com",
  projectId: "zoomies-snuggles",
  storageBucket: "zoomies-snuggles.firebasestorage.app",
  messagingSenderId: "43405536742",
  appId: "1:43405536742:web:4a83d4c5f2f687811e7a27",
  measurementId: "G-PGVYN4Y5FC"
  "hosting": {
    "site": "zoomiesandsnuggles",
    "public": "public",
  }

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);


// Export the services
export { db, auth };
