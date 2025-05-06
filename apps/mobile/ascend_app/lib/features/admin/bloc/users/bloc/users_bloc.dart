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
    on<BanUserEvent>((event, emit) async {
      try {
        await adminRepository.banUser(
          userId: event.userId,
          expiresAt: event.expiresAt,
          reason: event.reason,
        );
        emit(UserBannedState(event.userId));
      } catch (e) {
        if (e.toString().contains('Token required')) {
          emit(UsersError('Authentication failed. Please log in again.'));
        } else {
          emit(UsersError('Failed to ban user: $e'));
        }
      }
    });
  }
}
