"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore } from "@/app/stores/usePostStore";

const MyPostPage = () => {
    const { posts, isLastPostDeleted } = usePostStore();
    const userPosts = posts.filter((post) => post.isUserPost);
    const lastUserPost = userPosts[userPosts.length - 1];
  return (
    <>
      <Navbar />
      {!isLastPostDeleted && lastUserPost && (
        <UserPost post={lastUserPost} />
      )}
      <DeletePost />
      <EditPost />
    </>
  );
};

export default MyPostPage;