import 'dart:async';
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
        ApiEndpoints.sendconnectionRequest,
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
      final int id = int.parse(requestId);
      final response = await _client.put(
        '${ApiEndpoints.respondConnectionRequest}/$id',
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
      final int id = int.parse(requestId);
      final response = await _client.put(
        '${ApiEndpoints.respondConnectionRequest}/$id',
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
    bool includeMutualConnection = false,
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

        final pendingRequests =
            responseData
                .map((json) => UserPendingModel.fromJson(json))
                .toList();

        if (includeMutualConnection) {
          return await addMutualConnectionstoRequests(pendingRequests);
        }
        return pendingRequests;
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
      // Fix the query parameters
      final response = await _client.get(
        '${ApiEndpoints.fetchconnections}?search=$search&page=$page&limit=$limit',
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint('Raw response: ${response.body}');

        // Check if data is directly a List
        if (data['data'] is List) {
          final List<dynamic> connections = data['data'];
          debugPrint(
            'Connection data is a direct list with ${connections.length} items',
          );

          return connections
              .map((json) => ConnectedUser.fromJson(json))
              .toList();
        }
        // Check if data is a Map containing a 'data' List
        else if (data['data'] is Map && data['data']['data'] is List) {
          final List<dynamic> connections = data['data']['data'];
          debugPrint(
            'Connection data is nested with ${connections.length} items',
          );

          return connections
              .map((json) => ConnectedUser.fromJson(json))
              .toList();
        }
        // If no suitable data is found
        else {
          debugPrint(
            'No accepted connections found or unexpected data structure: ${data['data']}',
          );
          return [];
        }
      } else {
        debugPrint('Failed to fetch accepted connections: ${response.body}');
        return [];
      }
    } catch (e, stackTrace) {
      debugPrint('Error fetching accepted connections: $e');
      debugPrint('Stack trace: $stackTrace');
      return [];
    }
  }

  /// Cancel a pending connection request by its ID
  Future<void> cancelConnectionRequest(String requestId) async {
    try {
      final int id = int.parse(requestId);
      final response = await _client.delete(
        '${ApiEndpoints.connectionPending}/$id',
      );
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Connection request cancelled successfully: ${data["message"]}',
        );
      } else {
        final Map<String, dynamic> data = json.decode(response.body);
        debugPrint(
          'Failed to cancel connection request: ${data["success"]} with error: ${data["success"]}',
        );
      }
    } catch (e) {
      // For now, debugPrint the error
      await Future.delayed(const Duration(milliseconds: 500));
      debugPrint('Error cancelling connection request: $e');
    }
  }

  /// Remove an existing connection by its ID
  Future<void> removeConnection(String connectionId) async {
    try {
      final int id = int.parse(connectionId);
      final response = await _client.delete('${ApiEndpoints.connections}/$id');
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
        '${ApiEndpoints.fetchMutualConnections}/$userId',
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

  Future<List<UserPendingModel>> addMutualConnectionstoRequests(
    List<UserPendingModel> pendingRequests,
  ) async {
    try {
      List<UserPendingModel> updatedRequests = [];
      // Iterate through each pending request and fetch mutual connections

      for (var request in pendingRequests) {
        final mutualConnections = await fetchMutualConnections(
          request.id.toString(),
        );
        final updatedRequest = request.copyWith(
          connected_users: mutualConnections,
          connected_users_count: mutualConnections.length,
        );
        updatedRequests.add(updatedRequest);
      }

      return updatedRequests;
    } catch (e) {
      debugPrint('Error adding mutual connections: $e');
      return pendingRequests;
    }
  }

  Future<String> getConnectionStatus(String userId) async {
    try {
      final int id = int.parse(userId);
      final response = await _client.get('/connection/connections/status/$id');
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['data']['status'] ?? "notConnected";
      } else {
        debugPrint('Failed to fetch connection status: ${response.body}');
        return "notConnected";
      }
    } catch (e) {
      debugPrint('Error fetching connection status: $e');
      return "notConnected";
    }
  }
}
