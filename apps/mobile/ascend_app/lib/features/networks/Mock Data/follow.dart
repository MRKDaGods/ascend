import 'package:ascend_app/features/networks/model/follow_model.dart';

List<FollowModel> generateFollowers() {
  return [
    FollowModel(followerId: '1', followingId: '11'),
    FollowModel(followerId: '1', followingId: '12'),
    FollowModel(followerId: '7', followingId: '13'),
    FollowModel(followerId: '8', followingId: '13'),
    FollowModel(followerId: '4', followingId: '13'),
    FollowModel(followerId: '11', followingId: '13'),
    FollowModel(followerId: '7', followingId: '14'),
    FollowModel(followerId: '8', followingId: '14'),
    FollowModel(followerId: '4', followingId: '14'),
    FollowModel(followerId: '11', followingId: '15'),
    FollowModel(followerId: '9', followingId: '16'),
    FollowModel(followerId: '10', followingId: '16'),
  ];
}

void addFollowing(List<FollowModel> followers, String followingId) {
  final exist = followers.any(
    (element) =>
        (element.followingId == followingId && element.followerId == '1') ||
        (element.followerId == followingId && element.followingId == '1'),
  );

  if (!exist) {
    followers.add(FollowModel(followerId: '1', followingId: followingId));
  }
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

void hideUser(List<FollowModel> followers, String userId) {
  followers.removeWhere((element) => element.followingId == userId);
}
