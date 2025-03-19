import 'package:ascend_app/features/home/domain/entities/post.dart';

class PostModel extends Post {
  const PostModel({
    required String id,
    required String content,
    required List<String> imageUrls,
    required String authorId,
    required String authorName,
    required String authorAvatarUrl,
    required DateTime timestamp,
    required int likeCount,
    required int commentCount,
    required int shareCount,
    required bool isLiked,
    required bool isSponsored,
    required bool isRemoved,
    required List<String> tags,
    required String location, 
    required String reactionType,
  }) : super(
          id: id,
          content: content,
          imageUrls: imageUrls,
          authorId: authorId,
          authorName: authorName,
          authorAvatarUrl: authorAvatarUrl,
          timestamp: timestamp,
          likeCount: likeCount,
          commentCount: commentCount,
          shareCount: shareCount,
          isLiked: isLiked,
          isSponsored: isSponsored,
          isRemoved: isRemoved,
          tags: tags,
          location: location,
          reactionType: reactionType,
        );

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] ?? '',
      content: json['content'] ?? '',
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      authorId: json['authorId'] ?? '',
      authorName: json['authorName'] ?? '',
      authorAvatarUrl: json['authorAvatarUrl'] ?? '',
      timestamp: json['timestamp'] != null 
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
      likeCount: json['likeCount'] ?? 0,
      commentCount: json['commentCount'] ?? 0,
      shareCount: json['shareCount'] ?? 0,
      isLiked: json['isLiked'] ?? false,
      isSponsored: json['isSponsored'] ?? false,
      isRemoved: json['isRemoved'] ?? false,
      tags: List<String>.from(json['tags'] ?? []),
      location: json['location'] ?? '',
      reactionType: json['reactionType'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'content': content,
      'imageUrls': imageUrls,
      'authorId': authorId,
      'authorName': authorName,
      'authorAvatarUrl': authorAvatarUrl,
      'timestamp': timestamp.toIso8601String(),
      'likeCount': likeCount,
      'commentCount': commentCount,
      'shareCount': shareCount,
      'isLiked': isLiked,
      'isSponsored': isSponsored,
      'isRemoved': isRemoved,
      'tags': tags,
      'location': location,
      'reactionType': reactionType,
    };
  }
}