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

  const isRepostFetched = selectedPost?.id === lastRepostId;

  useEffect(() => {
    if (lastRepostId && !isRepostFetched) {
      console.log("📡 Fetching repost by ID:", lastRepostId);
      fetchPostFromAPI(lastRepostId);
    }
  }, [lastRepostId, isRepostFetched, fetchPostFromAPI]);

  console.log("🧩 selectedPost:", selectedPost);
  
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
        {isLastPostDeleted ? (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#777",
            }}
          >
            Your last repost has been deleted.
          </p>
        ) : !selectedPost || !isRepostFetched ? (
          <p style={{ textAlign: "center" }}>Loading repost...</p>
        ) : (
          <UserPost post={selectedPost} />
        )}
      </div>

      <DeletePost />
      <EditPost />
    </>
  );
};

export default RepostPage;
