class MessageModel {
  final String messageId;
  final String? conversationId;
  final String content;
  final String? fileUrl;
  final String? fileType;
  final DateTime sentAt;
  final bool isRead;
  final DateTime? readAt;
  final String senderId;

  MessageModel({
    required this.messageId,
    required this.content,
    this.conversationId,
    this.fileUrl,
    this.fileType,
    required this.sentAt,
    this.isRead = false,
    this.readAt,
    required this.senderId,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      messageId: json['messageId'].toString(),
      content: json['content'] ?? '',
      fileUrl: json['fileUrl'],
      fileType: json['fileType'],
      sentAt:
          json['sentAt'] != null
              ? DateTime.parse(json['sentAt'])
              : DateTime.now(),
      isRead: json['isRead'] ?? false,
      readAt: json['readAt'] != null ? DateTime.parse(json['readAt']) : null,
      senderId: json['senderId']?.toString() ?? '',
    );
  }

  factory MessageModel.fromApiResponse(Map<String, dynamic> json) {
    return MessageModel(
      messageId: json['messageId'].toString(),
      content: json['content'] ?? '',
      fileUrl: json['fileUrl'],
      fileType: json['fileType'],
      sentAt:
          json['sentAt'] != null
              ? DateTime.parse(json['sentAt'])
              : DateTime.now(),
      isRead: false,
      senderId: '', // To be filled from context
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageId': messageId,
      'content': content,
      'fileUrl': fileUrl,
      'fileType': fileType,
      'sentAt': sentAt.toIso8601String(),
      'isRead': isRead,
      'readAt': readAt?.toIso8601String(),
      'senderId': senderId,
    };
  }

  MessageModel empty() {
    return MessageModel(
      messageId: '',
      content: '',
      sentAt: DateTime.now(),
      senderId: '',
      isRead: false,
      readAt: null,
      fileUrl: null,
      fileType: null,
    );
  }

  MessageModel copyWith({
    String? messageId,
    String? conversationId,
    String? content,
    String? fileUrl,
    String? fileType,
    DateTime? sentAt,
    bool? isSent,
    bool? isRead,
    DateTime? readAt,
    String? senderId,
  }) {
    return MessageModel(
      messageId: messageId ?? this.messageId,
      content: content ?? this.content,
      fileUrl: fileUrl ?? this.fileUrl,
      fileType: fileType ?? this.fileType,
      sentAt: sentAt ?? this.sentAt,
      isRead: isRead ?? this.isRead,
      readAt: readAt ?? this.readAt,
      senderId: senderId ?? this.senderId,
    );
  }
}
