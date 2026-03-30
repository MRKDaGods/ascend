part of 'jobs_bloc.dart';

@immutable
sealed class JobsEvent {
  List<Object?> get props => [];
}

// Event to fetch all reported jobs
class FetchReportedJobsEvent extends JobsEvent {
   final int page;
   final bool isRefresh;

  FetchReportedJobsEvent({required this.page, this.isRefresh = false});
}

// Event to fetch reports for a specific job
class FetchJobReportsEvent extends JobsEvent {
   final int jobId;
   final int page;
   final bool? isRefresh;

  FetchJobReportsEvent(this.jobId, {this.page = 1, this.isRefresh = false});
}

// Event to delete a specific job
class DeleteJobEvent extends JobsEvent {
  final String jobId;

  DeleteJobEvent(this.jobId);

  @override
  List<Object?> get props => [jobId];
}

// Event to update the status of a specific job report
class UpdateJobReportStatusEvent extends JobsEvent {
  final String reportId;
  final String status;

  UpdateJobReportStatusEvent(this.reportId, this.status);
}

// Event to update the status of a specific job report
class UpdateJobReportStatus extends JobsEvent {
  final String reportId;
  final String status;

  UpdateJobReportStatus({required this.reportId, required this.status});
  
  @override
  List<Object?> get props => [reportId, status];
}
