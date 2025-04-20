"use client";

import { useEffect } from "react";
import { usePostStore } from "@/app/stores/usePostStore";
import UserPost from "@/app/components/UserPost";
import Navbar from "@/app/components/Navbar";
import DeletePost from "@/app/components/DeletePost";

const MyPostPage = () => {
  const {
    lastUserPostId,
    fetchPostFromAPI,
    selectedPost,
    isLastPostDeleted,
  } = usePostStore();

  useEffect(() => {
    if (lastUserPostId) {
      fetchPostFromAPI(lastUserPostId);
    }
  }, [lastUserPostId]);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
        {isLastPostDeleted ? (
          <p style={{ textAlign: "center", fontStyle: "italic", color: "#777" }}>
          </p>
        ) : selectedPost ? (
          <UserPost post={selectedPost} />
        ) : (
          <p style={{ textAlign: "center" }}>Loading...</p>
        )}
      </div>
      <DeletePost />
    </>
  );
};

export default MyPostPage;
