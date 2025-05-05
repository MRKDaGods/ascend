import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:ascend_app/features/admin/data/models/users_model.dart';

part 'users_event.dart';
part 'users_state.dart';

class UsersBloc extends Bloc<UsersEvent, UsersState> {
  final AdminRepository adminRepository;

  UsersBloc({required this.adminRepository}) : super(UsersInitial()) {
    on<FetchReportedUsers>((event, emit) async {
      emit(UsersLoading());
      try {
        final reports = await adminRepository.getReportedUsers();
        emit(UsersLoaded(reports));
      } catch (e) {
        emit(UsersError(e.toString()));
      }
    });
  }
}
