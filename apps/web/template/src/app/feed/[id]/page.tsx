// // src/app/post/[id]/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { usePostStore } from "@/app/stores/usePostStore";
// import UserPost from "@/app/components/UserPost";

// const ViewPostPage = () => {
//   const { id } = useParams();
//   const selectedPost = usePostStore((state) => state.selectedPost);
//   const fetchPost = usePostStore((state) => state.fetchPost);

//   useEffect(() => {
//     if (id) {
//       fetchPost(Number(id));
//     }
//   }, [id, fetchPost]);

//   if (!selectedPost) return <div style={{ padding: 20 }}>Loading post...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <UserPost post={selectedPost} />
//     </div>
//   );
// };

// export default ViewPostPage;
