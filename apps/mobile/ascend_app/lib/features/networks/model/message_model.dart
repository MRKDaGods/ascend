class MessageRequestModel {
  String? message_id;
  String? receiverId;
  String? message;
  DateTime? timestamp;

  MessageRequestModel({
    required this.message_id,
    required this.receiverId,
    required this.message,
    required this.timestamp,
  });

  MessageRequestModel copyWith({
    String? message_id,
    String? receiverId,
    String? message,
    DateTime? timestamp,
  }) {
    return MessageRequestModel(
      message_id: message_id ?? this.message_id,
      receiverId: receiverId ?? this.receiverId,
      message: message ?? this.message,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  factory MessageRequestModel.fromJson(Map<String, dynamic> json) {
    return MessageRequestModel(
      message_id: json['message_id'],
      receiverId: json['receiverId'],
      message: json['message'],
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  Map<String, dynamic> toJson() => {
    "message_id": message_id,
    "receiverId": receiverId,
    "message": message,
    "timestamp": timestamp.toString(),
  };
}
