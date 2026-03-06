import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAHa0m2ORB7f1vKoOPfH4FF823WIWTJnd4",
  authDomain: "yks-yazim-kurallari-app.firebaseapp.com",
  projectId: "yks-yazim-kurallari-app",
  storageBucket: "yks-yazim-kurallari-app.firebasestorage.app",
  messagingSenderId: "41349188362",
  appId: "1:41349188362:web:5b0ec132e2315a52bb88f3",
  measurementId: "G-S91YBRNLKJ",
};

// Initialize app only if it doesn't exist
// This app instance can still be used for Analytics, AdMob, Crashlytics later
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
