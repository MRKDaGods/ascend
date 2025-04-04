class UserProfileModel {
  final String id; // Add this field
  final String name;
  final String position;
  final String location;
  final String companyName;
  final String companyLogoUrl;
  final int profileViewers;
  final int postImpressions;
  final bool isPremium;
  final String avatarUrl;
  
  const UserProfileModel({
    this.id = 'default_user_id', // Add default value
    this.name = 'User Name',
    this.position = 'Position or Bio',
    this.location = 'Location',
    this.companyName = 'Company Name',
    this.companyLogoUrl = '',
    this.profileViewers = 0,
    this.postImpressions = 0,
    this.isPremium = false,
    this.avatarUrl = '',
  });
  
  // Factory constructor to create a UserProfileModel from JSON data
  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      id: json['id'] as String? ?? 'default_user_id', // Add this field
      name: json['name'] as String? ?? 'User Name',
      position: json['position'] as String? ?? 'Position or Bio',
      location: json['location'] as String? ?? 'Location',
      companyName: json['company_name'] as String? ?? 'Company Name',
      companyLogoUrl: json['company_logo_url'] as String? ?? '',
      profileViewers: json['profile_viewers'] as int? ?? 0,
      postImpressions: json['post_impressions'] as int? ?? 0,
      isPremium: json['is_premium'] as bool? ?? false,
      avatarUrl: json['avatar_url'] as String? ?? '',
    );
  }
  
  // Method to convert UserProfileModel to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id, // Add this field
      'name': name,
      'position': position,
      'location': location,
      'company_name': companyName,
      'company_logo_url': companyLogoUrl,
      'profile_viewers': profileViewers,
      'post_impressions': postImpressions,
      'is_premium': isPremium,
      'avatar_url': avatarUrl,
    };
  }
  
  // A method to create an empty profile
  factory UserProfileModel.empty() {
    return const UserProfileModel();
  }
  
  // A method to create a copy of this profile with some values updated
  UserProfileModel copyWith({
    String? id, // Add this field
    String? name,
    String? position,
    String? location,
    String? companyName,
    String? companyLogoUrl,
    int? profileViewers,
    int? postImpressions,
    bool? isPremium,
    String? avatarUrl,
  }) {
    return UserProfileModel(
      id: id ?? this.id, // Add this field
      name: name ?? this.name,
      position: position ?? this.position,
      location: location ?? this.location,
      companyName: companyName ?? this.companyName,
      companyLogoUrl: companyLogoUrl ?? this.companyLogoUrl,
      profileViewers: profileViewers ?? this.profileViewers,
      postImpressions: postImpressions ?? this.postImpressions,
      isPremium: isPremium ?? this.isPremium,
      avatarUrl: avatarUrl ?? this.avatarUrl,
    );
  }
}