import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:ascend_app/features/admin/data/models/users_model.dart';

part 'users_event.dart';
part 'users_state.dart';

class UsersBloc extends Bloc<UsersEvent, UsersState> {
  final AdminRepository adminRepository;

  UsersBloc({required this.adminRepository}) : super(UsersInitial()) {
    // Handle FetchReportedUsers event
    on<FetchReportedUsers>((event, emit) async {
      emit(UsersLoading());
      try {
        final reports = await adminRepository.getReportedUsers();
        emit(UsersLoaded(reports));
      } catch (e) {
        emit(UsersError(e.toString()));
      }
    });

    // Handle DeleteUserEvent
    on<DeleteUserEvent>((event, emit) async {
      try {
        await adminRepository.deleteUser(event.userId);
        emit(UserDeletedState(event.userId));
      } catch (e) {
        emit(UsersError('Failed to delete user: $e'));
      }
    });

    // Handle banUser event
    // First, add the import
    // Then update the BanUserEvent handler
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

        // Refresh the user list after banning
        final reports = await adminRepository.getReportedUsers();
        emit(UsersLoaded(reports));
      } catch (e) {
        emit(UsersError('Error banning user with ID ${event.userId}: $e'));
      }
    });
  }
}
