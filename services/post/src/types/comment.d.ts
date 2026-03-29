import { Comment } from "@shared/models";

declare module "@shared/models" {
  interface Comment {
    reactions?: {
      like_count: number;
      love_count: number;
      support_count: number;
      celebrate_count: number;
      funny_count: number;
      curious_count: number;
      insightful_count: number;
      total_reactions_count: number;
    };
    replies?: Comment[];
    userReaction?: {
      hasReacted: boolean;
      reactionType: string | null;
    };
  }
}