import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/blocked_user_model.dart';

part 'block_event.dart';
part 'block_state.dart';

class BlockBloc extends Bloc<BlockEvent, BlockState> {
  BlockBloc() : super(BlockInitial()) {
    on<BlockUserEvent>(_onBlockUserEvent);
    on<UnblockUserEvent>(_onUnblockUserEvent);
    on<FetchBlockedUsersEvent>(_onFetchBlockedUsersEvent);
  }

  Future<void> _onBlockUserEvent(
    BlockUserEvent event,
    Emitter<BlockState> emit,
  ) async {
    emit(BlockLoading());
    try {
      // Simulate blocking a user
      await Future.delayed(Duration(seconds: 1));
      emit(BlockedUsersLoaded([])); // Update with actual blocked users
    } catch (e) {
      emit(BlockedUserError(e.toString()));
    }
  }

  Future<void> _onUnblockUserEvent(
    UnblockUserEvent event,
    Emitter<BlockState> emit,
  ) async {
    emit(BlockLoading());
    try {
      // Simulate unblocking a user
      await Future.delayed(Duration(seconds: 1));
      emit(BlockedUsersLoaded([])); // Update with actual blocked users
    } catch (e) {
      emit(BlockedUserError(e.toString()));
    }
  }

  Future<void> _onFetchBlockedUsersEvent(
    FetchBlockedUsersEvent event,
    Emitter<BlockState> emit,
  ) async {
    emit(BlockLoading());
    try {
      // Simulate fetching blocked users
      await Future.delayed(Duration(seconds: 1));
      emit(BlockedUsersLoaded([])); // Update with actual blocked users
    } catch (e) {
      emit(BlockedUserError(e.toString()));
    }
  }
}
