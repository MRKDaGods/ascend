import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

part 'jobs_event.dart';
part 'jobs_state.dart';

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final AdminRepository adminRepository;

  JobsBloc({required this.adminRepository}) : super(JobsInitial()) {
    // Handle FetchReportedJobsEvent
    on<FetchReportedJobsEvent>((event, emit) async {
      emit(ReportedJobsLoadingState());
      try {
        final reportedJobs = await adminRepository.fetchReportedJobs();
        final jobReports =
            <
              int,
              List<JobReport>
            >{}; // Initialize an empty map or fetch actual reports
        emit(
          ReportedJobsLoadedState(
            reportedJobs: reportedJobs,
            jobReports: jobReports,
          ),
        );
      } catch (e) {
        emit(JobsErrorState(e.toString()));
      }
    });

    // Handle FetchJobReportsEvent
    on<FetchJobReportsEvent>((event, emit) async {
      // Don't emit loading state here to avoid UI flickering
      try {
        final jobReports = await adminRepository.fetchJobReports(
          event.jobId,
          page: event.page,
        );

        // Check if we're already in a ReportedJobsLoadedState
        if (state is ReportedJobsLoadedState) {
          final currentState = state as ReportedJobsLoadedState;

          // Create a copy of the current reports map
          final updatedReports = Map<int, List<JobReport>>.from(
            currentState.jobReports,
          );

          // Update with the new reports
          updatedReports[event.jobId] = jobReports;

          // Emit a new state with updated reports
          emit(
            ReportedJobsLoadedState(
              reportedJobs: currentState.reportedJobs,
              jobReports: updatedReports,
            ),
          );
        } else {
          // Fallback if we somehow get here without having loaded jobs first
          emit(
            JobReportsLoadedState(jobId: event.jobId, jobReports: jobReports),
          );
        }
      } catch (e) {
        emit(JobsErrorState('Failed to load reports: ${e.toString()}'));
      }
    });

    // Handle DeleteJobEvent - Updated to use API endpoint format
    on<DeleteJobEvent>((event, emit) async {
      emit(JobsDeletingState()); // Using a more specific loading state
      try {
        // Store jobId before using it to avoid potential void result issues
        final jobId = event.jobId;

        // Call the API endpoint {{ADMIN_BASE}}/jobs/:jobId
        final success = await adminRepository.deleteJob(jobId.toString());

        if (success) {
          // Fixed: Use the constructor correctly based on how JobDeletedState is defined
          emit(JobDeletedState(jobId.toString()));
        } else {
          emit(
            JobsErrorState('Failed to delete job. Server returned an error.'),
          );
        }
      } catch (e) {
        emit(JobsErrorState('Failed to delete job: ${e.toString()}'));
      }
    });

    // Handle UpdateJobReportStatusEvent
    on<UpdateJobReportStatusEvent>((event, emit) async {
      emit(ReportedJobsLoadingState());
      try {
        await adminRepository.updateJobReportStatus(
          int.parse(event.reportId),
          event.status,
        );
        emit(JobReportStatusUpdatedState(event.reportId, event.status));
      } catch (e) {
        emit(JobsErrorState(e.toString()));
      }
    });
  }
}

// This should be moved to jobs_state.dart part file
// Make sure to add this if it doesn't exist
class JobsDeletingState extends JobsState {
  @override // Added missing override decorator
  List<Object?> get props => [];
}
