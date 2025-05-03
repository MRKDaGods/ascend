import 'package:ascend_app/features/networks/model/blocked_user_model.dart';
import 'package:ascend_app/features/networks/Repositories/block_repoistory.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
part 'block_event.dart';
part 'block_state.dart';

class BlockBloc extends Bloc<BlockEvent, BlockState> {
  final BlockRepository _repository;

  BlockBloc({required BlockRepository repository})
    : _repository = repository,
      super(BlockInitial()) {
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
      await _repository.blockUser(event.blockedId); // Block the user
      add(FetchBlockedUsersEvent());
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
      await _repository.unblockUser(event.blockedId); // Unblock the user
      add(FetchBlockedUsersEvent());
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
      final blockedUsers =
          await _repository.fetchBlockedUsers(); // Fetch blocked users
      emit(
        BlockedUsersLoaded(blockedUsers),
      ); // Update with actual blocked users
    } catch (e) {
      emit(BlockedUserError(e.toString()));
    }
  }
}
