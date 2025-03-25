// components/Feed.tsx
import ConnectionPost from "./ConnectionPost";
import CreatePost from "./CreatePost";
import { usePostStore } from "../store/usePostStore";

const Feed: React.FC = () => {
  const { posts } = usePostStore();

  const visiblePosts = posts.filter((post) => post.isUserPost !== true);

  return (
    <>
      <p>Check out /feed</p>
    </>
  );
};

export default Feed;
