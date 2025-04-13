//class should include fields that match the structure of the API response.
//For example, if the API returns a token and user ID, the class should include those fields.
class AuthResponse {
  final String token;
  final String userId;

  AuthResponse({required this.token, required this.userId});

  // Factory method to parse JSON into an AuthResponse object
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] as String,
      userId: json['user_id'] as String,
    );
  }

  // Convert AuthResponse object to JSON (optional, for debugging or other use cases)
  Map<String, dynamic> toJson() {
    return {'token': token, 'user_id': userId};
  }
}
