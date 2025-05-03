part of 'jobs_bloc.dart';

@immutable
abstract class JobsState {}

final class JobsInitial extends JobsState {}

final class ReportedJobsInitialState extends JobsState {}

final class ReportedJobsLoadingState extends JobsState {}

final class ReportedJobsLoadedState extends JobsState {
  final List<ReportedJob> jobs;
  final bool hasReachedEnd;
  final Map<int, List<JobReport>> jobReports; // Keeping the existing property

  ReportedJobsLoadedState({
    required this.jobs,
    required this.hasReachedEnd,
    required this.jobReports,
  });
}

final class JobReportsLoadedState extends JobsState {
  final int jobId;
  final List<JobReport> jobReports;

  JobReportsLoadedState({required this.jobId, required this.jobReports});
}

final class JobDeletedState extends JobsState {
  final String jobId;

  JobDeletedState(this.jobId);

  @override
  List<Object?> get props => [jobId];
}

final class JobReportStatusUpdatedState extends JobsState {
  final String reportId;
  final String status;

  JobReportStatusUpdatedState(this.reportId, this.status);
}

final class JobsErrorState extends JobsState {
  final String message;

  JobsErrorState(this.message);
}

// New state for errors related to specific reported jobs
final class ReportedJobsErrorState extends JobsState {
  final String jobId;
  final String errorMessage;

  ReportedJobsErrorState({required this.jobId, required this.errorMessage});
}

// This should be moved to jobs_state.dart part file
// Make sure to add this if it doesn't exist
class JobsDeletingState extends JobsState {
  @override // Added missing override decorator
  List<Object?> get props => [];
}