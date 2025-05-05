import 'package:flutter/foundation.dart';

@immutable
class PostUser {
  final int id;
  final String firstName;
  final String lastName;
  // profile_picture_url seems to be an ID in the post result, handle accordingly or adjust API
  final dynamic profilePictureUrl; // Use dynamic for now

  const PostUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profilePictureUrl,
  });

  factory PostUser.fromJson(Map<String, dynamic> json) {
    return PostUser(
      id: json['id'] as int,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      profilePictureUrl: json['profile_picture_url'], // Keep as dynamic
    );
  }
   String get fullName => '$firstName $lastName';
}

@immutable
class PostSearchResult {
  final int id;
  final String content;
  final PostUser user;
  // Add other relevant fields like created_at, media preview if needed

  const PostSearchResult({
    required this.id,
    required this.content,
    required this.user,
  });

  factory PostSearchResult.fromJson(Map<String, dynamic> json) {
    return PostSearchResult(
      id: json['id'] as int,
      content: json['content'] as String,
      user: PostUser.fromJson(json['user'] as Map<String, dynamic>),
    );
  }
}
