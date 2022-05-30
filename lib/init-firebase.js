// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1UYnFklruZlW-yX5qdzBtmcDw-dk-nsk",
  authDomain: "cape-bbf72.firebaseapp.com",
  projectId: "cape-bbf72",
  storageBucket: "cape-bbf72.appspot.com",
  messagingSenderId: "876070741712",
  appId: "1:876070741712:web:e78619bc3269627e9ca0d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
