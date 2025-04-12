import 'package:ascend_app/features/networks/model/connected_user.dart';

class UserSuggestedtoConnect {
  String? user_id;
  String? first_name;
  String? last_name;
  String? profile_image_id;
  String? bio;
  List<ConnectedUser>? MutualUsers;
  int? connectionsCount;

  UserSuggestedtoConnect({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    required this.profile_image_id,
    required this.bio,
    this.MutualUsers,
    this.connectionsCount,
  });

  UserSuggestedtoConnect.fromJson(Map<String, dynamic> json) {
    user_id = json['user_id'];
    first_name = json['first_name'];
    last_name = json['last_name'];
    profile_image_id = json['profile_image_id'];
    bio = json['bio'];
    MutualUsers =
        (json['MutualUsers'] as List?)
            ?.map((e) => ConnectedUser.fromJson(e))
            .toList();
    connectionsCount = json['connectionsCount'];
  }

  UserSuggestedtoConnect copyWith({
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? bio,
    List<ConnectedUser>? MutualUsers,
    int? connectionsCount,
  }) {
    return UserSuggestedtoConnect(
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_id: profile_image_id ?? this.profile_image_id,
      bio: bio ?? this.bio,
      MutualUsers: MutualUsers ?? this.MutualUsers,
      connectionsCount: connectionsCount ?? this.connectionsCount,
    );
  }

  Map<String, dynamic> toJson() => {
    "user_id": user_id,
    "first_name": first_name,
    "last_name": last_name,
    "profilePictureUrl": profile_image_id,
    "bio": bio,
    "MutualUsers": MutualUsers?.map((e) => e.toJson()).toList(),
    "connectionsCount": connectionsCount,
  };
}
