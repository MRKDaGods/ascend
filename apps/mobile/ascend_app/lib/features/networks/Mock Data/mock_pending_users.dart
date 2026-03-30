import 'package:ascend_app/features/networks/model/user_pending_model.dart';

class MockPendingUsers {
  static List<UserPendingModel> getPendingUsersSent({
    int page = 1,
    int limit = 10,
  }) {
    final allUsers = [
      UserPendingModel(
        id: '1',
        message: 'Hello, I would like to connect with you!',
        user_id: '1',
        first_name: 'John',
        last_name: 'Doe',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Software Engineer at Google',
        created_at: DateTime.now().subtract(const Duration(days: 30)),
      ),
      UserPendingModel(
        id: '2',
        message: 'Hi, let\'s connect!',
        user_id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Product Manager at Facebook',
        created_at: DateTime.now().subtract(const Duration(days: 25)),
      ),
      UserPendingModel(
        id: '3',
        message: 'Looking forward to connecting!',
        user_id: '3',
        first_name: 'Alice',
        last_name: 'Chen',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Frontend Developer at Google',
        created_at: DateTime.now().subtract(const Duration(days: 20)),
      ),
      UserPendingModel(
        id: '4',
        message: 'Excited to connect with you!',
        user_id: '4',
        first_name: 'Bob',
        last_name: 'Johnson',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'UI/UX Designer at Facebook',
        created_at: DateTime.now().subtract(const Duration(days: 15)),
      ),
      UserPendingModel(
        id: '5',
        message: 'Let\'s connect and collaborate!',
        user_id: '5',
        first_name: 'Charlie',
        last_name: 'Ronaldo',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Data Analyst at Amazon',
        created_at: DateTime.now().subtract(const Duration(days: 10)),
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
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Backend Developer at Microsoft',
        created_at: DateTime.now().subtract(const Duration(days: 5)),
      ),
      UserPendingModel(
        user_id: '7',
        first_name: 'Emma',
        last_name: 'Jones',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Data Scientist at Amazon',
        created_at: DateTime.now().subtract(const Duration(days: 3)),
      ),
      UserPendingModel(
        user_id: '8',
        first_name: 'Frank',
        last_name: 'Garcia',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'Network Engineer at Cisco',
        created_at: DateTime.now().subtract(const Duration(days: 2)),
      ),
      UserPendingModel(
        user_id: '9',
        first_name: 'Grace',
        last_name: 'Martinez',
        profile_picture_url: 'assets/logo.jpg',
        bio: 'DevOps Engineer at IBM',
        created_at: DateTime.now().subtract(const Duration(days: 1)),
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
