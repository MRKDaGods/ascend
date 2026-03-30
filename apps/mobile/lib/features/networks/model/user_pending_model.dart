// ignore_for_file: non_constant_identifier_names
import 'package:ascend_app/features/networks/model/connected_user.dart';

class UserPendingModel {
  String? id;
  String? message;
  DateTime? created_at;
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_picture_url;
  String? bio;
  List<ConnectedUser>? connected_users;
  int? connected_users_count;

  UserPendingModel({
    this.id,
    this.message,
    this.created_at,
    this.user_id,
    this.first_name,
    this.last_name,
    this.profile_picture_url,
    this.bio,
    this.connected_users,
    this.connected_users_count,
  });

  UserPendingModel.fromJson(Map<String, dynamic> json) {
    id = json["id"].toString();
    message = json["message"];
    created_at = DateTime.parse(json["created_at"]);
    user_id = json["user_id"].toString();
    first_name = json["first_name"];
    last_name = json["last_name"];
    profile_picture_url = json["profilePictureUrl"];
    bio = json["bio"];
    connected_users =
        json["connected_users"] != null
            ? (json["connected_users"] as List)
                .map((e) => ConnectedUser.fromJson(e))
                .toList()
            : null;
    connected_users_count =
        json["connected_users_count"] != null
            ? int.parse(json["connected_users_count"].toString())
            : null;
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
    List<ConnectedUser>? connected_users,
    int? connected_users_count,
  }) {
    return UserPendingModel(
      id: id ?? this.id,
      message: message ?? this.message,
      created_at: created_at ?? this.created_at,
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_picture_url: profile_image_id ?? this.profile_picture_url,
      bio: bio ?? this.bio,
      connected_users: connected_users ?? this.connected_users,
      connected_users_count:
          connected_users_count ?? this.connected_users_count,
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "message": message,
    "created_at": created_at?.toIso8601String(),
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profilePictureUrl": profile_picture_url,
    "bio": bio,
    "connected_users": connected_users?.map((e) => e.toJson()).toList(),
    "connected_users_count": connected_users_count,
  };
}
