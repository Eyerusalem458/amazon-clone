import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth"; //for authentication purpose
import "firebase/compat/firestore";
import "firebase/compat/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAvGJiXTo2miQinuZvwgyea4C3iwJMUmc",
  authDomain: "clone-10477.firebaseapp.com",
  projectId: "clone-10477",
  storageBucket: "clone-10477.firebasestorage.app",
  messagingSenderId: "791549952140",
  appId: "1:791549952140:web:5acdb1bdd476ef7701fba9",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = app.firestore(app);
