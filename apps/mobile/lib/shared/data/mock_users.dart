import 'package:ascend_app/features/profile/models/user_profile_model.dart';

/// Represents the source of users for tagging suggestions.
/// In a real app, this would fetch from an API.
class MockUserData {
  // Simulate fetching all users available for tagging.
  static Future<List<UserProfileModel>> getAllUsers() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 100));
    return _allMockUsers;
  }

  // Simulate searching users based on a query.
  static Future<List<UserProfileModel>> searchUsers(String query) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 50));

    if (query.isEmpty) {
      // Return a subset if the query is empty (e.g., recent or popular users)
      return _allMockUsers.take(10).toList();
    } else {
      // Filter based on the query
      final lowerCaseQuery = query.toLowerCase();
      return _allMockUsers
          .where((user) => user.name.toLowerCase().contains(lowerCaseQuery))
          .toList();
    }
  }

  // The actual mock data list (private)
  static final List<UserProfileModel> _allMockUsers = [
    UserProfileModel(id: '1', name: 'Rafat Sarosh', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'AI for Enterprise'),
    UserProfileModel(id: '2', name: 'Abdallah Khalil', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Ex-Software Testing Engineer'),
    UserProfileModel(id: '3', name: 'Ali Mamdouh', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Head of Embedded Team'),
    UserProfileModel(id: '4', name: 'Alan Levy', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Virtual Mentorship Leader'),
    UserProfileModel(id: '5', name: 'Ahmed Sarhan', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'IT Helpdesk Specialist'),
    UserProfileModel(id: '6', name: 'Ahmed 2bany', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Interior Designer'),
    UserProfileModel(id: '7', name: 'Abdelrahman Amin', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Software Engineer'),
    UserProfileModel(id: '8', name: 'Sarah Chen', avatarUrl: 'assets/images/profile/pic3.jpg', position: 'UX Designer'),
    UserProfileModel(id: '9', name: 'Marcus Johnson', avatarUrl: 'assets/images/profile/image4.jpg', position: 'Software Engineer'),
    UserProfileModel(id: '10', name: 'Alex Rivera', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Product Designer'),
    UserProfileModel(id: '11', name: 'Jamie Wilson', avatarUrl: 'assets/images/profile/pic2.jpg', position: 'Digital Nomad'),
    UserProfileModel(id: '12', name: 'Priya Sharma', avatarUrl: 'assets/images/profile/pexels-karymefranca-1535907.jpg', position: 'UI Designer'),
    UserProfileModel(id: '13', name: 'David Miller', avatarUrl: 'assets/images/profile/EmptyUser.png', position: 'Team Lead'),
    UserProfileModel(id: '14', name: 'Emily Zhang', avatarUrl: 'assets/images/profile/pic2.jpg', position: 'Product Designer'),
    UserProfileModel(id: '15', name: 'Michael Brown', avatarUrl: 'assets/images/profile/image4.jpg', position: 'UX Researcher'),
    // Add more mock users as needed
  ];
}
