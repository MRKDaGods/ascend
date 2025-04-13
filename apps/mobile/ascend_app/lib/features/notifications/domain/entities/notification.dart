/// Represents a notification entity in the domain layer.
///
/// This class defines the core properties of a notification in the application,
/// independent of how it's stored or retrieved.
class Notification {
  /// Unique identifier for the notification
  final String id;
  
  /// Title of the notification
  final String title;
  
  /// Main content of the notification
  final String message;
  
  /// When the notification was created
  final DateTime createdAt;
  
  /// Whether the notification has been read by the user
  final bool isRead;
  
  /// Type of notification (e.g., 'comment', 'like', 'follow', 'system')
  final String type;
  
  /// ID of the related content (post, comment, etc.) if applicable
  final String? relatedItemId;
  
  /// Avatar URL of the sender (if the notification is from another user)
  final String? senderAvatarUrl;
  
  /// Name of the sender (if the notification is from another user)
  final String? senderName;
  
  /// Optional data associated with the notification
  final Map<String, dynamic>? data;

  const Notification({
    required this.id,
    required this.title,
    required this.message,
    required this.createdAt,
    required this.isRead,
    required this.type,
    this.relatedItemId,
    this.senderAvatarUrl,
    this.senderName,
    this.data,
  });
  
  /// Create a copy of this notification with some fields replaced
  Notification copyWith({
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
    return Notification(
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