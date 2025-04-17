enum PhoneType {
  home('home'),
  work('work'),
  mobile('mobile');

  final String value;
  const PhoneType(this.value);

  factory PhoneType.fromString(String value) {
    return PhoneType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => PhoneType.mobile,
    );
  }

  String toJson() => value;
  static PhoneType fromJson(String json) => PhoneType.fromString(json);
}

class Education {
  final int id;
  final int userId;
  final String school;
  final String degree;
  final String fieldOfStudy;
  final DateTime startDate;
  final String? endDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Education({
    required this.id,
    required this.userId,
    required this.school,
    required this.degree,
    required this.fieldOfStudy,
    required this.startDate,
    this.endDate,
    this.createdAt,
    this.updatedAt,
  });

  factory Education.fromJson(Map<String, dynamic> json) {
    return Education(
      id: json['id'],
      userId: json['user_id'],
      school: json['school'],
      degree: json['degree'],
      fieldOfStudy: json['field_of_study'],
      startDate: DateTime.parse(json['start_date']),
      endDate: json['end_date'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'school': school,
      'degree': degree,
      'field_of_study': fieldOfStudy,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Experience {
  final int id;
  final int userId;
  final String company;
  final String position;
  final DateTime startDate;
  final DateTime? endDate;
  final String? description;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Experience({
    required this.id,
    required this.userId,
    required this.company,
    required this.position,
    required this.startDate,
    this.endDate,
    this.description,
    this.createdAt,
    this.updatedAt,
  });

  factory Experience.fromJson(Map<String, dynamic> json) {
    return Experience(
      id: json['id'],
      userId: json['user_id'],
      company: json['company'],
      position: json['position'],
      startDate: DateTime.parse(json['start_date']),
      endDate:
          json['end_date'] != null ? DateTime.parse(json['end_date']) : null,
      description: json['description'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'company': company,
      'position': position,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate?.toIso8601String(),
      'description': description,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Project {
  final int id;
  final int userId;
  final String name;
  final String description;
  final DateTime startDate;
  final DateTime? endDate;
  final String? url;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Project({
    required this.id,
    required this.userId,
    required this.name,
    required this.description,
    required this.startDate,
    this.endDate,
    this.url,
    this.createdAt,
    this.updatedAt,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'],
      userId: json['user_id'],
      name: json['name'],
      description: json['description'],
      startDate: DateTime.parse(json['start_date']),
      endDate:
          json['end_date'] != null ? DateTime.parse(json['end_date']) : null,
      url: json['url'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'description': description,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate?.toIso8601String(),
      'url': url,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Course {
  final int id;
  final int userId;
  final String name;
  final String provider;
  final DateTime? completionDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Course({
    required this.id,
    required this.userId,
    required this.name,
    required this.provider,
    this.completionDate,
    this.createdAt,
    this.updatedAt,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      userId: json['user_id'],
      name: json['name'],
      provider: json['provider'],
      completionDate:
          json['completion_date'] != null
              ? DateTime.parse(json['completion_date'])
              : null,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'provider': provider,
      'completion_date': completionDate?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Skill {
  final int id;
  final String name;

  Skill({required this.id, required this.name});

  factory Skill.fromJson(Map<String, dynamic> json) {
    return Skill(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}

class Interest {
  final int id;
  final String name;

  Interest({required this.id, required this.name});

  factory Interest.fromJson(Map<String, dynamic> json) {
    return Interest(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}

class ContactInfo {
  final int userId;
  final String? profileUrl;
  final String email;
  final String? phone;
  final PhoneType? phoneType;
  final String? address;
  final DateTime? birthday;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ContactInfo({
    required this.userId,
    this.profileUrl,
    required this.email,
    this.phone,
    this.phoneType,
    this.address,
    this.birthday,
    this.createdAt,
    this.updatedAt,
  });

  factory ContactInfo.fromJson(Map<String, dynamic> json) {
    return ContactInfo(
      userId: json['user_id'],
      profileUrl: json['profile_url'],
      email: json['email'],
      phone: json['phone'],
      phoneType:
          json['phone_type'] != null
              ? PhoneType.fromJson(json['phone_type'])
              : null,
      address: json['address'],
      birthday:
          json['birthday'] != null ? DateTime.parse(json['birthday']) : null,
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'profile_url': profileUrl,
      'email': email,
      'phone': phone,
      'phone_type': phoneType?.value,
      'address': address,
      'birthday': birthday?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class Profile {
  final int userId;
  final String firstName;
  final String lastName;
  final String? resumeUrl;
  final int? resumeId;
  final String? coverPhotoUrl;
  final int? coverPhotoId;
  final String? profilePictureUrl;
  final int? profilePictureId;
  final String? industry;
  final String? location;
  final String? bio;
  final String? privacy;
  final bool? showSchool;
  final bool? showCurrentCompany;
  final String? website;
  final String? additionalName;
  final String? namePronunciation;
  final List<Skill>? skills;
  final List<Education>? education;
  final List<Experience>? experience;
  final List<Interest>? interests;
  final List<Project>? projects;
  final List<Course>? courses;
  final ContactInfo? contactInfo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Profile({
    required this.userId,
    required this.firstName,
    required this.lastName,
    this.resumeUrl,
    this.resumeId,
    this.coverPhotoUrl,
    this.coverPhotoId,
    this.profilePictureUrl,
    this.profilePictureId,
    this.industry,
    this.location,
    this.bio,
    this.privacy,
    this.showSchool,
    this.showCurrentCompany,
    this.website,
    this.additionalName,
    this.namePronunciation,
    this.skills,
    this.education,
    this.experience,
    this.interests,
    this.projects,
    this.courses,
    this.contactInfo,
    this.createdAt,
    this.updatedAt,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      userId: json['user_id'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      resumeUrl: json['resume_url'],
      resumeId: json['resume_id'],
      coverPhotoUrl: json['cover_photo_url'],
      coverPhotoId: json['cover_photo_id'],
      profilePictureUrl: json['profile_picture_url'],
      profilePictureId: json['profile_picture_id'],
      industry: json['industry'],
      location: json['location'],
      bio: json['bio'],
      privacy: json['privacy'],
      showSchool: json['show_school'],
      showCurrentCompany: json['show_current_company'],
      website: json['website'],
      additionalName: json['additional_name'],
      namePronunciation: json['name_pronunciation'],
      skills:
          json['skills'] != null
              ? List<Skill>.from(json['skills'].map((x) => Skill.fromJson(x)))
              : null,
      education:
          json['education'] != null
              ? List<Education>.from(
                json['education'].map((x) => Education.fromJson(x)),
              )
              : null,
      experience:
          json['experience'] != null
              ? List<Experience>.from(
                json['experience'].map((x) => Experience.fromJson(x)),
              )
              : null,
      interests:
          json['interests'] != null
              ? List<Interest>.from(
                json['interests'].map((x) => Interest.fromJson(x)),
              )
              : null,
      projects:
          json['projects'] != null
              ? List<Project>.from(
                json['projects'].map((x) => Project.fromJson(x)),
              )
              : null,
      courses:
          json['courses'] != null
              ? List<Course>.from(
                json['courses'].map((x) => Course.fromJson(x)),
              )
              : null,
      contactInfo:
          json['contact_info'] != null
              ? ContactInfo.fromJson(json['contact_info'])
              : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'first_name': firstName,
      'last_name': lastName,
      'resume_url': resumeUrl,
      'resume_id': resumeId,
      'cover_photo_url': coverPhotoUrl,
      'cover_photo_id': coverPhotoId,
      'profile_picture_url': profilePictureUrl,
      'profile_picture_id': profilePictureId,
      'industry': industry,
      'location': location,
      'bio': bio,
      'privacy': privacy,
      'show_school': showSchool,
      'show_current_company': showCurrentCompany,
      'website': website,
      'additional_name': additionalName,
      'name_pronunciation': namePronunciation,
      'skills': skills?.map((x) => x.toJson()).toList(),
      'education': education?.map((x) => x.toJson()).toList(),
      'experience': experience?.map((x) => x.toJson()).toList(),
      'interests': interests?.map((x) => x.toJson()).toList(),
      'projects': projects?.map((x) => x.toJson()).toList(),
      'courses': courses?.map((x) => x.toJson()).toList(),
      'contact_info': contactInfo?.toJson(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}
