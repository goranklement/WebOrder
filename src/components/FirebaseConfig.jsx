import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6W_7rDZyu_idLEeKnsVyeXcqLk3CsWZo",

  authDomain: "qrscannergklcl.firebaseapp.com",

  databaseURL:
    "https://qrscannergklcl-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "qrscannergklcl",

  storageBucket: "qrscannergklcl.appspot.com",

  messagingSenderId: "778994165396",

  appId: "1:778994165396:web:0230a8fbb828e377187681",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
