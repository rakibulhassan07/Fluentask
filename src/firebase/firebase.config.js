// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAqYavGJAfKatYj5UpxTRhfWcrpkl7jQs",
  authDomain: "fluentask.firebaseapp.com",
  projectId: "fluentask",
  storageBucket: "fluentask.firebasestorage.app",
  messagingSenderId: "342654106475",
  appId: "1:342654106475:web:d4f8408ca28e56fecfea2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };