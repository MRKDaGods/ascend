// src/app/__tests__/ConnectionPost.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "./testutils/createMockRouter";
import ConnectionPost from "../components/ConnectionPost";
import { PostType } from "../stores/usePostStore";

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

const postMock: PostType = {
  id: 1,
  username: "John Doe",
  profilePic: "/default-avatar.png",
  content: "This is a sample post content.",
  followers: "1000",
  timestamp: "2024-04-28T10:00:00Z",
  likes: 10,
  reposts: 2,
  comments: 5,
  commentsList: ["Nice post!", "Very helpful!", "Great job!"],
  isUserPost: false,
  reaction: undefined,
  tags: [],
  commentTags: {},
  fileDescription: undefined,
  file: undefined,
  fileTitle: undefined,
  isEdited: false,
  repostSourcePost: null,
  image: undefined,
  video: undefined,
};

describe("ConnectionPost Component", () => {
  it("renders the post content and username", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ConnectionPost post={postMock} />
      </RouterContext.Provider>
    );

    expect(screen.getByText(postMock.content)).toBeInTheDocument();
    expect(screen.getByText(postMock.username)).toBeInTheDocument();
  });

  it("renders post statistics correctly", () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ConnectionPost post={postMock} />
      </RouterContext.Provider>
    );

    expect(
      screen.getAllByText((content) => content.includes(postMock.likes.toString())).length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText((content) => content.includes(postMock.reposts.toString())).length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText((content) => content.includes(postMock.comments.toString())).length
    ).toBeGreaterThan(0);
  });

  it("renders the Comment input after clicking the Comment button", async () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ConnectionPost post={postMock} />
      </RouterContext.Provider>
    );

    const commentButton = screen.getByText((content) =>
      content.toLowerCase().includes("comment")
    );
    await userEvent.click(commentButton);

    // Use findBy... instead of getBy...
    const commentInput = await screen.findByPlaceholderText("Write a comment...");
    expect(commentInput).toBeInTheDocument();
  });
});
