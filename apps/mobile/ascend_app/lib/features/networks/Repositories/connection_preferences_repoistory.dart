import 'dart:convert';
import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:flutter/material.dart';

class ConnectionPreferencesRepository {
  final ApiClient _client;
  //final AuthService _authService;

  ConnectionPreferencesRepository({
    required ApiClient client,
    //required AuthService authService,
  }) : _client = client;

  /// Fetch connection preferences from the server
  Future<ConnectionPreferences> fetchConnectionPreferences() async {
    try {
      final response = await _client.get(ApiEndpoints.preferences);

      if (response.statusCode == 200) {
        // Successfully fetched the connection preferences
        final Map<String, dynamic> data = json.decode(response.body);
        return ConnectionPreferences.fromJson(data);
      } else {
        debugPrint(
          'Failed to fetch connection preferences: ${response.statusCode}',
        );
        return ConnectionPreferences(
          allow_connection_requests: true,
          allow_messages_from: 'all',
          visible_to_public: true,
          visible_to_connections: true,
          visible_to_network: true,
          show_followers: true,
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      print('Error: $e');
      rethrow; // Rethrow the error for further handling if needed
    }
  }

  Future<void> setConnectionPreferences(
    ConnectionPreferences connectionPreference,
  ) async {
    try {
      final response = await _client.put(
        ApiEndpoints.preferences,
        data: connectionPreference.toJson(),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Successfully updated the connection preferences
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> updatedData = data['data'];
        debugPrint(
          'Updated connection preferences for user : $updatedData["user_id"] with preferences: $updatedData',
        );
      } else {
        throw Exception(
          'Failed to update connection preferences: ${response.body}',
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
      rethrow; // Rethrow the error for further handling if needed
    }
  }
}
