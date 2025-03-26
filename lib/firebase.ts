import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAeqeB6siZIWytvBYzW6WGMF9jxlaJMOjA",
    authDomain: "netgen-5b8be.firebaseapp.com",
    projectId: "netgen-5b8be",
    storageBucket: "netgen-5b8be.firebasestorage.app",
    messagingSenderId: "949609725188",
    appId: "1:949609725188:web:dc71a1c327a564aeb02451"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
