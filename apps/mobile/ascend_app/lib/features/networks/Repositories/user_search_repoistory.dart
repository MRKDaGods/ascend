import 'dart:convert';
import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:ascend_app/features/networks/Repositories/connection_preferences_repoistory.dart';
import 'package:ascend_app/features/networks/Repositories/follow_repoistory.dart';
import 'package:ascend_app/features/networks/model/loaded_user_Profile.dart';
import 'package:ascend_app/features/networks/Repositories/connection_request_repoistory.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';

class UserSearchRepoistory {
  final ApiClient _client;
  final ConnectionRequestRepository _connectionRequestRepository =
      ConnectionRequestRepository(client: ApiClient());
  final FollowRepoistory _followRequestRepository = FollowRepoistory(
    client: ApiClient(),
  );
  final ConnectionPreferencesRepository _connectionPreferencesRepository =
      ConnectionPreferencesRepository(client: ApiClient());

  UserSearchRepoistory({required ApiClient client}) : _client = client;

  Future<List<LoadedUserProfile>> searchUsers({
    String q = "",
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _client.get(
        '${ApiEndpoints.search}?q=$q&page=$page&limit=$limit',
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final Map<String, dynamic> responseData = data['data'];

        final List<LoadedUserProfile> users =
            (responseData['data'] as List)
                .map((user) => LoadedUserProfile.fromJson(user))
                .toList();

        for (var user in users) {
          final String connectionStatus = await _connectionRequestRepository
              .getConnectionStatus(user.user_id);

          final bool isFollowed = await _followRequestRepository.isUserFollowed(
            user.user_id,
          );

          final Map<String, bool> connectionPreferences =
              await _connectionPreferencesRepository.canConnect(user.user_id);

          final List<ConnectedUser> connectedUsers =
              await _connectionRequestRepository.fetchMutualConnections(
                user.user_id,
              );
          user.is_connected = connectionStatus;
          user.is_followed = isFollowed;
          user.canConnect = connectionPreferences['canConnect'];
          user.canReceiveMessageRequests =
              connectionPreferences['canReceiveMessageRequests'];
          user.connected_users = connectedUsers;
          user.connected_users_count = connectedUsers.length;
        }
        return users;
      } else {
        throw Exception('Failed to load users: ${response.statusCode}');
      }
    } catch (e) {
      rethrow;
    }
  }
}
