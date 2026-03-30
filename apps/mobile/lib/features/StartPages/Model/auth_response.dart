class AuthResponse {
  final String? token; // Optional for Sign Up
  final String? userId;
  final String? email;

  AuthResponse({this.token, this.userId, this.email});

  // Factory method to parse JSON into an AuthResponse object
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'], // Optional, may not exist in Sign Up response
      userId: json['user_id']?.toString(), // Ensure userId is a String
      email: json['email'], // Ensure email is a String
    );
  }

  // Convert AuthResponse object to JSON (optional, for debugging or other use cases)
  Map<String, dynamic> toJson() {
    return {'token': token, 'user_id': userId, 'email': email};
  }
}
