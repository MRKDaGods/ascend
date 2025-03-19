import 'package:ascend_app/features/networks/model/follow_model.dart';

List<FollowModel> generateFollowers() {
  return [
    FollowModel(followerId: '1', followingId: '11'),
    FollowModel(followerId: '1', followingId: '12'),
  ];
}

void addFollowing(List<FollowModel> followers, String followingId) {
  followers.add(FollowModel(followerId: '1', followingId: followingId));
}

void deleteFollowing(List<FollowModel> followers, String followingId) {
  followers.removeWhere((element) => element.followingId == followingId);
}

List<FollowModel> fetchFollowings(
  List<FollowModel> followers,
  String followerId,
) {
  return followers
      .where((element) => element.followerId == followerId)
      .toList();
}

List<FollowModel> fetchFollowers(
  List<FollowModel> followers,
  String followingId,
) {
  return followers
      .where((element) => element.followingId == followingId)
      .toList();
}
