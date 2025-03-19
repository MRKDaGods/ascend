import 'package:ascend_app/features/networks/model/follow_model.dart';
import 'package:ascend_app/features/networks/Mock Data/follow.dart';

class FollowRepoistory {
  final List<FollowModel> followers = generateFollowers();

  void addFollowingRepoistory(String followingId) {
    addFollowing(followers, followingId);
  }

  void deleteFollowingRepoistory(String followingId) {
    deleteFollowing(followers, followingId);
  }

  List<FollowModel> fetchFollowingsRepoistory(String followerId) {
    return fetchFollowings(followers, followerId);
  }

  List<FollowModel> fetchFollowersRepoistory(String followingId) {
    return fetchFollowers(followers, followingId);
  }
}
