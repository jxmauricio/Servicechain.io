// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth,GoogleAuthProvider,browserSessionPersistence,setPersistence,browserLocalPersistence} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZyJIk0gofCW9fZMBKDHAAJ6f1CRRc6us",
  authDomain: "servicechain-2adbf.firebaseapp.com",
  projectId: "servicechain-2adbf",
  storageBucket: "servicechain-2adbf.appspot.com",
  messagingSenderId: "305810967168",
  appId: "1:305810967168:web:2128208aa2a7157558f465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//connect authentication to our app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app)
//connect firestore to our app 
export const db = getFirestore(app)