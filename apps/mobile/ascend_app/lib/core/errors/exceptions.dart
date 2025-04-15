/// Exception thrown when there is a server error
class ServerException implements Exception {
  final String message;
  final int? statusCode;

  ServerException({
    required this.message,
    this.statusCode,
  });

  @override
  String toString() {
    return 'ServerException: $message ${statusCode != null ? '(Status code: $statusCode)' : ''}';
  }
}

/// Exception thrown when there is a cache/local storage error
class CacheException implements Exception {
  final String message;

  CacheException({
    required this.message,
  });

  @override
  String toString() {
    return 'CacheException: $message';
  }
}

/// Exception thrown when there is a network error
class NetworkException implements Exception {
  final String message;

  NetworkException({
    required this.message,
  });

  @override
  String toString() {
    return 'NetworkException: $message';
  }
}

/// Exception thrown when there is an authentication error
class AuthException implements Exception {
  final String message;

  AuthException({
    required this.message,
  });

  @override
  String toString() {
    return 'AuthException: $message';
  }
}