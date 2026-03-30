part of 'jobs_bloc.dart';

@immutable
abstract class JobState {
  List<Object?> get props => [];
}

@immutable
abstract class JobsState extends JobState {
  @override
  List<Object?> get props => [];
}

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

  JobReportStatusUpdatedState({required this.reportId, required this.status});

  @override
  List<Object?> get props => [reportId, status];
}

final class JobsErrorState extends JobsState {
  final String message;

  JobsErrorState(this.message);
}

// Add the EndOfDataReachedState class
final class EndOfDataReachedState extends JobsState {}

// For deleting jobs
final class JobsDeletingState extends JobsState {}

// Add the UpdatingJobReportState class
final class UpdatingJobReportState extends JobsState {}

// Add this state class
final class JobReportUpdateFailedState extends JobsState {
  final String reportId;
  final String status;
  final String error;

  JobReportUpdateFailedState({
    required this.reportId,
    required this.status,
    required this.error,
  });

  @override
  List<Object?> get props => [reportId, status, error];
}
