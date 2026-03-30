import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:ascend_app/features/admin/data/models/users_model.dart';

part 'users_event.dart';
part 'users_state.dart';

class UsersBloc extends Bloc<UsersEvent, UsersState> {
  final AdminRepository adminRepository;
  AdminRepository get repository => adminRepository;

  // Keep track of cached data to preserve across tab switches
  List<UserReport> _reportedUsers = [];
  List<BannedUser> _bannedUsers = [];

  UsersBloc({required this.adminRepository}) : super(UsersInitial()) {
    // Handle FetchReportedUsers event
    on<FetchReportedUsers>((event, emit) async {
      // Only show loading if we don't have cached data
      if (_reportedUsers.isEmpty) {
        emit(UsersLoading());
      }

      try {
        _reportedUsers = await adminRepository.getReportedUsers();
        emit(UsersLoaded(_reportedUsers));

        // If we already have cached banned users, we can update the combined state
        // This ensures both tabs have data available
        if (_bannedUsers.isNotEmpty) {
          // Log for debugging
          debugPrint('Cached banned users available: ${_bannedUsers.length}');
        }
      } catch (e) {
        emit(UsersError(e.toString()));
      }
    });

    // Handle FetchBannedUsers event
    on<FetchBannedUsers>((event, emit) async {
      // Only show loading if we don't have cached data
      if (_bannedUsers.isEmpty) {
        emit(UsersLoading());
      }

      try {
        _bannedUsers = await adminRepository.getBannedUsers();
        emit(BannedUsersLoaded(_bannedUsers));

        // If we already have cached reported users, update for awareness
        if (_reportedUsers.isNotEmpty) {
          // Log for debugging
          debugPrint(
            'Cached reported users available: ${_reportedUsers.length}',
          );
        }
      } catch (e) {
        emit(UsersError(e.toString()));
      }
    });

    // Handle DeleteUserEvent
    on<DeleteUserEvent>((event, emit) async {
      try {
        await adminRepository.deleteUser(event.userId);
        emit(UserDeletedState(event.userId));

        // Refresh the lists after successful deletion
        add(FetchReportedUsers());
        add(FetchBannedUsers());
      } catch (e) {
        String errorMessage = e.toString();
        debugPrint('Delete user error: $errorMessage');

        // Check for specific error patterns
        if (errorMessage.contains('User not found') ||
            errorMessage.contains('"error": "User not found"')) {
          // This is a cleaner message for the admin
          emit(
            UsersError(
              'User with ID ${event.userId} was not found in the system',
            ),
          );
        } else if (errorMessage.contains('Cannot DELETE')) {
          emit(
            UsersError('User with ID ${event.userId} does not exist on server'),
          );
        } else {
          emit(UsersError('Error deleting user with ID ${event.userId}: $e'));
        }
      }
    });
    
    // Handle BanUserEvent
    on<BanUserEvent>((event, emit) async {
      try {
        // Get the authentication token from SecureStorageHelper
        final String? authToken = await SecureStorageHelper.getAuthToken();

        if (authToken == null) {
          throw Exception('No authentication token available');
        }

        // Pass the token to your repository method
        await adminRepository.banUser(
          userId: event.userId,
          reason: event.reason,
          expiresAt: event.expiresAt,
        );

        // Temporary success state
        emit(UserBannedState(event.userId));

        // Filter out the banned user's reports locally
        // This way they won't reappear even if they get unbanned later
        _reportedUsers =
            _reportedUsers
                .where((report) => report.reportedId != event.userId)
                .toList();

        // Fetch only banned users to update the banned list
        _bannedUsers = await adminRepository.getBannedUsers();

        // Update UI based on current tab with filtered data
        emit(UsersLoaded(_reportedUsers));

        debugPrint(
          'User with ID ${event.userId} banned and reports filtered out',
        );
      } catch (e) {
        emit(UsersError('Error banning user with ID ${event.userId}: $e'));
      }
    });

    // Handle UnbanUserEvent
    on<UnbanUser>((event, emit) async {
      try {
        final userId = int.parse(event.userId);
        await adminRepository.unbanUser(userId: userId);

        // Signal that a user has been unbanned
        emit(UserUnbannedState(userId));

        // Only refresh banned users cache - do NOT refresh reported users
        // This ensures the reports remain filtered out even after unbanning
        _bannedUsers = await adminRepository.getBannedUsers();
        emit(BannedUsersLoaded(_bannedUsers));

        debugPrint('User with ID $userId unbanned successfully');
      } catch (e) {
        emit(UsersError('Failed to unban user: $e'));
      }
    });

    // Listen for RefreshReportedUsers event to force refresh
    on<RefreshReportedUsers>((event, emit) async {
      emit(UsersLoading());
      try {
        _reportedUsers = await adminRepository.getReportedUsers();
        emit(UsersLoaded(_reportedUsers));
      } catch (e) {
        emit(UsersError(e.toString()));
      }
    });
  }

  // Helper methods to access cached data
  List<UserReport> get reportedUsers => _reportedUsers;
  List<BannedUser> get bannedUsers => _bannedUsers;
}
