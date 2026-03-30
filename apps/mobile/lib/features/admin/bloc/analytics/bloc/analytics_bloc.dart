import 'package:ascend_app/features/admin/repository/admin_repository.dart';
// ignore: depend_on_referenced_packages
import 'package:bloc/bloc.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';


part 'analytics_event.dart';
part 'analytics_state.dart';

class AnalyticsBloc extends Bloc<AnalyticsEvent, AnalyticsState> {
  final AdminRepository repository;

  AnalyticsBloc({required this.repository}) : super(AnalyticsInitial()) {
    on<FetchAnalyticsEvent>(_onFetchAnalytics);
  }

  /// Handles the FetchAnalyticsEvent.
  Future<void> _onFetchAnalytics(
    FetchAnalyticsEvent event,
    Emitter<AnalyticsState> emit,
  ) async {
    emit(AnalyticsLoading()); // Emit loading state

    try {
      // Fetch analytics data from the repository
      final analyticsData = await repository.fetchAnalytics(event.duration);

      // Emit loaded state with the fetched data
      emit(AnalyticsLoaded(analyticsData));
    } catch (e) {
      // Emit error state with the error message
      emit(AnalyticsError(e.toString()));
    }
  }
}
