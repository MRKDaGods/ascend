class BlockedUser {
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_id;
  String? bio;
  DateTime? blockedAt;

  BlockedUser({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    required this.profile_image_id,
    required this.bio,
    required this.blockedAt,
  });

  BlockedUser copyWith({
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? bio,
    DateTime? blockedAt,
  }) {
    return BlockedUser(
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_id: profile_image_id ?? this.profile_image_id,
      bio: bio ?? this.bio,
      blockedAt: blockedAt ?? this.blockedAt,
    );
  }

  factory BlockedUser.fromJson(Map<String, dynamic> json) {
    return BlockedUser(
      user_id: json['user_id'],
      first_name: json['first_name'],
      last_name: json['last_name'],
      profile_image_id: json['profile_image_id'],
      bio: json['bio'],
      blockedAt: DateTime.parse(json['blockedAt']),
    );
  }

  Map<String, dynamic> toJson() => {
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profile_image_id": profile_image_id,
    "bio": bio,
    "blockedAt": blockedAt,
  };
}
