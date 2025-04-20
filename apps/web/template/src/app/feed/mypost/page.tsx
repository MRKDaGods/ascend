"use client";

import React from "react";
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
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <UserPost post={lastUserPost} />
        </div>
      )}

      <DeletePost />
      <EditPost />
    </>
  );
};

export default MyPostPage;
