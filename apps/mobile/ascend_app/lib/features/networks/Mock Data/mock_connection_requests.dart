import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Mock Data/mock_blocked_users.dart';

class MockConnectionRequests {
  // In-memory storage of connection requests
  static final List<ConnectionRequestModel> _requests = [
    ConnectionRequestModel(
      requestId: '1',
      senderId: 'current_user_id',
      receiverId: '2',
      timestamp: DateTime.now().subtract(const Duration(days: 5)),
      status: 'pending',
    ),
    ConnectionRequestModel(
      requestId: '2',
      senderId: '3',
      receiverId: 'current_user_id',
      timestamp: DateTime.now().subtract(const Duration(days: 4)),
      status: 'pending',
    ),
    ConnectionRequestModel(
      requestId: '3',
      senderId: 'current_user_id',
      receiverId: '4',
      timestamp: DateTime.now().subtract(const Duration(days: 10)),
      status: 'accepted',
    ),
    // Add more requests as needed
  ];

  // Get all connection requests with pagination
  static List<ConnectionRequestModel> getAllRequests({
    int page = 1,
    int limit = 10,
    String? status,
  }) {
    // Filter by status and exclude blocked users
    var filteredRequests =
        _requests
            .where(
              (req) =>
                  (status == null || req.status == status) &&
                  !MockBlockedUsers.isUserBlocked(req.senderId) &&
                  !MockBlockedUsers.isUserBlocked(req.receiverId),
            )
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredRequests.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredRequests.length
            ? filteredRequests.length
            : startIndex + limit;

    return filteredRequests.sublist(startIndex, endIndex);
  }

  // Get connection requests sent by a user
  static List<ConnectionRequestModel> getRequestsBySender(
    String senderId, {
    int page = 1,
    int limit = 10,
    String? status,
  }) {
    // Filter by sender and status, exclude blocked users
    var filteredRequests =
        _requests
            .where(
              (req) =>
                  req.senderId == senderId &&
                  (status == null || req.status == status) &&
                  !MockBlockedUsers.isUserBlocked(req.receiverId),
            )
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredRequests.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredRequests.length
            ? filteredRequests.length
            : startIndex + limit;

    return filteredRequests.sublist(startIndex, endIndex);
  }

  // Get connection requests received by a user
  static List<ConnectionRequestModel> getRequestsByReceiver(
    String receiverId, {
    int page = 1,
    int limit = 10,
    String? status,
  }) {
    // Filter by receiver and status, exclude blocked users
    var filteredRequests =
        _requests
            .where(
              (req) =>
                  req.receiverId == receiverId &&
                  (status == null || req.status == status) &&
                  !MockBlockedUsers.isUserBlocked(req.senderId),
            )
            .toList();

    // Apply pagination
    final startIndex = (page - 1) * limit;
    if (startIndex >= filteredRequests.length) {
      return [];
    }

    final endIndex =
        startIndex + limit > filteredRequests.length
            ? filteredRequests.length
            : startIndex + limit;

    return filteredRequests.sublist(startIndex, endIndex);
  }

  // Add a new connection request
  static void addRequest(ConnectionRequestModel request) {
    // Don't add if either user is blocked
    if (MockBlockedUsers.isUserBlocked(request.senderId) ||
        MockBlockedUsers.isUserBlocked(request.receiverId)) {
      print('Cannot create connection request - user is blocked');
      return;
    }

    // Check for existing requests between these users
    final existingIndex = _requests.indexWhere(
      (req) =>
          (req.senderId == request.senderId &&
              req.receiverId == request.receiverId) ||
          (req.senderId == request.receiverId &&
              req.receiverId == request.senderId),
    );

    if (existingIndex != -1) {
      // Update existing request instead of adding new one
      _requests[existingIndex] = request;
    } else {
      _requests.add(request);
    }
  }

  // Accept a connection request
  static bool acceptRequest(String requestId) {
    final index = _requests.indexWhere((req) => req.requestId == requestId);
    if (index != -1) {
      final request = _requests[index];

      // Don't accept if either user is blocked
      if (MockBlockedUsers.isUserBlocked(request.senderId) ||
          MockBlockedUsers.isUserBlocked(request.receiverId)) {
        print('Cannot accept connection request - user is blocked');
        return false;
      }

      _requests[index] = ConnectionRequestModel(
        requestId: request.requestId,
        senderId: request.senderId,
        receiverId: request.receiverId,
        timestamp: request.timestamp,
        status: 'accepted',
      );
      return true;
    }
    return false;
  }

  // Decline a connection request
  static bool declineRequest(String requestId) {
    final index = _requests.indexWhere((req) => req.requestId == requestId);
    if (index != -1) {
      final request = _requests[index];
      _requests[index] = ConnectionRequestModel(
        requestId: request.requestId,
        senderId: request.senderId,
        receiverId: request.receiverId,
        timestamp: request.timestamp,
        status: 'declined',
      );
      return true;
    }
    return false;
  }

  // Cancel/delete a connection request
  static bool deleteRequest(String requestId) {
    final initialLength = _requests.length;
    _requests.removeWhere((req) => req.requestId == requestId);
    return _requests.length < initialLength;
  }

  // Cancel all requests between two users (used when blocking)
  static void cancelAllRequestsBetweenUsers(String userIdA, String userIdB) {
    _requests.removeWhere(
      (req) =>
          (req.senderId == userIdA && req.receiverId == userIdB) ||
          (req.senderId == userIdB && req.receiverId == userIdA),
    );
  }

  // Check if a connection request exists between two users
  static bool hasConnectionRequest(String userIdA, String userIdB) {
    return _requests.any(
      (req) =>
          ((req.senderId == userIdA && req.receiverId == userIdB) ||
              (req.senderId == userIdB && req.receiverId == userIdA)) &&
          req.status == 'pending',
    );
  }

  // Get connection status between two users
  static String getConnectionStatus(String userIdA, String userIdB) {
    // If either user is blocked, return 'blocked'
    if (MockBlockedUsers.isUserBlocked(userIdA) ||
        MockBlockedUsers.isUserBlocked(userIdB)) {
      return 'blocked';
    }

    final request = _requests.firstWhere(
      (req) =>
          (req.senderId == userIdA && req.receiverId == userIdB) ||
          (req.senderId == userIdB && req.receiverId == userIdA),
      orElse:
          () => ConnectionRequestModel(
            requestId: '',
            senderId: '',
            receiverId: '',
            timestamp: DateTime.now(),
            status: 'none',
          ),
    );

    return request.status;
  }
}

// Helper functions for easy access
List<ConnectionRequestModel> getAllConnectionRequests({
  int page = 1,
  int limit = 10,
  String? status,
}) {
  return MockConnectionRequests.getAllRequests(
    page: page,
    limit: limit,
    status: status,
  );
}

List<ConnectionRequestModel> getConnectionRequestsBySender(
  String senderId, {
  int page = 1,
  int limit = 10,
  String? status,
}) {
  return MockConnectionRequests.getRequestsBySender(
    senderId,
    page: page,
    limit: limit,
    status: status,
  );
}

List<ConnectionRequestModel> getConnectionRequestsByReceiver(
  String receiverId, {
  int page = 1,
  int limit = 10,
  String? status,
}) {
  return MockConnectionRequests.getRequestsByReceiver(
    receiverId,
    page: page,
    limit: limit,
    status: status,
  );
}

void addConnectionRequest(ConnectionRequestModel request) {
  MockConnectionRequests.addRequest(request);
}

bool acceptConnectionRequest(String requestId) {
  return MockConnectionRequests.acceptRequest(requestId);
}

bool declineConnectionRequest(String requestId) {
  return MockConnectionRequests.declineRequest(requestId);
}

bool deleteConnectionRequest(String requestId) {
  return MockConnectionRequests.deleteRequest(requestId);
}

void cancelAllRequestsBetweenUsers(String userIdA, String userIdB) {
  MockConnectionRequests.cancelAllRequestsBetweenUsers(userIdA, userIdB);
}

bool hasConnectionRequest(String userIdA, String userIdB) {
  return MockConnectionRequests.hasConnectionRequest(userIdA, userIdB);
}

String getConnectionStatus(String userIdA, String userIdB) {
  return MockConnectionRequests.getConnectionStatus(userIdA, userIdB);
}
