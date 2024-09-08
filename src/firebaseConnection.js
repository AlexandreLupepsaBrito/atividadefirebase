import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-JtbKQLmRrKIiyShguunG-L3MIurPj8w",
  authDomain: "foodfy-640ce.firebaseapp.com",
  projectId: "foodfy-640ce",
  storageBucket: "foodfy-640ce.appspot.com",
  messagingSenderId: "244223342604",
  appId: "1:244223342604:web:f853d764446612b797d629"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig); // Correção: `firebaseapp` aqui
const db = getFirestore(firebaseapp);
const auth = getAuth(firebaseapp);
const storage = getStorage(firebaseapp); // Correção: `firebaseapp` aqui também

export { auth, db, storage };
