import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmiSztzw7HFw8FERgLf7TqEX3yYq-ngio",
  authDomain: "post-it-e0a4f.firebaseapp.com",
  projectId: "post-it-e0a4f",
  storageBucket: "post-it-e0a4f.appspot.com",
  messagingSenderId: "988829485312",
  appId: "1:988829485312:web:71bdcb3e8598588aeccbe5",
  measurementId: "G-4SHSY16YK4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
