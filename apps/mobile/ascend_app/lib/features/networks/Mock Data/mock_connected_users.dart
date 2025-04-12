import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_blocked_users.dart';

class MockConnectedUsers {
  // In-memory list to maintain connections (simulating a database)
  static final List<ConnectedUser> _connectedUsers = [
    ConnectedUser(
      user_id: '1',
      first_name: 'John',
      last_name: 'Doe',
      profile_image_id: 'assets/logo.jpg',
      bio: 'Software Engineer at Google',
      connectedAt: DateTime.now().subtract(const Duration(days: 30)),
      request_id: '123',
    ),
    ConnectedUser(
      user_id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      profile_image_id: 'assets/logo.jpg',
      bio: 'Product Manager at Facebook',
      connectedAt: DateTime.now().subtract(const Duration(days: 25)),
      request_id: '124',
    ),
    // Add more connected users...
  ];

  static List<ConnectedUser> getConnectedUsers({int page = 1, int limit = 10}) {
    // Filter out any blocked users
    final filteredUsers =
        _connectedUsers
            .where((user) => !MockBlockedUsers.isUserBlocked(user.user_id!))
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredUsers.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredUsers.length
            ? filteredUsers.length
            : startIndex + limit;

    return filteredUsers.sublist(startIndex, endIndex);
  }

  static ConnectedUser? getConnectedUser(String userId) {
    // Don't return blocked users
    if (MockBlockedUsers.isUserBlocked(userId)) {
      return null;
    }

    return _connectedUsers.firstWhere(
      (user) => user.user_id == userId,
      orElse:
          () => ConnectedUser(
            user_id: userId,
            first_name: 'Unknown',
            last_name: 'User',
            profile_image_id: 'assets/EmptyUser.png',
            bio: 'No information available',
            request_id: null,
            connectedAt: DateTime.now(),
          ),
    );
  }

  static List<ConnectedUser> getMutualConnections(
    String userIdA,
    String userIdB,
  ) {
    // For demo purposes, simply hardcode some connections
    if (MockBlockedUsers.isUserBlocked(userIdA) ||
        MockBlockedUsers.isUserBlocked(userIdB)) {
      return [];
    }

    return [
      ConnectedUser(
        user_id: '5',
        first_name: 'Charlie',
        last_name: 'Ronaldo',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Data Analyst at Amazon',
        connectedAt: DateTime.now().subtract(const Duration(days: 45)),
        request_id: '125',
      ),
      ConnectedUser(
        user_id: '6',
        first_name: 'David',
        last_name: 'Kim',
        profile_image_id: 'assets/logo.jpg',
        bio: 'iOS Developer at Apple',
        connectedAt: DateTime.now().subtract(const Duration(days: 50)),
        request_id: '126',
      ),
    ];
  }

  static void addConnection(ConnectedUser user) {
    if (user.user_id != null && MockBlockedUsers.isUserBlocked(user.user_id!)) {
      print('Cannot add connection - user is blocked');
      return;
    }

    // Remove any existing entry first to avoid duplicates
    removeConnection(user.user_id!);

    // Add the new connection
    _connectedUsers.add(user);
    print('Added connection: ${user.first_name} ${user.last_name}');
  }

  static void removeConnection(String userId) {
    _connectedUsers.removeWhere((user) => user.user_id == userId);
    print('Removed connection: $userId');
  }

  static bool isConnected(String userId) {
    return _connectedUsers.any((user) => user.user_id == userId) &&
        !MockBlockedUsers.isUserBlocked(userId);
  }
}

// Helper functions for easy access
List<ConnectedUser> getConnectedUsers({int page = 1, int limit = 10}) {
  return MockConnectedUsers.getConnectedUsers(page: page, limit: limit);
}

ConnectedUser? getConnectedUser(String userId) {
  return MockConnectedUsers.getConnectedUser(userId);
}

List<ConnectedUser> getMutualConnections(String userIdA, String userIdB) {
  return MockConnectedUsers.getMutualConnections(userIdA, userIdB);
}

void addConnection(ConnectedUser user) {
  MockConnectedUsers.addConnection(user);
}

void removeConnection(String userId) {
  MockConnectedUsers.removeConnection(userId);
}

bool isConnected(String userId) {
  return MockConnectedUsers.isConnected(userId);
}
