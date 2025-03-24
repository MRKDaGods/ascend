class Comment {
  final String id;
  final String authorName;
  final String authorImage;
  final String? authorOccupation;
  final String text;
  final String timePosted;
  final String? parentId;
  final List<Comment> replies;
  final int likes;
  final bool isLiked;
  final String? reaction; // Add reaction type

  Comment({
    required this.id,
    required this.authorName,
    required this.authorImage,
    this.authorOccupation,
    required this.text,
    required this.timePosted,
    this.parentId,
    this.replies = const [],
    this.likes = 0,
    this.isLiked = false,
    this.reaction = 'like', // Default reaction is like
  });

  Comment copyWithNewReply(Comment reply) {
    final updatedReplies = [...replies, reply];
    return Comment(
      id: id,
      authorName: authorName,
      authorImage: authorImage,
      authorOccupation: authorOccupation,
      text: text,
      timePosted: timePosted,
      parentId: parentId,
      replies: updatedReplies,
      likes: likes,
      isLiked: isLiked,
      reaction: reaction,
    );
  }

  Comment copyWithReaction(String newReaction) {
    final bool newIsLiked = newReaction != 'none';
    
    return Comment(
      id: id,
      authorName: authorName,
      authorImage: authorImage,
      authorOccupation: authorOccupation,
      text: text,
      timePosted: timePosted,
      parentId: parentId,
      replies: replies,
      likes: newIsLiked ? (isLiked ? likes : likes + 1) : (isLiked ? likes - 1 : likes),
      isLiked: newIsLiked,
      reaction: newIsLiked ? newReaction : null,
    );
  }
}