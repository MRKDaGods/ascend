class FollowModel {
  final String followerId;
  final String followingId;

  FollowModel({required this.followerId, required this.followingId});

  FollowModel copyWith({String? followerId, String? followingId}) {
    return FollowModel(
      followerId: followerId ?? this.followerId,
      followingId: followingId ?? this.followingId,
    );
  }

  factory FollowModel.fromJson(Map<String, dynamic> json) => FollowModel(
    followerId: json["followerId"],
    followingId: json["followingId"],
  );

  Map<String, dynamic> toJson() => {
    "followerId": followerId,
    "followingId": followingId,
  };
}
