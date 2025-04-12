import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/constants/api_bases.dart';

class ConnectionPreferencesRepository {
  final http.Client _client;
  //final AuthService _authService;

  ConnectionPreferencesRepository({http.Client? client})
    : _client = client ?? http.Client();

  /// Fetch connection preferences from the server
  Future<ConnectionPreferences> fetchConnectionPreferences() async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.preferences}',
      );
      final response = await _client.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to unblock user: ${response.body}');
      }
      return ConnectionPreferences.fromJson(jsonDecode(response.body));
    } catch (e) {
      // For now, print the error
      await Future.delayed(const Duration(milliseconds: 500));
      return ConnectionPreferences(
        allow_connection_requests: true,
        allow_message_requests: 'all',
        visible_to_public: true,
        visible_to_connections: true,
        visible_to_network: true,
      );
    }
  }

  Future<void> setConnectionPreferences(
    ConnectionPreferences connectionPreference,
  ) async {
    try {
      final token = 'your_token_here';
      final uri = Uri.parse(
        '${ApiBases.Connection_Base}${ApiEndpoints.preferences}',
      );
      final response = await _client.put(
        uri,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(connectionPreference.toJson()),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to unblock user: ${response.body}');
      }
    } catch (e) {
      // For now, print the error
      await Future.delayed(const Duration(milliseconds: 500));
    }
  }
}
