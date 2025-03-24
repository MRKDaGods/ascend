class UserModel {
  final String id;
  final String name;
  final String company;
  final String industry;
  final String profilePic;
  final String coverpic;
  final String bio;
  final bool firstFollow;
  final bool firstConnect;

  UserModel({
    required this.id,
    required this.name,
    required this.company,
    required this.industry,
    required this.profilePic,
    required this.coverpic,
    required this.bio,
    required this.firstFollow,
    required this.firstConnect,
  });

  UserModel copyWith({
    String? id,
    String? name,
    String? company,
    String? industry,
    String? profilePic,
    String? coverpic,
    String? bio,
    bool? firstFollow,
    bool? firstConnect,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      company: company ?? this.company,
      industry: industry ?? this.industry,
      profilePic: profilePic ?? this.profilePic,
      coverpic: coverpic ?? this.coverpic,
      bio: bio ?? this.bio,
      firstFollow: firstFollow ?? this.firstFollow,
      firstConnect: firstConnect ?? this.firstConnect,
    );
  }

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json["id"],
    name: json["name"],
    company: json["company"],
    industry: json["industry"],
    profilePic: json["profilePictureUrl"],
    coverpic: json["coverpic"],
    bio: json["bio"],
    firstFollow: json["firstFollow"],
    firstConnect: json["firstConnect"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "name": name,
    "company": company,
    "industry": industry,
    "profilePictureUrl": profilePic,
    "coverpic": coverpic,
    "bio": bio,
  };
}
