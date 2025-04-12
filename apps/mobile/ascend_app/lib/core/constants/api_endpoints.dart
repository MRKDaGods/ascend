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

  //follow specific endpoints
  static const String follow = '/follow';
  static const String unfollow = '/unfollow';

  //block specific endpoints
  static const String block = '/block';
  static const String blockedUsers = '/blocked';

  //connection specific endpoints
  static const String connectionRequest = '/request';
  static const String connectionResponse = '/response';
  static const String connectionList = '/connections';
  static const String deleteConnection = '/';
  static const String connectionPending = '$connectionList/pending';

  // message request specific endpoints
  static const String messageRequest = '/message-request';

  // perference specific endpoints
  static const String preferences = '/preferences';

  // user search specific endpoints
  static const String search = '/search';

  // Constructor is private to prevent instantiation
  ApiEndpoints._();
}
