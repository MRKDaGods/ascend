import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/Repositories/follow_repoistory.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'follow_event.dart';
part 'follow_state.dart';

class FollowBloc extends Bloc<FollowEvent, FollowState> {
  final FollowRepoistory _followRepoistory;
  FollowBloc({required FollowRepoistory followRepoistory})
    : _followRepoistory = followRepoistory,
      super(FollowInitial()) {
    on<FetchFollowing>(_fetchfollowings);
    on<FollowUser>(_addfollowing);
    on<UnfollowUser>(_deletefollowing);
  }

  void _addfollowing(FollowUser event, Emitter<FollowState> emit) async {
    emit(FollowLoading());
    try {
      _followRepoistory.followUser(event.userId);
      add(FetchFollowing());
    } catch (e) {
      emit(FollowFailure(message: e.toString()));
    }
  }

  void _deletefollowing(UnfollowUser event, Emitter<FollowState> emit) {
    emit(FollowLoading());
    try {
      _followRepoistory.unfollowUser(event.userId);
      add(FetchFollowing());
    } catch (e) {
      emit(FollowFailure(message: e.toString()));
    }
  }

  Future<void> _fetchfollowings(
    FetchFollowing event,
    Emitter<FollowState> emit,
  ) async {
    emit(FollowLoading());
    try {
      final followings = await _followRepoistory.fetchFollowedUsers();
      emit(FollowSuccess(following: followings));
    } catch (e) {
      emit(FollowFailure(message: e.toString()));
    }
  }
}
