import 'package:ascend_app/features/StartPages/Model/auth_response.dart';
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'dart:convert';

class AuthRepository {
  final ApiClient apiClient;

  AuthRepository({required this.apiClient});

  // Login method
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await apiClient.login(email, password);
    return jsonDecode(response.body); // Parse the response body
  }

  // Sign-up method
  Future<AuthResponse> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    final response = await apiClient.post(
      '/auth/signup',
      data: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
      },
    );
    final responseData = jsonDecode(response.body);
    return AuthResponse.fromJson(responseData);
  }
}
