import 'package:ascend_app/features/networks/model/blocked_user_model.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_connected_users.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_followed_users.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_connection_requests.dart';

class MockBlockedUsers {
  // In-memory list to maintain blocked users (simulating a database)
  static final List<BlockedUser> _blockedUsers = [
    BlockedUser(
      user_id: '31',
      first_name: 'Chris',
      last_name: 'Evans',
      profile_image_id: 'assets/EmptyUser.png',
      bio: 'Actor and Producer',
      blockedAt: DateTime.now().subtract(const Duration(days: 60)),
    ),
    BlockedUser(
      user_id: '32',
      first_name: 'Scarlett',
      last_name: 'Johansson',
      profile_image_id: 'assets/EmptyUser.png',
      bio: 'Engineer at Google',
      blockedAt: DateTime.now().subtract(const Duration(days: 45)),
    ),
    BlockedUser(
      user_id: '33',
      first_name: 'Robert',
      last_name: 'Downey Jr.',
      profile_image_id: 'assets/EmptyUser.png',
      bio: 'Software Engineer at Microsoft',
      blockedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    BlockedUser(
      user_id: '34',
      first_name: 'Chris',
      last_name: 'Hemsworth',
      profile_image_id: 'assets/EmptyUser.png',
      bio: 'Data Scientist at Amazon',
      blockedAt: DateTime.now().subtract(const Duration(days: 20)),
    ),
  ];

  static List<BlockedUser> getBlockedUsers({int page = 1, int limit = 10}) {
    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= _blockedUsers.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > _blockedUsers.length
            ? _blockedUsers.length
            : startIndex + limit;

    return _blockedUsers.sublist(startIndex, endIndex);
  }

  static bool isUserBlocked(String userId) {
    return _blockedUsers.any((user) => user.user_id == userId);
  }

  static void blockUser(
    String userId,
    String firstName,
    String lastName,
    String profileImageId,
    String bio,
  ) {
    // Check if already blocked
    if (isUserBlocked(userId)) {
      return;
    }

    // Add to blocked users
    _blockedUsers.add(
      BlockedUser(
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        profile_image_id: profileImageId,
        bio: bio,
        blockedAt: DateTime.now(),
      ),
    );

    // Remove from connections
    MockConnectedUsers.removeConnection(userId);

    // Remove from followers and following
    MockFollowedUsers.unfollowUser('current_user_id', userId);
    MockFollowedUsers.removeFollower(userId, 'current_user_id');

    // Cancel any pending connection requests
    MockConnectionRequests.cancelAllRequestsBetweenUsers(
      'current_user_id',
      userId,
    );

    print('User $userId ($firstName $lastName) has been blocked');
  }

  static void unblockUser(String userId) {
    _blockedUsers.removeWhere((user) => user.user_id == userId);
    print('User $userId has been unblocked');
  }

  // For testing: get direct access to the list
  static List<BlockedUser> getAllBlockedUsers() {
    return List.from(_blockedUsers);
  }
}

// Helper functions for easy access
List<BlockedUser> getBlockedUsers({int page = 1, int limit = 10}) {
  return MockBlockedUsers.getBlockedUsers(page: page, limit: limit);
}

bool isUserBlocked(String userId) {
  return MockBlockedUsers.isUserBlocked(userId);
}

void blockUser(
  String userId,
  String firstName,
  String lastName,
  String profileImageId,
  String bio,
) {
  MockBlockedUsers.blockUser(userId, firstName, lastName, profileImageId, bio);
}

void unblockUser(String userId) {
  MockBlockedUsers.unblockUser(userId);
}

// Get all blocked users (for testing)
List<BlockedUser> getAllBlockedUsers() {
  return MockBlockedUsers.getAllBlockedUsers();
}
