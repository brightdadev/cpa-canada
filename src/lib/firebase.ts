import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Config } from "../config"; // <--- Clean Import

const firebaseConfig = {
  apiKey: Config.Firebase.ApiKey,
  authDomain: Config.Firebase.AuthDomain,
  projectId: Config.Firebase.ProjectId,
  storageBucket: Config.Firebase.StorageBucket,
  messagingSenderId: Config.Firebase.MessagingSenderId,
  appId: Config.Firebase.AppId
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
