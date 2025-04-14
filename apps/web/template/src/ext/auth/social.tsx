"use client";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7wSycMX1wWoRcmq1X8gkxGx9Dtvy2CdY",
  authDomain: "ascend-46a60.firebaseapp.com",
  projectId: "ascend-46a60",
  storageBucket: "ascend-46a60.firebasestorage.app",
  messagingSenderId: "478636127188",
  appId: "1:478636127188:web:fa28b5c744a3e1d5ea9c41"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const auth = getAuth(app);
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log("User signed in with Google: ", user);
    console.log("Access Token: ", token);
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Error signing in with Google: ", errorCode, errorMessage, email, credential);

    throw error;
  }
}

// repeat for whatever b2a