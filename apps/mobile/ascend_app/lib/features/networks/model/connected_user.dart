// ignore_for_file: non_constant_identifier_names

class ConnectedUser {
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_url;
  String? headline;
  DateTime? connected_at;

  ConnectedUser({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    required this.profile_image_url,
    required this.headline,
    required this.connected_at,
  });

  ConnectedUser.fromJson(Map<String, dynamic> json) {
    user_id = json['user_id'].toString();
    first_name = json['first_name'];
    last_name = json['last_name'];
    profile_image_url = json['profile_picture_url'];
    headline = json['headline'];
    connected_at = DateTime.parse(json['connected_at']);
  }

  ConnectedUser copyWith({
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? headline,
    DateTime? connected_at,
    String? request_id,
  }) {
    return ConnectedUser(
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_url: profile_image_id ?? this.profile_image_url,
      headline: headline ?? this.headline,
      connected_at: connected_at ?? this.connected_at,
    );
  }

  Map<String, dynamic> toJson() => {
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profilePictureUrl": profile_image_url,
    "headline": headline,
    "connected_at": connected_at?.toIso8601String(),
  };
}
