class ConnectedUser {
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_id;
  String? bio;
  DateTime? connectedAt;
  String? request_id;

  ConnectedUser({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    required this.profile_image_id,
    required this.bio,
    required this.connectedAt,
    required this.request_id,
  });

  ConnectedUser.fromJson(Map<String, dynamic> json) {
    user_id = json['user_id'];
    first_name = json['first_name'];
    last_name = json['last_name'];
    profile_image_id = json['profile_image_id'];
    bio = json['bio'];
    connectedAt = DateTime.parse(json['connectedAt']);
    request_id = json['request_id'];
  }

  ConnectedUser copyWith({
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? bio,
    DateTime? connectedAt,
    String? request_id,
  }) {
    return ConnectedUser(
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_id: profile_image_id ?? this.profile_image_id,
      bio: bio ?? this.bio,
      connectedAt: connectedAt ?? this.connectedAt,
      request_id: request_id ?? this.request_id,
    );
  }

  Map<String, dynamic> toJson() => {
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profilePictureUrl": profile_image_id,
    "bio": bio,
    "connectedAt": ConnectedUser,
    "request_id": request_id,
  };
}
