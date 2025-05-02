import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
//import 'package:ascend_app/core/services/auth_service.dart';

class ConnectionRequestRepository {
  final ApiClient _client;

  ConnectionRequestRepository({required ApiClient client}) : _client = client;

  /// Send a connection request to another user
  Future<void> sendConnectionRequest(String connectionId) async {
    try {
      final response = await _client.post(
        '$ApiEndpoints.sendconnectionRequest',
        data: {
          'userId': connectionId,
          'message': "Hi, I'd like to connect with you.",
        },
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final Map<String, dynamic> data = responseData['data'];
        debugPrint(
          'Connection request sent successfully from: ${data["senderId"]} to: ${data["receiverId"]} with Status: ${data["status"]}',
        );
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to send connection request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error: $e');
    }
  }

  /// Accept a connection request by its ID
  Future<void> acceptConnectionRequest(String requestId) async {
    try {
      final response = await _client.put(
        '${ApiEndpoints.respondConnectionRequest}/:$requestId',
        data: {'accept': true},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('Connection Request accepted Successfully');
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to accept connection request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      // For development, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error accepting connection request: $e');
    }
  }

  /// Decline a connection request by its ID
  Future<void> declineConnectionRequest(String requestId) async {
    try {
      final response = await _client.put(
        '${ApiEndpoints.respondConnectionRequest}/:$requestId',
        data: {'accept': false},
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('Connection Request declined Successfully');
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to decline connection request: ${data["success"]} with error: ${data["error"]}',
        );
      }
    } catch (e) {
      // For development, debugPrint error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error declining connection request: $e');
    }
  }

  /// Fetch all pending connection requests sent by the current user
  Future<List<UserPendingModel>> fetchPendingRequestsSent({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.connectionPending}?direction=outgoing',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic> responseData = data['data'];
        debugPrint('Response data: $responseData');
        debugPrint('Response data length: ${responseData.length}');
        return responseData
            .map((json) => UserPendingModel.fromJson(json))
            .toList();
      } else {
        debugPrint(
          'Failed to fetch sent connection requests: ${response.body}',
        );
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching sent requests: $e');
      return []; //
    }
  }

  /// Fetch all pending connection requests received by the current user
  Future<List<UserPendingModel>> fetchPendingRequestsReceived({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.connectionPending}?direction=incoming',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final List<dynamic> responseData = data['data'];
        debugPrint('Response data: $responseData');
        debugPrint('Response data length: ${responseData.length}');
        return responseData
            .map((json) => UserPendingModel.fromJson(json))
            .toList();
      } else {
        debugPrint(
          'Failed to fetch sent connection requests: ${response.body}',
        );
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching sent requests: $e');
      return []; //
    }
  }

  /// Fetch all accepted connections
  Future<List<ConnectedUser>> fetchAcceptedConnections({
    String search = '',
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.fetchconnections}?search=$search&page&limit',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> responseData = data['data'];
        debugPrint('Response data: $responseData');
        debugPrint('Response data length: ${responseData.length}');
        return responseData['data']
            .map((json) => ConnectedUser.fromJson(json))
            .toList();
      } else {
        debugPrint('Failed to fetch accepted connections: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching accepted connections: $e');
      return []; //
    }
  }

  /*/
  /// Cancel a pending connection request by its ID
  Future<void> cancelConnectionRequest(String requestId) async {
    try {
      final token = 'your_token_here';
      final response = await _client.delete(
        Uri.parse('$baseUrl${ApiEndpoints.cancelConnectionRequest}/$requestId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw Exception(
          'Failed to cancel connection request: ${response.body}',
        );
      }
    } catch (e) {
      //
      await Future.delayed(const Duration(milliseconds: 500));
      removeConnectionRequest(connectionRequests, requestId);
    }
  }
*/

  /// Remove an existing connection by its ID
  Future<void> removeConnection(String connectionId) async {
    try {
      final response = await _client.delete(
        '${ApiEndpoints.connections}/:$connectionId',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('Connection removed successfully: ${data["message"]}');
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to remove connection: ${data["success"]} with error: ${data["success"]}',
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error removing connection: $e');
    }
  }

  /// Check if a user is connected with the current user
  Future<bool> isConnected(String userId) async {
    try {
      final connections = await fetchAcceptedConnections();
      return connections.any((c) => c.user_id == userId);
    } catch (e) {
      return false;
    }
  }

  //Get users for connection recommendations
  Future<List<UserSuggestedtoConnect>> getConnectionRecommendations({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.fetchConnectionRecommendations}?page=$page&limit=$limit',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> responseData = data['data'];
        return responseData['data']
            .map((json) => UserSuggestedtoConnect.fromJson(json))
            .toList();
      } else {
        debugPrint(
          'Failed to fetch connection recommendations: ${response.body}',
        );
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching connection recommendations: $e');
      return []; //
    }
  }

  /// Fetch mutual connections for a given user ID
  Future<List<ConnectedUser>> fetchMutualConnections(String userId) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.fetchMutualConnections}/:$userId',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        final Map<String, dynamic> responseData = data['data'];
        return responseData['data']
            .map((json) => ConnectedUser.fromJson(json))
            .toList();
      } else {
        debugPrint('Failed to fetch mutual connections: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching mutual connections: $e');
      return []; //
    }
  }
}
