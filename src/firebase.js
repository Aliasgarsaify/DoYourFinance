// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPqwU2Yl8o-0D3-fdlTI7bAYOA-dGySbM",
  authDomain: "doyourfinance.firebaseapp.com",
  projectId: "doyourfinance",
  storageBucket: "doyourfinance.appspot.com",
  messagingSenderId: "482172738195",
  appId: "1:482172738195:web:4ecdbd04e00851a4240b66",
  measurementId: "G-X71GRN9B4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); 
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};
