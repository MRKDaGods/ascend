enum NotificationType {
  welcome('welcome'),
  like('like'),
  comment('comment'),
  follow('follow'),
  mention('mention'),
  connection('connection');

  final String value;
  const NotificationType(this.value);

  factory NotificationType.fromString(String value) {
    return NotificationType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => NotificationType.welcome,
    );
  }

  String toJson() => value;
  static NotificationType fromJson(String json) =>
      NotificationType.fromString(json);
}

class Notification {
  final int id;
  final int userId;
  final NotificationType type;
  final String message;
  final dynamic payload;
  final bool isRead;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Notification({
    required this.id,
    required this.userId,
    required this.type,
    required this.message,
    this.payload,
    required this.isRead,
    this.createdAt,
    this.updatedAt,
  });

  String? get senderName {
    if (payload != null && payload['profile'] != null) {
      final profile = payload['profile'];
      if (profile['first_name'] != null && profile['last_name'] != null) {
        return '${profile['first_name']} ${profile['last_name']}';
      }
    }
    return null;
  }

  String? get senderAvatarUrl {
    if (payload != null && payload['profile'] != null) {
      final profile = payload['profile'];
      return profile['profile_picture_url'];
    }
    return null;
  }

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['id'],
      userId: json['user_id'],
      type: NotificationType.fromJson(json['type']),
      message: json['message'],
      payload: json['payload'],
      isRead: json['is_read'] ?? false,
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
      'type': type.toJson(),
      'message': message,
      'payload': payload,
      'is_read': isRead,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  Notification copyWith({
    int? id,
    int? userId,
    NotificationType? type,
    String? message,
    Map<String, dynamic>? payload,
    bool? isRead,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Notification(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      type: type ?? this.type,
      message: message ?? this.message,
      payload: payload ?? this.payload,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
