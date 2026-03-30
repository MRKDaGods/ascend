import 'package:ascend_app/features/networks/Repositories/user_search_repoistory.dart';
import 'package:ascend_app/features/networks/model/loaded_user_Profile.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

part 'user_search_event.dart';
part 'user_search_state.dart';

class UserSearchBloc extends Bloc<UserSearchEvent, UserSearchState> {
  final UserSearchRepoistory userRepository;
  List<LoadedUserProfile> _currentUsers = [];
  bool _canLoadMore = true;

  UserSearchBloc({required this.userRepository}) : super(UserSearchInitial()) {
    on<InitializeSearchEvent>(_onInitializeSearch);
    on<SearchUsersEvent>(_onSearchUsers);
    on<LoadMoreSearchResultsEvent>(_onLoadMoreResults);
    on<ClearSearchEvent>(_onClearSearch);
  }

  Future<void> _onInitializeSearch(
    InitializeSearchEvent event,
    Emitter<UserSearchState> emit,
  ) async {
    try {
      emit(UserSearchLoading());

      // Load some default users or recommendations
      final users = await userRepository.searchUsers(q: '', page: 1, limit: 10);
      _currentUsers = users;
      _canLoadMore = users.length >= 10;

      emit(UserSearchLoaded(users: users, canLoadMore: _canLoadMore));
    } catch (e) {
      emit(UserSearchError(e.toString()));
    }
  }

  Future<void> _onSearchUsers(
    SearchUsersEvent event,
    Emitter<UserSearchState> emit,
  ) async {
    try {
      emit(UserSearchLoading());

      // Fresh search resets pagination
      _currentUsers = [];

      final users = await userRepository.searchUsers(q: event.query);
      _currentUsers = users;

      _canLoadMore = users.length >= event.limit;

      emit(UserSearchLoaded(users: users, canLoadMore: _canLoadMore));
    } catch (e) {
      emit(UserSearchError(e.toString()));
    }
  }

  Future<void> _onLoadMoreResults(
    LoadMoreSearchResultsEvent event,
    Emitter<UserSearchState> emit,
  ) async {
    try {
      if (!_canLoadMore) return;

      final currentState = state;
      if (currentState is UserSearchLoaded) {
        final moreFriends = await userRepository.searchUsers(
          q: event.query,
          page: event.page,
          limit: event.limit,
        );

        if (moreFriends.isEmpty || moreFriends.length < (event.limit ?? 20)) {
          _canLoadMore = false;
        }

        // Add new users to the existing list
        _currentUsers = [..._currentUsers, ...moreFriends];

        emit(UserSearchLoaded(users: _currentUsers, canLoadMore: _canLoadMore));
      }
    } catch (e) {
      emit(UserSearchError(e.toString()));
    }
  }

  void _onClearSearch(ClearSearchEvent event, Emitter<UserSearchState> emit) {
    _currentUsers = [];
    _canLoadMore = true;
    emit(UserSearchInitial());
  }
}
