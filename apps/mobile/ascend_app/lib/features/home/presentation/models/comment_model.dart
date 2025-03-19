class Comment {
  final String id; // Add an id for tracking
  final String authorName;
  final String authorImage;
  final String text;
  final String timePosted;
  final List<Comment> replies; // Add replies
  final String? parentId; // Track parent comment for replies

  Comment({
    required this.id,
    required this.authorName,
    required this.authorImage,
    required this.text,
    required this.timePosted,
    this.replies = const [], // Default to empty list
    this.parentId,
  });

  // Create a copy with replies
  Comment copyWithNewReply(Comment reply) {
    return Comment(
      id: id,
      authorName: authorName,
      authorImage: authorImage,
      text: text,
      timePosted: timePosted,
      parentId: parentId,
      replies: [...replies, reply],
    );
  }
}