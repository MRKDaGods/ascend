/// API endpoints used throughout the application
class ApiEndpoints {
  // Base paths
  static const String auth = '/auth';
  static const String users = '/users';
  static const String posts = '/posts';
  static const String comments = '/comments';
  static const String notifications = '/notifications';
  static const String deviceTokens = '/device-tokens';
  static const String messaging = '/messaging';

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

  // Connection endpoints
  static const String sendconnectionRequest = '/request';
  static const String acceptConnectionRequest = '/respond';
  static const String rejectConnectionRequest = '/respond';
  static const String fetchconnections = '/connections';
  static const String connectionPending = '/connections/pending';
  static const String cancelConnectionRequest = '/cancel-request';
  static const String fetchConnectionRecommendations = '/recommendations';
  static const String fetchMutualConnections = '/mutual-connections';
  static const String fetchConnections = '/connections';

  // Follow endpoints
  static const String follow = '/follow';
  static const String followed = '/followed';

  // Block endpoints
  static const String block = '/block';
  static const String fetchBlockedUsers = '/blocked';

  // Message Request endpoints
  static const String sendMessageRequest = '/message-request';
  static const String acceptMessageRequest = '/message-request';
  static const String rejectMessageRequest = '/message-request';

  // Preference endpoints
  static const String preferences = '/preferences';

  //messaging endpoints
  static const String conversations = '$messaging/conversations';
  static const String unseenCount = '$messaging/unseen-count';
  static const String message = '$messaging/';

  // Search endpoints
  static const String search = '/search';

  // Constructor is private to prevent instantiation
  ApiEndpoints._();
}
