"use client";
import React from "react";
import Navbar from "../components/Navbar"; 
import UserPost from "../components/UserPost";
import PostDialog from "../components/PostDialog"; // ✅ Import the post dialog
import { usePostStore } from "../store/usePostStore";

const MyPostPage = () => {
  const { posts, open } = usePostStore();
  const userPosts = posts.filter((post) => post.isUserPost);

  return (
    <>
    <Navbar />
      {userPosts.length > 0 && (
        <UserPost post={userPosts[userPosts.length - 1]} />
      )}

      {/* ✅ Always include this in case edit mode is triggered */}
      {open && <PostDialog />}
    </>
  );
};

export default MyPostPage;
