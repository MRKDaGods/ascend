import 'package:ascend_app/features/networks/Mock Data/mock_connected_users.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_follow.dart';

class MockSuggestedToFollow {
  static List<UserSuggestedtoFollow> getSuggestedToFollow({
    int page = 1,
    int limit = 10,
  }) {
    final allSuggestions = [
      UserSuggestedtoFollow(
        user_id: '1',
        first_name: 'Mohamed',
        last_name: 'Ali',
        profile_image_id: 'assets/facebook.png',
        bio: 'This is a bio for Mohamed Ali.',
        MutualUsers: getMutualUsers('1'),
        followsCount: 5,
      ),
      UserSuggestedtoFollow(
        user_id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_image_id: 'assets/facebook.png',
        bio: 'This is a bio for Jane Smith.',
        MutualUsers: [],
        followsCount: 10,
      ),
      UserSuggestedtoFollow(
        user_id: '3',
        first_name: 'John',
        last_name: 'Doe',
        profile_image_id: 'assets/facebook.png',
        bio: 'This is a bio for John Doe.',
        MutualUsers: [],
        followsCount: 80,
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
    final allConnected = MockConnectedUsers.getConnectedUsers(limit: 5);
    return allConnected.take(mutualCount).toList();
  }

  static UserSuggestedtoFollow getSuggestedUserById(String userId) {
    return getSuggestedToFollow(limit: 100).firstWhere(
      (user) => user.user_id == userId,
      orElse:
          () => UserSuggestedtoFollow(
            user_id: userId,
            first_name: 'Unknown',
            last_name: 'User',
            profile_image_id: 'assets/EmptyUser.png',
            bio: 'No information available',
            MutualUsers: [],
            followsCount: 0,
          ),
    );
  }
}
