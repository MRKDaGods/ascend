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
  static const String connections = '/connection';

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
  static const String sendconnectionRequest = '$connections/request';
  static const String respondConnectionRequest = '$connections/respond';
  static const String fetchconnections = '$connections/connections';
  static const String connectionPending = '$connections/connections/pending';
  static const String cancelConnectionRequest = '$connections/cancel-request';
  static const String fetchConnectionRecommendations =
      '$connections/connections/network';
  static const String fetchMutualConnections =
      '$connections/connections/mutual';

  // Follow endpoints
  static const String follow = '$connections/follow';
  static const String unfollow = '$connections/follow';
  static const String followed = '$connections/followers';
  static const String followedRecommendations =
      '$connections/followers/recommendations';

  // Block endpoints
  static const String block = '$connections/block';
  static const String unblock = '$connections/block';
  static const String fetchBlockedUsers = '$connections/blocked';

  // Message Request endpoints
  static const String sendMessageRequest = '$connections/message-request';
  static const String respondMessageRequest = '$connections/message-request';

  // Preference endpoints
  static const String preferences = '$connections/preferences';

  //messaging endpoints
  static const String conversations = '$messaging/conversations';
  static const String unseenCount = '$messaging/unseen-count';
  static const String message = messaging;

  // Search endpoints
  static const String search = '$connections/search';

  // Constructor is private to prevent instantiation
  ApiEndpoints._();
}
