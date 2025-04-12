import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_connected_users.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_blocked_users.dart';

class MockFollowedUsers {
  // In-memory collections to maintain followers/following relationships
  static final Map<String, Set<String>> _following = {
    'current_user_id': {'20', '21', '22', '23', '24'},
    '20': {'current_user_id', '21', '22'},
    '21': {'current_user_id', '20', '23'},
    // Add more relationships as needed
  };

  static final Map<String, Set<String>> _followers = {
    'current_user_id': {'20', '21'},
    '20': {'current_user_id', '21', '22'},
    '21': {'current_user_id', '20'},
    '22': {'20', 'current_user_id'},
    '23': {'21', 'current_user_id'},
    '24': {'current_user_id'},
    // Add more relationships as needed
  };

  // Cache of user details for quick lookup
  static final Map<String, FollowedUser> _userDetails = {
    '20': FollowedUser(
      user_id: '20',
      first_name: 'Rose',
      last_name: 'Harris',
      profile_image_id: 'assets/facebook.png',
      bio: 'UX Researcher at Amazon',
      followedAt: DateTime.now().subtract(const Duration(days: 60)),
    ),
    '21': FollowedUser(
      user_id: '21',
      first_name: 'Sam',
      last_name: 'Moore',
      profile_image_id: 'assets/facebook.png',
      bio: 'Machine Learning Engineer at Apple',
      followedAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    '22': FollowedUser(
      user_id: '22',
      first_name: 'Tina',
      last_name: 'Martin',
      profile_image_id: 'assets/facebook.png',
      bio: 'Software Engineer at Microsoft',
      followedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    '23': FollowedUser(
      user_id: '23',
      first_name: 'Umar',
      last_name: 'Jackson',
      profile_image_id: 'assets/facebook.png',
      bio: 'Performance Engineer at Netflix',
      followedAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
    '24': FollowedUser(
      user_id: '24',
      first_name: 'Vivian',
      last_name: 'Thompson',
      profile_image_id: 'assets/facebook.png',
      bio: 'Design Engineer at Tesla',
      followedAt: DateTime.now().subtract(const Duration(days: 15)),
    ),
    // Add more users as needed
  };

  // Get users that the specified user follows
  static List<FollowedUser> getFollowing(
    String userId, {
    int page = 1,
    int limit = 10,
  }) {
    // Get the set of users that userId follows
    final followingIds = _following[userId] ?? <String>{};

    // Filter out blocked users
    final filteredIds =
        followingIds
            .where((id) => !MockBlockedUsers.isUserBlocked(id))
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredIds.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredIds.length
            ? filteredIds.length
            : startIndex + limit;

    final paginatedIds = filteredIds.sublist(startIndex, endIndex);

    // Convert IDs to FollowedUser objects
    return paginatedIds.map((id) {
      final userData = _userDetails[id];
      if (userData != null) {
        return userData;
      }

      // Fallback for users not in cache
      return FollowedUser(
        user_id: id,
        first_name: 'Unknown',
        last_name: 'User',
        profile_image_id: 'assets/EmptyUser.png',
        bio: 'No information available',
        followedAt: DateTime.now(),
      );
    }).toList();
  }

  // Get users following the specified user
  static List<FollowedUser> getFollowers(
    String userId, {
    int page = 1,
    int limit = 10,
  }) {
    // Get the set of users following userId
    final followerIds = _followers[userId] ?? <String>{};

    // Filter out blocked users
    final filteredIds =
        followerIds.where((id) => !MockBlockedUsers.isUserBlocked(id)).toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredIds.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredIds.length
            ? filteredIds.length
            : startIndex + limit;

    final paginatedIds = filteredIds.sublist(startIndex, endIndex);

    // Convert IDs to FollowedUser objects
    return paginatedIds.map((id) {
      final userData = _userDetails[id];
      if (userData != null) {
        return userData;
      }

      // Fallback for users not in cache
      return FollowedUser(
        user_id: id,
        first_name: 'Unknown',
        last_name: 'User',
        profile_image_id: 'assets/EmptyUser.png',
        bio: 'No information available',
        followedAt: DateTime.now(),
      );
    }).toList();
  }

  // Get suggested users to follow
  static List<FollowedUser> getSuggestedToFollow({
    int page = 1,
    int limit = 10,
  }) {
    // For simplicity, suggest users that are not already followed by current_user_id
    final following = _following['current_user_id'] ?? <String>{};
    final suggestions =
        _userDetails.values
            .where(
              (user) =>
                  !following.contains(user.user_id) &&
                  !MockBlockedUsers.isUserBlocked(user.user_id!) &&
                  user.user_id != 'current_user_id',
            )
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= suggestions.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > suggestions.length
            ? suggestions.length
            : startIndex + limit;

    return suggestions.sublist(startIndex, endIndex);
  }

  // Follow a user
  static void followUser(String followerUserId, String userToFollowId) {
    // Check if the user is blocked
    if (MockBlockedUsers.isUserBlocked(userToFollowId)) {
      print('Cannot follow blocked user: $userToFollowId');
      return;
    }

    // Add to following set
    if (!_following.containsKey(followerUserId)) {
      _following[followerUserId] = <String>{};
    }
    _following[followerUserId]!.add(userToFollowId);

    // Add to followers set of the target user
    if (!_followers.containsKey(userToFollowId)) {
      _followers[userToFollowId] = <String>{};
    }
    _followers[userToFollowId]!.add(followerUserId);

    print('$followerUserId is now following $userToFollowId');
  }

  // Unfollow a user
  static void unfollowUser(String followerUserId, String userToUnfollowId) {
    // Remove from following set
    _following[followerUserId]?.remove(userToUnfollowId);

    // Remove from followers set of the target user
    _followers[userToUnfollowId]?.remove(followerUserId);

    print('$followerUserId has unfollowed $userToUnfollowId');
  }

  // Remove a follower
  static void removeFollower(
    String followerUserId,
    String userBeingFollowedId,
  ) {
    // Remove from followers set
    _followers[userBeingFollowedId]?.remove(followerUserId);

    // Remove from following set of the follower
    _following[followerUserId]?.remove(userBeingFollowedId);

    print('$followerUserId is no longer following $userBeingFollowedId');
  }

  // Check if userA follows userB
  static bool isFollowing(String followerUserId, String followedUserId) {
    return _following[followerUserId]?.contains(followedUserId) ?? false;
  }

  // Get mutual followers between two users
  static List<FollowedUser> getMutualFollowers(
    String userIdA,
    String userIdB, {
    int limit = 10,
  }) {
    // If either user is blocked, return empty list
    if (MockBlockedUsers.isUserBlocked(userIdA) ||
        MockBlockedUsers.isUserBlocked(userIdB)) {
      return [];
    }

    // Get followers of both users
    final followersOfA = _followers[userIdA] ?? <String>{};
    final followersOfB = _followers[userIdB] ?? <String>{};

    // Find the intersection
    final mutualIds = followersOfA.intersection(followersOfB);

    // Convert to user objects and limit
    return mutualIds
        .where((id) => !MockBlockedUsers.isUserBlocked(id))
        .take(limit)
        .map((id) {
          final userData = _userDetails[id];
          if (userData != null) {
            return userData;
          }

          // Fallback
          return FollowedUser(
            user_id: id,
            first_name: 'Unknown',
            last_name: 'User',
            profile_image_id: 'assets/EmptyUser.png',
            bio: 'No information available',
            followedAt: DateTime.now(),
          );
        })
        .toList();
  }
}

// Helper functions for easy access
List<FollowedUser> getFollowing({int page = 1, int limit = 10}) {
  return MockFollowedUsers.getFollowing(
    'current_user_id',
    page: page,
    limit: limit,
  );
}

List<FollowedUser> getFollowers({int page = 1, int limit = 10}) {
  return MockFollowedUsers.getFollowers(
    'current_user_id',
    page: page,
    limit: limit,
  );
}

List<FollowedUser> getSuggestedToFollow({int page = 1, int limit = 10}) {
  return MockFollowedUsers.getSuggestedToFollow(page: page, limit: limit);
}

void followUser(String userToFollowId) {
  MockFollowedUsers.followUser('current_user_id', userToFollowId);
}

void unfollowUser(String userToUnfollowId) {
  MockFollowedUsers.unfollowUser('current_user_id', userToUnfollowId);
}

bool isFollowing(String followedUserId) {
  return MockFollowedUsers.isFollowing('current_user_id', followedUserId);
}

List<FollowedUser> getMutualFollowers(String userIdB, {int limit = 10}) {
  return MockFollowedUsers.getMutualFollowers(
    'current_user_id',
    userIdB,
    limit: limit,
  );
}
