class ConversationModel {
  final String conversationId;
  final String userId;
  final String otherUserName;
  final String? otherUserProfileImageUrl;
  final bool isBlocked;
  final String latestMessage;
  final DateTime latestTimestamp;
  final int unseenCount;

  ConversationModel({
    required this.conversationId,
    required this.userId,
    required this.otherUserName,
    required this.otherUserProfileImageUrl,
    required this.isBlocked,
    required this.latestMessage,
    required this.latestTimestamp,
    required this.unseenCount,
  });

  factory ConversationModel.fromJson(Map<String, dynamic> json) {
    return ConversationModel(
      // Handle potential null values with null-aware operators
      conversationId: json['conversationId']?.toString() ?? '',
      userId: json['otherUserId']?.toString() ?? '',
      otherUserName: json['otherUserFullName'] as String? ?? '',
      otherUserProfileImageUrl:
          json['otherUserProfilePictureUrl'] as String? ?? '',
      isBlocked: json['isBlocked'] as bool? ?? false,
      latestMessage: json['lastMessageContent'] as String? ?? '',
      latestTimestamp:
          json['lastMessageTimestamp'] != null
              ? DateTime.parse(json['lastMessageTimestamp'] as String)
              : DateTime.now(),
      unseenCount: json['unseenMessageCount'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'conversationId': conversationId,
      'otherUserId': userId,
      'otherUserFullName': otherUserName,
      'otherUserProfilePictureUrl': otherUserProfileImageUrl,
      'isBlocked': isBlocked,
      'lastMessageContent': latestMessage,
      'lastMessageTimestamp': latestTimestamp.toIso8601String(),
      'unseenMessageCount': unseenCount,
    };
  }

  ConversationModel copyWith({
    String? conversationId,
    String? userId,
    String? otherUserName,
    String? otherUserProfileImageUrl,
    bool? isBlocked,
    String? latestMessage,
    DateTime? latestTimestamp,
    int? unseenCount,
  }) {
    return ConversationModel(
      conversationId: conversationId ?? this.conversationId,
      userId: userId ?? this.userId,
      otherUserName: otherUserName ?? this.otherUserName,
      otherUserProfileImageUrl:
          otherUserProfileImageUrl ?? this.otherUserProfileImageUrl,
      isBlocked: isBlocked ?? this.isBlocked,
      latestMessage: latestMessage ?? this.latestMessage,
      latestTimestamp: latestTimestamp ?? this.latestTimestamp,
      unseenCount: unseenCount ?? this.unseenCount,
    );
  }
}
