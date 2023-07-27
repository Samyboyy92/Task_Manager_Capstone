import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7o6NsSIQqrvPaZ6lYS7UfQRRkPycmvj0",
  authDomain: "task-manager-98e6e.firebaseapp.com",
  projectId: "task-manager-98e6e",
  storageBucket: "task-manager-98e6e.appspot.com",
  messagingSenderId: "506167793757",
  appId: "1:506167793757:web:b491528bdaf11fb6a515b4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();