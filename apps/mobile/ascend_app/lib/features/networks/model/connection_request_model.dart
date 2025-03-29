class ConnectionRequestModel {
  final String requestId;
  final String senderId;
  final String receiverId;
  String status; // pending, accepted, rejected
  final String timestamp;

  ConnectionRequestModel({
    required this.requestId,
    required this.senderId,
    required this.receiverId,
    required this.status,
    required this.timestamp,
  });

  ConnectionRequestModel copyWith({
    String? requestId,
    String? senderId,
    String? receiverId,
    String? status,
    String? timestamp,
  }) {
    return ConnectionRequestModel(
      requestId: requestId ?? this.requestId,
      senderId: senderId ?? this.senderId,
      receiverId: receiverId ?? this.receiverId,
      status: status ?? this.status,
      timestamp: timestamp ?? this.timestamp,
    );
  }

  factory ConnectionRequestModel.fromJson(Map<String, dynamic> json) =>
      ConnectionRequestModel(
        requestId: json["requestId"],
        senderId: json["senderId"],
        receiverId: json["receiverId"],
        status: json["status"],
        timestamp: json["timestamp"],
      );

  Map<String, dynamic> toJson() => {
    "requestId": requestId,
    "senderId": senderId,
    "receiverId": receiverId,
    "status": status,
    "timestamp": timestamp,
  };
}
