import React from "react";
import { render, screen } from "@testing-library/react";
import Comment from "../components/Comment";
import { PostType } from "../stores/usePostStore";

// ✅ Use jest.mock instead of vi.mock
jest.mock("../stores/usePostStore", () => ({
  usePostStore: () => ({
    commentOnPostFromAPI: jest.fn(),
    addTagToComment: jest.fn(),
  }),
}));

const postMock: PostType = {
  id: 1,
  profilePic: "",
  username: "John Doe",
  content: "This is a post content",
  followers: "",
  timestamp: new Date().toISOString(),
  likes: 5,
  comments: 2,
  reposts: 1,
  commentsList: ["Nice post!", "Well said!"],
  tags: [],
  reaction: undefined,
  commentTags: {},
  image: "",
  video: "",
  file: null,
  fileTitle: null,
  isUserPost: false,
};

describe("Comment Component", () => {
  it("renders comment input when showCommentInput is true", () => {
    render(
      <Comment
        post={postMock}
        showCommentInput={true}
        showComments={false}
        setShowComments={jest.fn()}
      />
    );
    expect(
      screen.getByPlaceholderText("Write a comment...")
    ).toBeInTheDocument();
  });

  it("renders comments when showComments is true", () => {
    render(
      <Comment
        post={postMock}
        showCommentInput={false}
        showComments={true}
        setShowComments={jest.fn()}
      />
    );
    expect(screen.getByText("Nice post!")).toBeInTheDocument();
    expect(screen.getByText("Well said!")).toBeInTheDocument();
  });

  it("renders no comments message when there are no comments", () => {
    const noCommentPost = { ...postMock, commentsList: [] };
    render(
      <Comment
        post={noCommentPost}
        showCommentInput={false}
        showComments={true}
        setShowComments={jest.fn()}
      />
    );
    expect(
      screen.getByText("No comments yet. Be the first to comment!")
    ).toBeInTheDocument();
  });
});
