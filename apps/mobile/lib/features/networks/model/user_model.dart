class UserModel {
  final String id;
  final String name;
  final String companyId;
  //final String industryId;
  final String profilePic;
  final String coverpic;
  final String bio;
  final bool firstFollow;
  final bool firstConnect;

  UserModel({
    required this.id,
    required this.name,
    required this.companyId,
    //required this.industryId,
    required this.profilePic,
    required this.coverpic,
    required this.bio,
    required this.firstFollow,
    required this.firstConnect,
  });

  UserModel copyWith({
    String? id,
    String? name,
    String? companyId,
    //String? industryId,
    String? profilePic,
    String? coverpic,
    String? bio,
    bool? firstFollow,
    bool? firstConnect,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      companyId: companyId ?? this.companyId,
      //industryId: industryId ?? this.industryId,
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
    companyId: json["company_id"],
    //industryId: json["industry_id"],
    profilePic: json["profilePictureUrl"],
    coverpic: json["coverpic"],
    bio: json["bio"],
    firstFollow: json["firstFollow"],
    firstConnect: json["firstConnect"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "name": name,
    "company_id": companyId,
    //"industry_id": industryId,
    "profilePictureUrl": profilePic,
    "coverpic": coverpic,
    "bio": bio,
    "firstFollow": firstFollow,
    "firstConnect": firstConnect,
  };
}
