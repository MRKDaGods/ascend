"use client";

import { api, extApi, refreshAuthState } from "@/api";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import router from "next/router";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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

    // Call api
    const response = await extApi.post("/auth/social-login", {
      token,
      userData: user,
    });

    if (response.status !== 200) {
      throw new Error(`Error during social login: ${response.statusText}`);
    }

    const data = await response.data;
    console.log("Social login response: ", data);

    localStorage.setItem("persist", "true");
    localStorage.setItem("access_token", data.token);
    localStorage.setItem("auth_token", data.token);
    api.auth.setAuthToken(data.token);

    refreshAuthState();
    window.location.href = "/feed";
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error during Google login: ", errorCode, errorMessage);

    throw error;
  }
};

// repeat for whatever b2a
