"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import SavedPosts from "@/app/components/SavedPosts";

const SavePage = () => {
  return (
    <>
      <Navbar />
      <SavedPosts />
    </>
  );
};

export default SavePage;
