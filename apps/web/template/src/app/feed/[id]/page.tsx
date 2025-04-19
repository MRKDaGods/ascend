"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePostStore } from "@/app/stores/usePostStore";
import ConnectionPost from "@/app/components/ConnectionPost";

export default function MyPostPage() {
  const params = useParams();
  const postId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  const fetchPost = usePostStore((state) => state.fetchPost);
  const selectedPost = usePostStore((state) => state.selectedPost);

  useEffect(() => {
    if (postId) {
      console.log("✅ Fetching post by ID:", postId);
      fetchPost(Number(postId));
    } else {
      console.warn("⚠️ Invalid post ID:", postId);
    }
  }, [postId]);

  if (!selectedPost) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <ConnectionPost post={selectedPost} />
    </div>
  );
}
