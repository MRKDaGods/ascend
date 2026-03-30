"use client";

import { api, extApi, refreshAuthState } from "@/api";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import router from "next/router";

const firebaseConfig = {
  apiKey: "AIzaSyB7wSycMX1wWoRcmq1X8gkxGx9Dtvy2CdY",
  authDomain: "ascend-46a60.firebaseapp.com",
  projectId: "ascend-46a60",
  storageBucket: "ascend-46a60.firebasestorage.app",
  messagingSenderId: "478636127188",
  appId: "1:478636127188:web:fa28b5c744a3e1d5ea9c41",
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
