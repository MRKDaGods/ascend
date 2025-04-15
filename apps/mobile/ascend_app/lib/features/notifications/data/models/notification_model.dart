import '../../domain/entities/notification.dart';

/// Data model for Notification with JSON serialization/deserialization capabilities.
///
/// This extends the domain Notification entity to add data layer functionality
/// like converting to/from JSON.
class NotificationModel extends Notification {
  const NotificationModel({
    required super.id,
    required super.title,
    required super.message,
    required super.createdAt,
    required super.isRead,
    required super.type,
    super.relatedItemId,
    super.senderAvatarUrl,
    super.senderName,
    super.data,
  });

  /// Creates a NotificationModel from a JSON map
  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] as String,
      title: json['title'] as String,
      message: json['message'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      isRead: json['isRead'] as bool? ?? false,
      type: json['type'] as String,
      relatedItemId: json['relatedItemId'] as String?,
      senderAvatarUrl: json['senderAvatarUrl'] as String?,
      senderName: json['senderName'] as String?,
      data: json['data'] as Map<String, dynamic>?,
    );
  }

  /// Creates a NotificationModel from a Firebase Cloud Messaging RemoteMessage
  factory NotificationModel.fromFCM(Map<String, dynamic> message) {
    final notification = message['notification'] as Map<String, dynamic>?;
    final data = message['data'] as Map<String, dynamic>?;
    
    return NotificationModel(
      id: data?['id'] as String? ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: notification?['title'] as String? ?? 'New Notification',
      message: notification?['body'] as String? ?? '',
      createdAt: DateTime.now(),
      isRead: false,
      type: data?['type'] as String? ?? 'system',
      relatedItemId: data?['relatedItemId'] as String?,
      senderAvatarUrl: data?['senderAvatarUrl'] as String?,
      senderName: data?['senderName'] as String?,
      data: data,
    );
  }

  /// Converts this NotificationModel to a JSON map
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'createdAt': createdAt.toIso8601String(),
      'isRead': isRead,
      'type': type,
      'relatedItemId': relatedItemId,
      'senderAvatarUrl': senderAvatarUrl,
      'senderName': senderName,
      'data': data,
    };
  }

  /// Creates a copy of this NotificationModel with some fields replaced
  @override
  NotificationModel copyWith({
    String? id,
    String? title,
    String? message,
    DateTime? createdAt,
    bool? isRead,
    String? type,
    String? relatedItemId,
    String? senderAvatarUrl,
    String? senderName,
    Map<String, dynamic>? data,
  }) {
    return NotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
      type: type ?? this.type,
      relatedItemId: relatedItemId ?? this.relatedItemId,
      senderAvatarUrl: senderAvatarUrl ?? this.senderAvatarUrl,
      senderName: senderName ?? this.senderName,
      data: data ?? this.data,
    );
  }
}