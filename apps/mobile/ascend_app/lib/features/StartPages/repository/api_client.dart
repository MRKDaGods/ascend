import 'dart:convert';
import 'package:flutter/widgets.dart';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:logger/logger.dart';
import 'dart:io';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

class ApiClient {
  final String _baseUrl = 'https://api.ascendx.tech';
  final Logger _logger = Logger(); // Logger instance

  // Helper method to get headers (e.g., for authentication)
  Future<Map<String, String>> _getHeaders() async {
    final token = await SecureStorageHelper.getAuthToken();
    debugPrint(
      'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii//////////////////////////////////////////////////////////////////////////////////////[ApiClient] Retrieved Auth Token: $token',
    );
    return {
      if (token != null) 'Authorization': 'Bearer $token',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  // GET request
  Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final response = await http
        .get(url, headers: headers)
        .timeout(Duration(seconds: 10));

    _handleResponse(response);
    return response;
  }

  // POST request
  Future<http.Response> post(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final body = jsonEncode(data);

    final response = await http.post(url, headers: headers, body: body);

    _handleResponse(response);
    return response;
  }

  // POST request for login
  Future<http.Response> login(String email, String password) async {
    final headers = {'Content-Type': 'application/json'};
    final url = Uri.parse('$_baseUrl/auth/login');
    final body = jsonEncode({'email': email, 'password': password});

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      await SecureStorageHelper.setAuthToken(responseData['token']);

      if (responseData['user_id'] == null) {
        await SecureStorageHelper.setUserId('16');
      } else {}
      await SecureStorageHelper.setUserId(responseData['user_id'].toString());
      _logger.i('Login successful: ${response.body}');
    } else {
      _logger.i('Login failed: ${response.statusCode}, ${response.body}');
      throw Exception(
        'Failed to login: ${response.statusCode}, ${response.body}',
      );
    }

    _handleResponse(response); // Ensure this is outside the if block
    return response;
  }

  // POST request for sign-up
  Future<http.Response> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final headers = {'Content-Type': 'application/json'};
    final url = Uri.parse('$_baseUrl/auth/register');
    final body = jsonEncode({
      'email': email,
      'password': password,
      'first_name': firstName,
      'last_name': lastName,
    });

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      _logger.i('Sign-up successful: ${response.body}');
    } else {
      _logger.i('Sign-up failed: ${response.statusCode}, ${response.body}');
    }

    _handleResponse(response);
    return response;
  }

  // POST request for Forgot Password
  Future<http.Response> forgotPassword(String emailOrPhone) async {
    final headers = {'Content-Type': 'application/json'};
    final url = Uri.parse('$_baseUrl/auth/forgot-password');
    final body = jsonEncode({'emailOrPhone': emailOrPhone});

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      _logger.i('Forgot password request successful: ${response.body}');
    } else {
      _logger.i(
        'Forgot password request failed: ${response.statusCode}, ${response.body}',
      );
    }

    _handleResponse(response);
    return response;
  }

  // POST request for Verify Code
  Future<http.Response> verifyCode({
    required String emailOrPhone,
    required String verificationCode,
  }) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl/auth/verify-code');
    final body = jsonEncode({
      'emailOrPhone': emailOrPhone,
      'verificationCode': verificationCode,
    });

    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 200) {
      _logger.i('Verification code successful: ${response.body}');
    } else {
      _logger.i(
        'Verification code failed: ${response.statusCode}, ${response.body}',
      );
    }

    _handleResponse(response);
    return response;
  }

  // PUT request
  Future<http.Response> put(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final response = await http.put(
      url,
      headers: headers,
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      _logger.i('PUT request successful: ${response.body}');
    } else {
      _logger.i('PUT request failed: ${response.statusCode}, ${response.body}');
    }

    _handleResponse(response);
    return response;
  }

  // DELETE request
  Future<http.Response> delete(String endpoint) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final response = await http.delete(url, headers: headers);

    if (response.statusCode == 200) {
      _logger.i('DELETE request successful: ${response.body}');
    } else {
      _logger.i(
        'DELETE request failed: ${response.statusCode}, ${response.body}',
      );
    }

    _handleResponse(response);
    return response;
  }

  // PATCH request
  Future<http.Response> patch(
    String endpoint, {
    Map<String, dynamic>? data,
  }) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final response = await http.patch(
      url,
      headers: headers,
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      _logger.i('PATCH request successful: ${response.body}');
    } else {
      _logger.i(
        'PATCH request failed: ${response.statusCode}, ${response.body}',
      );
    }

    _handleResponse(response);
    return response;
  }

  // Upload File with Multipart Request
  Future<http.Response> uploadFile(
    String endpoint,
    File file,
    String context,
  ) async {
    final url = Uri.parse('$_baseUrl$endpoint');
    final token = await SecureStorageHelper.getAuthToken();

    // Create multipart request
    final request = http.MultipartRequest('POST', url);

    // Set headers
    request.headers.addAll({
      if (token != null) 'Authorization': 'Bearer $token',
      'x-no-parse-body': '1',
    });

    // Determine media type based on file extension
    final fileExtension = path.extension(file.path).toLowerCase();
    MediaType? mediaType;

    if (fileExtension == '.jpg' || fileExtension == '.jpeg') {
      mediaType = MediaType('image', 'jpeg');
    } else if (fileExtension == '.png') {
      mediaType = MediaType('image', 'png');
    } else if (fileExtension == '.pdf') {
      mediaType = MediaType('application', 'pdf');
    } else if (fileExtension == '.doc' || fileExtension == '.docx') {
      mediaType = MediaType('application', 'msword');
    }

    // Add file to request
    request.files.add(
      http.MultipartFile(
        'file',
        file.readAsBytes().asStream(),
        file.lengthSync(),
        filename: path.basename(file.path),
        contentType: mediaType,
      ),
    );

    // Add context field
    request.fields['context'] = context;

    // Send request
    try {
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      _handleResponse(response);
      return response;
    } catch (e) {
      _logger.e('Error uploading file: $e');
      throw Exception('Error uploading file: $e');
    }
  }

  // Handle API response
  void _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      _logger.i('Request successful: ${response.body}');
      return;
    } else {
      _logger.i('Request failed: ${response.statusCode}, ${response.body}');
      throw Exception('Error: ${response.statusCode}, ${response.body}');
    }
  }
}
