import '../models/user_profile_model.dart';

class MockUserProfile {
  // Get a single mock user profile
  static UserProfileModel getMockProfile() {
    return const UserProfileModel(
      name: 'Alex Johnson',
      position: 'Senior Software Engineer',
      location: 'Cairo, Egypt',
      companyName: 'Tech Innovations Ltd',
      companyLogoUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=TI',
      profileViewers: 347,
      postImpressions: 2840,
      isPremium: true,
      avatarUrl: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=AJ',
    );
  }
}