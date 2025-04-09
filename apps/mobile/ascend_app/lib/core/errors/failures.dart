/// Base class for all failures in the domain layer
abstract class Failure {
  final String message;
  
  const Failure({required this.message});
  
  @override
  String toString() => message;
}

/// Failure related to server errors
class ServerFailure extends Failure {
  const ServerFailure({required super.message});
}

/// Failure related to cache/local storage errors
class CacheFailure extends Failure {
  const CacheFailure({required super.message});
}

/// Failure related to network connectivity issues
class NetworkFailure extends Failure {
  const NetworkFailure({required super.message});
}

/// Failure related to authentication issues
class AuthFailure extends Failure {
  const AuthFailure({required super.message});
}

/// Failure for validation errors
class ValidationFailure extends Failure {
  final Map<String, List<String>>? errors;
  
  const ValidationFailure({
    required super.message,
    this.errors,
  });
}

/// Failure for unknown/unexpected errors
class UnknownFailure extends Failure {
  const UnknownFailure({required super.message});
}