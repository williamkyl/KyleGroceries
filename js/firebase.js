//import { initializeApp } from "/firebase/app";
//import { getDatabase } from "/firebase/database";

//import { collection, addDoc } from "/firebase/firestore";
//import { getFirestore } from "/firebase/firestore";
import { getAnalytics } from "https://cdn.skypack.dev/@firebase/analytics";
import { initializeApp } from "https://cdn.skypack.dev/@firebase/app";
import { getFirestore } from "https://cdn.skypack.dev/@firebase/firestore";
import { collection, addDoc } from "https://cdn.skypack.dev/@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvZ8UoCgaDEp6bnF0D-Dkflr5pKkR6_CA",
    authDomain: "kylegroceries.firebaseapp.com",
    projectId: "kylegroceries",
    storageBucket: "kylegroceries.appspot.com",
    messagingSenderId: "105564361862",
    appId: "1:105564361862:web:34a8e1a4334cd4f557ad07",
    measurementId: "G-7GSJCTGWKD"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);