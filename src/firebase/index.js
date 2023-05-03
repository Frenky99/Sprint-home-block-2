import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARyU3VDrLfjSwJGHiVK1jDx5yKllipJ1E",
  authDomain: "mytodolist-2fb65.firebaseapp.com",
  projectId: "mytodolist-2fb65",
  storageBucket: "mytodolist-2fb65.appspot.com",
  messagingSenderId: "152839573590",
  appId: "1:152839573590:web:2a23751ae390fd668f6bf7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db
}
