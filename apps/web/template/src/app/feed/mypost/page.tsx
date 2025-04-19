"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePostStore } from "@/app/stores/usePostStore"; // ✅ unified store
import ConnectionPost from "@/app/components/ConnectionPost";

export default function PostPage() {
  const { id } = useParams();
  const postId = parseInt(Array.isArray(id) ? id[0] : id ?? "", 10);

  const fetchPost = usePostStore((state) => state.fetchPost);
  const selectedPost = usePostStore((state) => state.selectedPost);

  useEffect(() => {
    if (!isNaN(postId)) {
      console.log("✅ Fetching post by ID:", postId);
      fetchPost(postId);
    } else {
      console.warn("⚠️ Invalid post ID:", postId);
    }
  }, [postId]);

  if (!selectedPost) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <ConnectionPost post={selectedPost} />
    </div>
  );
}
