// ignore_for_file: non_constant_identifier_names
import 'package:ascend_app/features/networks/model/connected_user.dart';

class LoadedUserProfile {
  String user_id;
  String first_name;
  String last_name;
  String? profile_image_id;
  String? bio;
  String? industry;
  String? location;
  String? search_rank;
  String? is_connected;
  bool? is_followed;
  bool? canConnect;
  bool? canReceiveMessageRequests;
  List<ConnectedUser>? connected_users;
  int? connected_users_count;

  LoadedUserProfile({
    required this.user_id,
    required this.first_name,
    required this.last_name,
    this.profile_image_id,
    this.bio,
    this.industry,
    this.location,
    this.search_rank,
    this.is_connected,
    this.is_followed,
    this.canConnect,
    this.canReceiveMessageRequests,
    this.connected_users,
    this.connected_users_count,
  });

  factory LoadedUserProfile.fromJson(Map<String, dynamic> json) {
    return LoadedUserProfile(
      user_id: json["user_id"].toString(),
      first_name: json["first_name"],
      last_name: json["last_name"],
      profile_image_id: json["profile_image_id"],
      bio: json["bio"],
      industry: json["industry"],
      location: json["location"],
      search_rank: json["search_rank"].toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "user_id": user_id,
      "first_name": first_name,
      "last_name": last_name,
      "profile_image_id": profile_image_id,
      "bio": bio,
      "industry": industry,
      "location": location,
      "search_rank": search_rank,
    };
  }

  LoadedUserProfile copyWith({
    String? user_id,
    String? first_name,
    String? last_name,
    String? profile_image_id,
    String? bio,
    String? industry,
    String? location,
    String? search_rank,
    String? is_connected,
    bool? is_followed,
    bool? canConnect,
    bool? canReceiveMessageRequests,
    List<ConnectedUser>? connected_users,
    int? connected_users_count,
  }) {
    return LoadedUserProfile(
      user_id: user_id ?? this.user_id,
      first_name: first_name ?? this.first_name,
      last_name: last_name ?? this.last_name,
      profile_image_id: profile_image_id ?? this.profile_image_id,
      bio: bio ?? this.bio,
      industry: industry ?? this.industry,
      location: location ?? this.location,
      search_rank: search_rank ?? this.search_rank,
      is_connected: is_connected ?? this.is_connected,
      is_followed: is_followed ?? this.is_followed,
      canConnect: canConnect ?? this.canConnect,
      canReceiveMessageRequests:
          canReceiveMessageRequests ?? this.canReceiveMessageRequests,
      connected_users: connected_users ?? this.connected_users,
      connected_users_count:
          connected_users_count ?? this.connected_users_count,
    );
  }
}
