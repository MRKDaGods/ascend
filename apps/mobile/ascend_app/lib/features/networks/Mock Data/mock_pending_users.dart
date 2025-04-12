import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';

class MockPendingUsers {
  static List<UserPendingModel> getPendingUsersSent({
    int page = 1,
    int limit = 10,
  }) {
    final allUsers = [
      UserPendingModel(
        user_id: '1',
        first_name: 'John',
        last_name: 'Doe',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Software Engineer at Google',
        requestedAt: DateTime.now().subtract(const Duration(days: 30)),
      ),
      UserPendingModel(
        user_id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Product Manager at Facebook',
        requestedAt: DateTime.now().subtract(const Duration(days: 25)),
      ),
      UserPendingModel(
        user_id: '3',
        first_name: 'Alice',
        last_name: 'Chen',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Frontend Developer at Google',
        requestedAt: DateTime.now().subtract(const Duration(days: 20)),
      ),
      UserPendingModel(
        user_id: '4',
        first_name: 'Bob',
        last_name: 'Johnson',
        profile_image_id: 'assets/logo.jpg',
        bio: 'UI/UX Designer at Facebook',
        requestedAt: DateTime.now().subtract(const Duration(days: 15)),
      ),
      UserPendingModel(
        user_id: '5',
        first_name: 'Charlie',
        last_name: 'Ronaldo',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Data Analyst at Amazon',
        requestedAt: DateTime.now().subtract(const Duration(days: 10)),
      ),
    ];

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= allUsers.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > allUsers.length
            ? allUsers.length
            : startIndex + limit;

    return allUsers.sublist(startIndex, endIndex);
  }

  static List<UserPendingModel> getPendingUsersReceived({
    int page = 1,
    int limit = 10,
  }) {
    final allUsers = [
      UserPendingModel(
        user_id: '6',
        first_name: 'David',
        last_name: 'Williams',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Backend Developer at Microsoft',
        requestedAt: DateTime.now().subtract(const Duration(days: 5)),
      ),
      UserPendingModel(
        user_id: '7',
        first_name: 'Emma',
        last_name: 'Jones',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Data Scientist at Amazon',
        requestedAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
      UserPendingModel(
        user_id: '8',
        first_name: 'Frank',
        last_name: 'Garcia',
        profile_image_id: 'assets/logo.jpg',
        bio: 'Network Engineer at Cisco',
        requestedAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      UserPendingModel(
        user_id: '9',
        first_name: 'Grace',
        last_name: 'Martinez',
        profile_image_id: 'assets/logo.jpg',
        bio: 'DevOps Engineer at IBM',
        requestedAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= allUsers.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > allUsers.length
            ? allUsers.length
            : startIndex + limit;

    return allUsers.sublist(startIndex, endIndex);
  }
}
