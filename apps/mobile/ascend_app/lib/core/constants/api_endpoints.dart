/// API endpoints used throughout the application
class ApiEndpoints {
  // Base paths
  static const String auth = '/auth';
  static const String users = '/users';
  static const String posts = '/posts';
  static const String comments = '/comments';
  static const String notifications = '/notifications';
  static const String deviceTokens = '/device-tokens';

  // Auth endpoints
  static const String login = '$auth/login';
  static const String register = '$auth/register';
  static const String refreshToken = '$auth/refresh-token';
  static const String forgotPassword = '$auth/forgot-password';
  static const String resetPassword = '$auth/reset-password';

  // User endpoints
  static const String currentUser = '$users/me';
  static const String userProfile = '$users/profile';

  // Notification specific endpoints
  static const String unreadNotifications = '$notifications/unread';
  static const String readAll = '$notifications/read-all';

  // Network endpoints

  // Connection endpoints
  static const String sendConnectionRequest = '/request';
  static const String acceptConnectionRequest = '/respond';
  static const String rejectConnectionRequest = '/reject';
  static const String cancelConnectionRequest = '/cancel';
  static const String fetchPendingRequests = '/pending';
  static const String fetchConnections = '/connections';
  static const String removeConnections = '/';
  static const String fetchConnectionRecommendations = '/recommendations';
  static const String fetchMutualConnections = '/mutual-connections';

  // Preferences endpoints
  static const String preferences = '/preferences';

  //  Follow endpoints
  static const String follow = '/follow';
  static const String unfollow = '/follow';
  static const String fetchFollowers = '/followers';

  // Block endpoints
  static const String block = '/block';
  static const String unblock = '/block';
  static const String fetchBlockedUsers = '/blocked-users';

  // message request endpoints
  static const String sendMessageRequest = '/message-request';
  static const String acceptMessageRequest = '/message-request';
  static const String rejectMessageRequest = '/message-request';

  // connection searching endpoints
  static const String searchConnections = '/search';

  // Constructor is private to prevent instantiation
  ApiEndpoints._();
}
