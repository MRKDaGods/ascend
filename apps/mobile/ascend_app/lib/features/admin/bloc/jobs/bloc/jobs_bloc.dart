import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';

part 'jobs_event.dart';
part 'jobs_state.dart';

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final AdminRepository adminRepository;
  int currentPage = 1;
  bool hasReachedEnd = false;
  List<ReportedJob> allJobs = [];
  Map<int, List<JobReport>> jobReports = {};

  JobsBloc({required this.adminRepository}) : super(JobsInitial()) {
    // Handle FetchReportedJobsEvent
    // In your FetchReportedJobsEvent handler
    on<FetchReportedJobsEvent>((event, emit) async {
      if (event.isRefresh) {
        currentPage = 1;
        allJobs.clear();
        hasReachedEnd = false;
      }

      if (hasReachedEnd && !event.isRefresh) return;

      if (event.page == 1) {
        emit(ReportedJobsLoadingState());
      }

      try {
        final newJobs = await adminRepository.fetchReportedJobs(
          page: event.page,
        );

        if (newJobs.isEmpty) {
          hasReachedEnd = true;

          // Emit regular state with current jobs
          emit(
            ReportedJobsLoadedState(
              jobs: allJobs,
              hasReachedEnd: true,
              jobReports: jobReports,
            ),
          );

          // Then emit the end of data state to trigger snackbar
          if (allJobs.isNotEmpty) {
            emit(EndOfDataReachedState());
            // Immediately re-emit the loaded state to keep UI showing jobs
            emit(
              ReportedJobsLoadedState(
                jobs: allJobs,
                hasReachedEnd: true,
                jobReports: jobReports,
              ),
            );
          }
        } else {
          currentPage++;
          allJobs.addAll(newJobs);

          emit(
            ReportedJobsLoadedState(
              jobs: allJobs,
              hasReachedEnd: hasReachedEnd,
              jobReports: jobReports,
            ),
          );
        }
      } catch (e) {
        // Instead of showing error page, just emit error state for Snackbar
        // and keep the current jobs list
        emit(JobsErrorState(e.toString()));

        // Re-emit the current state to keep UI showing jobs
        emit(
          ReportedJobsLoadedState(
            jobs: allJobs,
            hasReachedEnd: hasReachedEnd,
            jobReports: jobReports,
          ),
        );
      }
    });

    // Handle FetchJobReportsEvent
    on<FetchJobReportsEvent>((event, emit) async {
      // Don't emit loading state here to avoid UI flickering
      try {
        final jobReportsResult = await adminRepository.fetchJobReports(
          event.jobId,
          page: event.page,
        );

        // Check if we're already in a ReportedJobsLoadedState
        if (state is ReportedJobsLoadedState) {
          // Create a copy of the current reports map
          final updatedReports = Map<int, List<JobReport>>.from(jobReports);

          // Update with the new reports
          updatedReports[event.jobId] = jobReportsResult;

          // Update the class variable
          jobReports = updatedReports;

          // Emit a new state with updated reports
          emit(
            ReportedJobsLoadedState(
              jobs: allJobs,
              hasReachedEnd: hasReachedEnd,
              jobReports: jobReports,
            ),
          );
        } else {
          // Fallback if we somehow get here without having loaded jobs first
          emit(
            JobReportsLoadedState(
              jobId: event.jobId,
              jobReports: jobReportsResult,
            ),
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
          // Remove the deleted job from our local list if it exists
          allJobs.removeWhere((job) => job.jobId.toString() == jobId);

          // Fixed: Use the constructor correctly based on how JobDeletedState is defined
          emit(JobDeletedState(jobId.toString()));

          // Update the state to reflect the removed job
          emit(
            ReportedJobsLoadedState(
              jobs: allJobs,
              hasReachedEnd: hasReachedEnd,
              jobReports: jobReports,
            ),
          );
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
      emit(UpdatingJobReportState()); // You may need to create this state
      try {
        // Make the API request to update the report status
        debugPrint(
          'Updating job report ${event.reportId} status to ${event.status}',
        );

        final response = await adminRepository.updateJobReportStatus(
          int.parse(event.reportId),
          event.status,
        );

        // Emit success state
        emit(
          JobReportStatusUpdatedState(
            reportId: event.reportId,
            status: event.status,
          ),
        );

        // Update the local cache if needed
        // This depends on how you're storing job reports

        // Re-emit the main state to update UI
        emit(
          ReportedJobsLoadedState(
            jobs: allJobs,
            hasReachedEnd: hasReachedEnd,
            jobReports: jobReports,
          ),
        );
      } catch (e) {
        debugPrint('Error updating job report status: $e');
        emit(JobsErrorState(e.toString()));
      }
    });

    // Handle UpdateJobReportStatus
    on<UpdateJobReportStatus>((event, emit) async {
      emit(UpdatingJobReportState());
      try {
        // Make the API request to update the report status
        debugPrint(
          'Updating job report ${event.reportId} status to ${event.status}',
        );

        // Use the AdminRepository instead of direct HTTP client
        final success = await adminRepository.updateJobReportStatus(
          int.parse(event.reportId),
          event.status,
        );

        if (success) {
          // Emit success state
          emit(
            JobReportStatusUpdatedState(
              reportId: event.reportId,
              status: event.status,
            ),
          );

          // Update the report status in local cache
          bool reportUpdated = false;

          for (var entry in jobReports.entries) {
            final jobId = entry.key;
            final reports = entry.value;

            for (int i = 0; i < reports.length; i++) {
              if (reports[i].id.toString() == event.reportId) {
                // Update report using copyWith for better immutability
                jobReports[jobId]![i] = reports[i].copyWith(
                  status: event.status,
                );
                reportUpdated = true;
                break;
              }
            }
            if (reportUpdated) break;
          }

          // Re-emit the main state to update UI
          emit(
            ReportedJobsLoadedState(
              jobs: allJobs,
              hasReachedEnd: hasReachedEnd,
              jobReports: jobReports,
            ),
          );
        } else {
          throw Exception('Failed to update report status');
        }
      } catch (e) {
        debugPrint('Error updating job report status: $e');

        // Emit a specific "update failed" state that can be handled more gracefully
        emit(
          JobReportUpdateFailedState(
            reportId: event.reportId,
            status: event.status,
            error: e.toString(),
          ),
        );

        // After a short delay, go back to the loaded state to maintain UI consistency
        await Future.delayed(const Duration(seconds: 1));

        // Re-emit the main state to keep UI consistent
        emit(
          ReportedJobsLoadedState(
            jobs: allJobs,
            hasReachedEnd: hasReachedEnd,
            jobReports: jobReports,
          ),
        );
      }
    });
  }
}
