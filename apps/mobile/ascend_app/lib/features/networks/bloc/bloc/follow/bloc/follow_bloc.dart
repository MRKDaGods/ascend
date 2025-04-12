import 'dart:math';

import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/Repositories/follow_repoistory.dart';
import 'package:ascend_app/features/networks/model/followed_user.dart';
import 'package:ascend_app/features/networks/model/user_suggested_to_follow.dart';

part 'follow_event.dart';
part 'follow_state.dart';

class FollowBloc extends Bloc<FollowEvent, FollowState> {
  final FollowRepoistory followRepoistory = FollowRepoistory();
  FollowBloc() : super(FollowInitial()) {
    on<FetchFollowing>(_fetchfollowings);
    on<FollowUser>(_addfollowing);
    on<UnfollowUser>(_deletefollowing);
  }

  void _addfollowing(FollowUser event, Emitter<FollowState> emit) async {
    emit(FollowLoading());
    try {
      followRepoistory.addFollowingRepoistory(event.userId);
      add(FetchFollowing());
    } catch (e) {
      emit(FollowFailure(message: e.toString()));
    }
  }

  void _deletefollowing(UnfollowUser event, Emitter<FollowState> emit) {
    emit(FollowLoading());
    try {
      followRepoistory.deleteFollowingRepoistory(event.userId);
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
      final followings = await followRepoistory.fetchFollowersRepoistory();
      final suggestedUsers =
          await followRepoistory.fetchSuggestedUsersRepoistory();
      emit(
        FollowSuccess(following: followings, suggestedUsers: suggestedUsers),
      );
    } catch (e) {
      emit(FollowFailure(message: e.toString()));
    }
  }
}
