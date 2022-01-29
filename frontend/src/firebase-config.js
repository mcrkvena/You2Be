// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_u229xPavlg8gjM2PAMhuMK9eF1By9jw",
  authDomain: "you2be-fdf93.firebaseapp.com",
  projectId: "you2be-fdf93",
  storageBucket: "you2be-fdf93.appspot.com",
  messagingSenderId: "402805241372",
  appId: "1:402805241372:web:7cb479a4cd2e5578b551d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);