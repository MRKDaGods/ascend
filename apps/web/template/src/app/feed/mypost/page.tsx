"use client";

import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore } from "@/app/stores/usePostStore";

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
      <EditPost />
    </>
  );
};

export default MyPostPage;
