class Comment {
  final String id;
  final String authorName;
  final String authorImage;
  final String text;
  final String timePosted;
  final String? parentId;
  final List<Comment> replies;
  final int likes; // Add this
  final bool isLiked; // Add this

  Comment({
    required this.id,
    required this.authorName,
    required this.authorImage,
    required this.text,
    required this.timePosted,
    this.parentId,
    this.replies = const [],
    this.likes = 0, // Default to 0
    this.isLiked = false, // Default to not liked
  });

  Comment copyWithNewReply(Comment reply) {
    final updatedReplies = [...replies, reply];
    return Comment(
      id: id,
      authorName: authorName,
      authorImage: authorImage,
      text: text,
      timePosted: timePosted,
      parentId: parentId,
      replies: updatedReplies,
      likes: likes,
      isLiked: isLiked,
    );
  }
  
  // Add method to create a copy with updated like status
  Comment copyWithLikeToggled() {
    return Comment(
      id: id,
      authorName: authorName,
      authorImage: authorImage,
      text: text,
      timePosted: timePosted,
      parentId: parentId,
      replies: replies,
      likes: isLiked ? likes - 1 : likes + 1,
      isLiked: !isLiked,
    );
  }
}