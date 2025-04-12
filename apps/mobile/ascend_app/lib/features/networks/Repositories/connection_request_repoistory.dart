import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/Mock Data/connections_request.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_connect.dart';
import 'package:ascend_app/features/networks/model/user_pending_model.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/core/constants/api_bases.dart';
//import 'package:ascend_app/core/services/auth_service.dart';

class ConnectionRequestRepository {
  final http.Client _client;
  //final AuthService _authService;

  // Keep the mock data for development
  final List<ConnectionRequestModel> connectionRequests = ConnectionRequests();

  ConnectionRequestRepository({
    http.Client? client,
    //AuthService? authService,
  }) : _client = client ?? http.Client();
  //_authService = authService ?? AuthService();

  /// Send a connection request to another user
  Future<void> sendConnectionRequest(String connectionId) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here'; // Replace with actual token retrieval

      // Create request body with user_id and message
      final requestBody = {
        'user_id': connectionId,
        'message': "hi ,  let's connect",
      };

      final response = await _client.post(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionRequest}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(requestBody),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to send connection request: ${response.body}');
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      //addConnectionRequest(connectionRequests, connectionRequest);
    }
  }

  /// Accept a connection request by its ID
  Future<void> acceptConnectionRequest(String requestId) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.put(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionResponse}/$requestId',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'accept': 'true'}),
      );

      if (response.statusCode != 200) {
        throw Exception(
          'Failed to accept connection request: ${response.body}',
        );
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      //acceptConnectionRequest(requestId);
    }
  }

  /// Decline a connection request by its ID
  Future<void> declineConnectionRequest(String requestId) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.put(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionResponse}/$requestId',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'accept': 'false'}),
      );

      if (response.statusCode != 200) {
        throw Exception(
          'Failed to accept connection request: ${response.body}',
        );
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      acceptConnectionRequest(requestId);
    }
  }

  /// Fetch all pending connection requests sent by the current user
  Future<List<UserPendingModel>> fetchPendingRequestsSent({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here';
      final response = await _client.get(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionPending}',
        ).replace(
          queryParameters: {
            'direction': 'outgoing',
            'page': page.toString(),
            'limit': limit.toString(),
          },
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => UserPendingModel.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to fetch sent connection requests: ${response.body}',
        );
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      return []; // Return an empty list or mock data
    }
  }

  /// Fetch all pending connection requests received by the current user
  Future<List<UserPendingModel>> fetchPendingRequestsReceived({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      //final token = await _authService.getToken();
      final token = 'your_token_here';
      final response = await _client.get(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionPending}',
        ).replace(
          queryParameters: {
            'direction': 'incoming',
            'page': page.toString(),
            'limit': limit.toString(),
          },
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => UserPendingModel.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to fetch received connection requests: ${response.body}',
        );
      }
    } catch (e) {
      // For development, print error
      await Future.delayed(const Duration(milliseconds: 500));
      print('Error fetching pending requests: $e');
      return []; // Return an empty list or mock data
    }
  }

  /// Fetch all accepted connections
  Future<List<ConnectedUser>> fetchAcceptedConnections({
    String search = '',
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final token = 'your_token_here';
      final response = await _client.get(
        Uri.parse(
          '${ApiBases.Connection_Base}${ApiEndpoints.connectionList}',
        ).replace(
          queryParameters: {
            'search': search,
            'page': page.toString(),
            'limit': limit.toString(),
          },
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ConnectedUser.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to fetch accepted connections: ${response.body}',
        );
      }
    } catch (e) {
      // For development, use emptyList
      await Future.delayed(const Duration(milliseconds: 500));
      return []; // Return an empty list or mock data
    }
  }

  /// Cancel a pending connection request by its ID
  Future<void> cancelConnectionRequest(String requestId) async {
    try {
      final token = 'your_token_here';
      final response = await _client.delete(
        Uri.parse('${ApiEndpoints.connectionRequest}/$requestId'),
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

  /// Remove an existing connection by its ID
  Future<void> removeConnection(String connectionId) async {
    try {
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.delete(
        Uri.parse('/$connectionId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to remove connection: ${response.body}');
      }
    } catch (e) {
      // For development, use mock implementation
      await Future.delayed(const Duration(milliseconds: 500));
      removeConnectionRequest(connectionRequests, connectionId);
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
  Future<List<UserSuggestedtoConnect>> getConnectionRecommendations() async {
    try {
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.get(
        Uri.parse('${ApiBases.Connection_Base}${ApiEndpoints.connectionList}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data
            .map((json) => UserSuggestedtoConnect.fromJson(json))
            .toList();
      } else {
        throw Exception(
          'Failed to fetch connection recommendations: ${response.body}',
        );
      }
    } catch (e) {
      // Return mock data for development
      await Future.delayed(const Duration(milliseconds: 500));
      return []; // Return an empty list or mock data
    }
  }

  /// Fetch mutual connections for a given user ID
  Future<List<ConnectedUser>> fetchMutualConnections(String userId) async {
    try {
      final token = 'your_token_here'; // Replace with actual token retrieval
      final response = await _client.get(
        Uri.parse('${ApiBases.Connection_Base}${ApiEndpoints.connectionList}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ConnectedUser.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to fetch connection recommendations: ${response.body}',
        );
      }
    } catch (e) {
      // Return mock data for development
      await Future.delayed(const Duration(milliseconds: 500));
      return []; // Return an empty list or mock data
    }
  }
}
