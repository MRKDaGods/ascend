"use client";

import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore } from "@/app/stores/usePostStore";

const RepostPage = () => {
  const {
    lastRepostId,
    fetchPostFromAPI,
    selectedPost,
    isLastPostDeleted,
  } = usePostStore();

  useEffect(() => {
    if (lastRepostId) {
      console.log("📡 Fetching repost by ID:", lastRepostId);
      fetchPostFromAPI(lastRepostId);
    }
  }, [lastRepostId]);

  const isLoading = !selectedPost || selectedPost.id !== lastRepostId;
  const isRepost = !!selectedPost?.repostSourcePost;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
        {isLastPostDeleted ? (
          <p style={{ textAlign: "center", fontStyle: "italic", color: "#777" }}>
            Your last repost has been deleted.
          </p>
        ) : isLoading ? (
          <p style={{ textAlign: "center" }}>Loading repost...</p>
        ) : isRepost ? (
          <UserPost post={selectedPost} />
        ) : (
          <p style={{ textAlign: "center", color: "darkblue" }}>
            No repost detected. Your last post is not a repost.
          </p>
        )}
      </div>

      <DeletePost />
      <EditPost />
    </>
  );
};

export default RepostPage;
