import 'package:equatable/equatable.dart';

class Post extends Equatable {
  final String id;
  final String content;
  final List<String> imageUrls;
  final String authorId;
  final String authorName;
  final String authorAvatarUrl;
  final DateTime timestamp;
  final int likeCount;
  final int commentCount;
  final int shareCount;
  final bool isLiked;
  final bool isSponsored;
  final bool isRemoved;
  final List<String> tags;
  final String location;
  final String reactionType;

  const Post({
    required this.id,
    required this.content,
    required this.imageUrls,
    required this.authorId,
    required this.authorName,
    required this.authorAvatarUrl,
    required this.timestamp,
    required this.likeCount,
    required this.commentCount,
    required this.shareCount,
    required this.isLiked,
    required this.isSponsored,
    required this.isRemoved,
    required this.tags,
    required this.location,
    required this.reactionType,
  });

  @override
  List<Object?> get props => [
    id, content, imageUrls, authorId, authorName, authorAvatarUrl,
    timestamp, likeCount, commentCount, shareCount, isLiked, isSponsored,
    isRemoved, tags, location, reactionType
  ];
}