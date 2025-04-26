import 'package:ascend_app/features/StartPages/Model/auth_response.dart';
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

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

  // register({
  //   required String firstName,
  //   required String lastName,
  //   required String email,
  //   required String password,
  // }) {}

  // Forget password method
  Future<Map<String, dynamic>> forgotPassword(String emailOrPhone) async {
  final response = await apiClient.forgotPassword(emailOrPhone);

  // Parse the response body and return it as a Map
  return jsonDecode(response.body);
  }

}
