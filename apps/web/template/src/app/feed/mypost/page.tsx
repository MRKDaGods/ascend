// "use client";

// import React from "react";
// import Navbar from "@/app/components/Navbar";
// import UserPost from "@/app/components/UserPost";
// import DeletePost from "@/app/components/DeletePost";
// import EditPost from "@/app/components/EditPost";
// import { usePostStore } from "@/app/stores/usePostStore";

// const MyPostPage = () => {
//   const { posts, isLastPostDeleted } = usePostStore();
//   const userPosts = posts.filter((post) => post.isUserPost);
//   const lastUserPost = userPosts[userPosts.length - 1];

//   return (
//     <>
//       <Navbar />

//       {!isLastPostDeleted && lastUserPost && (
//         <div style={{ maxWidth: "700px", margin: "0 auto" }}>
//           <UserPost post={lastUserPost} />
//         </div>
//       )}

//       <DeletePost />
//       <EditPost />
//     </>
//   );
// };

// export default MyPostPage;

"use client";
import { useEffect } from "react";
import { usePostStore } from "@/app/stores/usePostStore";
import UserPost from "@/app/components/UserPost";
import Navbar from "@/app/components/Navbar";

const MyPostPage = () => {
  const { lastUserPostId, fetchPost, selectedPost } = usePostStore();

  useEffect(() => {
    if (lastUserPostId) fetchPost(lastUserPostId);
  }, [lastUserPostId]);

  return (
    <>
    <Navbar />
     <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      {selectedPost ? <UserPost post={selectedPost} /> : "Loading..."}
    </div>
    </>   
  );
};

export default MyPostPage;
