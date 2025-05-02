class ReportedPost {
  final String id;
  final Map<String, String> user;
  final String content;
  final String createdAt;
  final String privacy;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final List<Map<String, String>> media;
  final List<Map<String, String>> reports;

  ReportedPost({
    required this.id,
    required this.user,
    required this.content,
    required this.createdAt,
    required this.privacy,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.media,
    required this.reports,
  });

  factory ReportedPost.fromMap(Map<String, dynamic> map) {
    return ReportedPost(
      id: map['id'],
      user: Map<String, String>.from(map['user']),
      content: map['content'],
      createdAt: map['created_at'],
      privacy: map['privacy'],
      likesCount: map['likes_count'],
      commentsCount: map['comments_count'],
      sharesCount: map['shares_count'],
      media: List<Map<String, String>>.from(map['media']),
      reports: List<Map<String, String>>.from(map['reports']),
    );
  }
}