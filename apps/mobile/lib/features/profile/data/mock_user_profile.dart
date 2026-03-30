import '../models/user_profile_model.dart';

class MockUserProfile {
  // Get a single mock user profile
  static UserProfileModel getMockProfile() {
    return const UserProfileModel(
      name: 'Alex Johnson',
      position: 'Senior Software Engineer',
      location: 'Cairo, Egypt',
      companyName: 'Tech Innovations Ltd',
      companyLogoUrl: '',
      profileViewers: 347,
      postImpressions: 2840,
      isPremium: true,
      avatarUrl: '',
    );
  }
}
