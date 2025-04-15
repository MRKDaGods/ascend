import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class ApiClient {
  final String _baseUrl = 'http://api.ascendx.tech';

  // Helper method to get headers (e.g., for authentication)
  Future<Map<String, String>> _getHeaders() async {
    final token = await SecureStorageHelper.getAuthToken();
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
    final response = await http.post(
      url,
      headers: headers,
      body: jsonEncode(data),
    );
    _handleResponse(response);
    return response;
  }

  // POST request for login
  Future<http.Response> login(String email, String password) async {
    final headers = {'Content-Type': 'application/json'};
    final url = Uri.parse(
      '$_baseUrl/auth/login',
    ); // Append /login to the base URL
    final body = jsonEncode({'email': email, 'password': password});

    print('Sending POST request to $url with body: $body'); // Debugging log

    final response = await http.post(url, headers: headers, body: body);

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      await SecureStorageHelper.setAuthToken(responseData['token']);
    } else {
      throw Exception(
        'Failed to login: ${response.statusCode}, ${response.body}',
      );
    }

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
    _handleResponse(response);
    return response;
  }

  // DELETE request
  Future<http.Response> delete(String endpoint) async {
    final headers = await _getHeaders();
    final url = Uri.parse('$_baseUrl$endpoint');
    final response = await http.delete(url, headers: headers);
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
    _handleResponse(response);
    return response;
  }

  // Handle API response
  void _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // Success
      return;
    } else {
      // Handle errors
      throw Exception('Error: ${response.statusCode}, ${response.body}');
    }
  }
}
