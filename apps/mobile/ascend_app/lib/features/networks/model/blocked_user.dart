class BlockedUser {
  final String userid;
  final String name;

  BlockedUser({required this.userid, required this.name});

  BlockedUser copyWith({String? userid, String? name}) {
    return BlockedUser(userid: userid ?? this.userid, name: name ?? this.name);
  }

  factory BlockedUser.fromJson(Map<String, dynamic> json) {
    return BlockedUser(userid: json['userid'], name: json['name']);
  }

  Map<String, dynamic> toJson() => {"userid": userid, "name": name};
}
