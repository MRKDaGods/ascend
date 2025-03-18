import React from "react";
import { usePostStore } from "../store/usePostStore";
import Post from "./Post";
import UserPost from "./UserPost";
import CreatePost from "./CreatePost";

const Feed: React.FC = () => {
  const { posts } = usePostStore();

  return (
    <div>
      <CreatePost />
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) =>
          post.isUserPost ? <UserPost key={post.id} post={post} /> : <Post key={post.id} post={post} />
        )
      )}
    </div>
  );
};

export default Feed;
