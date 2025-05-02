// ignore_for_file: non_constant_identifier_names
class UserPendingModel {
  String? id;
  String? message;
  DateTime? created_at;
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_id;
  String? bio;

  UserPendingModel({
    this.id,
    this.message,
    this.created_at,
    this.user_id,
    this.first_name,
    this.last_name,
    this.profile_image_id,
    this.bio,
  });

  UserPendingModel.fromJson(Map<String, dynamic> json) {
    id = json["id"].toString();
    message = json["message"];
    created_at = DateTime.parse(json["created_at"]);
    user_id = json["user_id"].toString();
    first_name = json["first_name"];
    last_name = json["last_name"];
    profile_image_id = json["profilePictureUrl"];
    bio = json["bio"];
  }

  UserPendingModel copyWith({
    String? id,
    String? message,
    DateTime? created_at,
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? bio,
  }) {
    return UserPendingModel(
      id: id ?? this.id,
      message: message ?? this.message,
      created_at: created_at ?? this.created_at,
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_id: profile_image_id ?? this.profile_image_id,
      bio: bio ?? this.bio,
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "message": message,
    "created_at": created_at?.toIso8601String(),
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profilePictureUrl": profile_image_id,
    "bio": bio,
  };
}
