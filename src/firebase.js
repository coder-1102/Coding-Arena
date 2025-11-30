import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBd4bKrD6KwfzZ3-lTMSw48sfrSIzKR0VE",
  authDomain: "python-compiler-49e87.firebaseapp.com",
  projectId: "python-compiler-49e87",
  storageBucket: "python-compiler-49e87.firebasestorage.app",
  messagingSenderId: "1069064156068",
  appId: "1:1069064156068:web:4203cd89eff5fae01f8731",
  measurementId: "G-N49X5GET3B"
};

// Initialize Firebase only if it hasn't been initialized yet (prevents HMR errors)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  // If there's an error, try to get existing app
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

