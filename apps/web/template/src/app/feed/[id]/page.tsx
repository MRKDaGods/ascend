"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePostStore } from "@/app/stores/usePostStore";
import ConnectionPost from "@/app/components/ConnectionPost";
import Navbar from "@/app/components/Navbar";

const ViewPostPage = () => {
  const { id } = useParams();
  const selectedPost = usePostStore((state) => state.selectedPost);
  const fetchPost = usePostStore((state) => state.fetchPostFromAPI);

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id, fetchPost]);

  if (!selectedPost) return <div style={{ padding: 20 }}>Loading post...</div>;

  return (
    <>
      <Navbar />
      <ConnectionPost post={selectedPost} />
    </>
  );
};

export default ViewPostPage;
