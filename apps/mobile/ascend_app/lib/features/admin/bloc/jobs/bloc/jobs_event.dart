part of 'jobs_bloc.dart';

@immutable
sealed class JobsEvent {}

// Event to fetch all reported jobs
class FetchReportedJobsEvent extends JobsEvent {
   int page;
   bool isRefresh;

  FetchReportedJobsEvent({required this.page, this.isRefresh = false});
}

// Event to fetch reports for a specific job
class FetchJobReportsEvent extends JobsEvent {
   int jobId;
   int page;
  bool? isRefresh;

  FetchJobReportsEvent(this.jobId, {this.page = 1, this.isRefresh = false});
}

// Event to delete a specific job
class DeleteJobEvent extends JobsEvent {
  final String jobId;

  DeleteJobEvent(this.jobId);

  List<Object?> get props => [jobId];
}

// Event to update the status of a specific job report
class UpdateJobReportStatusEvent extends JobsEvent {
  final String reportId;
  final String status;

  UpdateJobReportStatusEvent(this.reportId, this.status);
}
