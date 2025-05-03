import 'package:flutter/foundation.dart';

@immutable
class UserSearchResult {
  final int id;
  final String firstName;
  final String lastName;
  final String? profilePictureUrl;
  final String? bio;
  // Add other relevant fields like headline, connection degree if available

  const UserSearchResult({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.profilePictureUrl,
    this.bio,
  });

  factory UserSearchResult.fromJson(Map<String, dynamic> json) {
    return UserSearchResult(
      id: json['id'] as int,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      profilePictureUrl: json['profile_picture_url'] as String?,
      bio: json['bio'] as String?,
    );
  }

  String get fullName => '$firstName $lastName';
}
