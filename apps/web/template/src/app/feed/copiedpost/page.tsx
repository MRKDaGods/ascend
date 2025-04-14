"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore, PostType } from "@/app/stores/usePostStore";

const CopyPostPage = () => {
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id");
  const postId = postIdParam ? parseInt(postIdParam) : null;

  const { posts } = usePostStore();
  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    if (postId) {
      const found = posts.find((p) => p.id === postId);
      setPost(found ?? null);
    }
  }, [postId, posts]);

  return (
    <>
      <Navbar />
      {post ? (
        <UserPost post={post} />
      ) : (
        <p style={{ textAlign: "center", marginTop: 50 }}>Hey! Post not found.</p>
      )}
      <DeletePost />
      <EditPost />
    </>
  );
};

export default CopyPostPage;
