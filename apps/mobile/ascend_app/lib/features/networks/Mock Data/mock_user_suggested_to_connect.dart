import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_connected_users.dart';

class MockUserSuggestedtoConnect {
  static List<UserSuggestedtoConnect> getSuggestedConnections({
    int page = 1,
    int limit = 10,
  }) {
    final allSuggestions = [
      UserSuggestedtoConnect(
        user_id: '14',
        first_name: 'Liam',
        last_name: 'Anderson',
        profile_image_id: 'assets/facebook.png',
        bio: 'Financial Analyst at Apple',
        MutualUsers: getMutualUsers('14'),
      ),
      UserSuggestedtoConnect(
        user_id: '15',
        first_name: 'Mia',
        last_name: 'Thomas',
        profile_image_id: 'assets/facebook.png',
        bio: 'Product Manager at Microsoft',
        MutualUsers: getMutualUsers('15'),
        connectionsCount: 100,
      ),
      UserSuggestedtoConnect(
        user_id: '16',
        first_name: 'Nathan',
        last_name: 'Taylor',
        profile_image_id: 'assets/facebook.png',
        bio: 'Data Scientist at Netflix',
        MutualUsers: getMutualUsers('16'),
        connectionsCount: 40,
      ),
      UserSuggestedtoConnect(
        user_id: '17',
        first_name: 'Olivia',
        last_name: 'Brown',
        profile_image_id: 'assets/facebook.png',
        bio: 'Electrical Engineer at Tesla',
        MutualUsers: getMutualUsers('17'),
        connectionsCount: 20,
      ),
      UserSuggestedtoConnect(
        user_id: '18',
        first_name: 'Peter',
        last_name: 'Clark',
        profile_image_id: 'assets/facebook.png',
        bio: 'Product Marketing Manager at Google',
        MutualUsers: getMutualUsers('18'),
        connectionsCount: 10,
      ),
      UserSuggestedtoConnect(
        user_id: '19',
        first_name: 'Quinn',
        last_name: 'Lewis',
        profile_image_id: 'assets/facebook.png',
        bio: 'Security Engineer at Facebook',
        MutualUsers: getMutualUsers('18'),
        connectionsCount: 55,
      ),
    ];

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= allSuggestions.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > allSuggestions.length
            ? allSuggestions.length
            : startIndex + limit;

    return allSuggestions.sublist(startIndex, endIndex);
  }

  // Helper to generate mutual users
  static List<ConnectedUser> getMutualUsers(String userId) {
    // Generate 0-3 mutual users based on user ID
    int mutualCount = int.parse(userId) % 4; // 0, 1, 2, or 3 mutual connections

    if (mutualCount == 0) return [];

    // Get some connected users
    final allConnected = MockConnectedUsers.getConnectedUsers(limit: 100);
    return allConnected.take(mutualCount).toList();
  }

  static UserSuggestedtoConnect getSuggestedUserById(String userId) {
    return getSuggestedConnections(limit: 100).firstWhere(
      (user) => user.user_id == userId,
      orElse:
          () => UserSuggestedtoConnect(
            user_id: userId,
            first_name: 'Unknown',
            last_name: 'User',
            profile_image_id: 'assets/EmptyUser.png',
            bio: 'No information available',
            MutualUsers: [],
            connectionsCount: 0,
          ),
    );
  }
}

// Helper functions for easy access
List<UserSuggestedtoConnect> getSuggestedConnections({
  int page = 1,
  int limit = 10,
}) {
  return MockUserSuggestedtoConnect.getSuggestedConnections(
    page: page,
    limit: limit,
  );
}

UserSuggestedtoConnect getSuggestedUserById(String userId) {
  return MockUserSuggestedtoConnect.getSuggestedUserById(userId);
}
