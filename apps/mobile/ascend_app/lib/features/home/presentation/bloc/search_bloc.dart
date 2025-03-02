
import 'package:ascend_app/features/home/presentation/bloc/search_event.dart';
import 'package:ascend_app/features/home/presentation/bloc/search_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';



class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchBloc() : super(SearchState(false)) {
    on<SearchTextChanged>((event, emit) {
      emit(SearchState(event.text.isNotEmpty));
    });
  }
}