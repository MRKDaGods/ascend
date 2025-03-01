import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/Home/Event/search_event.dart';
import 'package:ascend_app/Home/States/search_state.dart';


class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchBloc() : super(SearchState(false)) {
    on<SearchTextChanged>((event, emit) {
      emit(SearchState(event.text.isNotEmpty));
    });
  }
}