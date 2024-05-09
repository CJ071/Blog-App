// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-12437.firebaseapp.com",
  projectId: "mern-blog-12437",
  storageBucket: "mern-blog-12437.appspot.com",
  messagingSenderId: "980203811276",
  appId: "1:980203811276:web:9ddb3312aeeed037d5ad69"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);