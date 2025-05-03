// ignore_for_file: non_constant_identifier_names

class BlockedUser {
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_id;
  DateTime? blocked_at;

  BlockedUser({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    required this.profile_image_id,
    required this.blocked_at,
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
      blocked_at: blockedAt ?? this.blocked_at,
    );
  }

  factory BlockedUser.fromJson(Map<String, dynamic> json) {
    return BlockedUser(
      user_id: json['user_id'].toString(),
      first_name: json['first_name'],
      last_name: json['last_name'],
      profile_image_id: json['profile_image_id'],
      blocked_at: DateTime.parse(json['blocked_at']),
    );
  }

  Map<String, dynamic> toJson() => {
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profile_image_id": profile_image_id,
    "blocked_at": blocked_at?.toIso8601String(),
  };
}
