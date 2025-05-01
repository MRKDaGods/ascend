import 'package:ascend_app/features/StartPages/Model/auth_response.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
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
    final response = await apiClient.signUp(
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    );

    // Parse the JSON response into an AuthResponse object
    final responseData = jsonDecode(response.body);
    return AuthResponse.fromJson(responseData);
  }

  // Forget password method
  Future<Map<String, dynamic>> forgotPassword(String emailOrPhone) async {
    final response = await apiClient.forgotPassword(emailOrPhone);

    // Parse the response body and return it as a Map
    return jsonDecode(response.body);
  }

  // Verify code method
  Future<String> verifyCode({
    required String emailOrPhone,
    required String verificationCode,
  }) async {
    final response = await apiClient.post(
      '/verify-code',
      data: {
        'emailOrPhone': emailOrPhone,
        'verificationCode': verificationCode,
      },
    );

    // Check if the response is successful
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      return responseData['token']; // Extract and return the token
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Failed to verify code');
    }
  }

  // Reset password method
  Future<String> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    final response = await apiClient.put(
      '/reset-password', // Replace with your actual API endpoint
      data: {
        'token': token, // Include the token
        'newPassword': newPassword,
      },
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      return responseData['message']; // Return success message
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception(errorData['error'] ?? 'Failed to reset password');
    }
  }
}
