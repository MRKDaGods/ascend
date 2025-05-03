import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';

part 'posts_event.dart';
part 'posts_state.dart';

class PostsBloc extends Bloc<PostsEvent, PostsState> {
  final AdminApiClient apiClient;

  PostsBloc({required this.apiClient}) : super(PostsInitial()) {
    // Handle fetching reported posts
    on<FetchReportedPostsEvent>((event, emit) async {
      emit(FetchingReportedPostsState());
      try {
        final response = await apiClient.getReportedPosts(event.page);
        final reportedPosts = List<Map<String, dynamic>>.from(response['data']);
        final currentPage = response['currentPage'] ?? 1;
        final totalPages = response['totalPages'] ?? 1;

        emit(ReportedPostsFetchedState(
          reportedPosts: reportedPosts,
          currentPage: currentPage,
          totalPages: totalPages,
        ));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle fetching reports for a specific post
    on<FetchPostReportsEvent>((event, emit) async {
      emit(FetchingPostReportsState());
      try {
        final response = await apiClient.getPostReports(event.postId, event.page);
        final postReports = List<Map<String, dynamic>>.from(response['data']);
        final currentPage = response['currentPage'] ?? 1;
        final totalPages = response['totalPages'] ?? 1;

        emit(PostReportsFetchedState(
          postReports: postReports,
          currentPage: currentPage,
          totalPages: totalPages,
        ));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle deleting a post
    on<DeletePostEvent>((event, emit) async {
      emit(DeletingPostState());
      try {
        await apiClient.deletePost(event.postId);
        emit(PostDeletedState(postId: event.postId));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });

    // Handle updating a report
    on<UpdateReportStatusEvent>((event, emit) async {
      emit(UpdatingReportState());
      try {
        await apiClient.updateReport(event.reportId, event.data);
        emit(ReportUpdatedState(reportId: event.reportId));
      } catch (e) {
        emit(PostsErrorState(errorMessage: e.toString()));
      }
    });
  }
}