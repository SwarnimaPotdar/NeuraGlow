// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqP1V6mPB-b9KBzZwZclLzlKBFQn0qf9w",
  authDomain: "neuraglow-ae672.firebaseapp.com",
  projectId: "neuraglow-ae672",
  storageBucket: "neuraglow-ae672.firebasestorage.app",
  messagingSenderId: "848917904436",
  appId: "1:848917904436:web:39d4f5396a3c7a44c09e61",
  measurementId: "G-6JVSBHJKT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
