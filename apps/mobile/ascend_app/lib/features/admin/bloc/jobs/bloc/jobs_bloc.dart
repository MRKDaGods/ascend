import 'package:ascend_app/features/admin/data/models/jobs_model.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

part 'jobs_event.dart';
part 'jobs_state.dart';

class JobsBloc extends Bloc<JobsEvent, JobsState> {
  final AdminRepository adminRepository;
  int currentPage = 1;
  bool hasReachedEnd = false;
  List<JobModel> allJobs = [];
  Map<int, List<JobReport>> jobReports = {};

  JobsBloc({required this.adminRepository}) : super(JobsInitial()) {
    // Handle FetchReportedJobsEvent
    on<FetchReportedJobsEvent>((event, emit) async {
      if (event.isRefresh) {
        currentPage = 1;
        allJobs.clear();
        hasReachedEnd = false;
      }

      if (hasReachedEnd && !event.isRefresh) return;

      emit(ReportedJobsLoadingState());

      try {
        final newJobs = await adminRepository.fetchReportedJobs(page: event.page);

        if (newJobs.isEmpty) {
          hasReachedEnd = true;
        } else {
          currentPage++;
          allJobs.addAll(newJobs);
        }

        emit(
          ReportedJobsLoadedState(
            jobs: allJobs,
            hasReachedEnd: hasReachedEnd,
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
            JobReportsLoadedState(jobId: event.jobId, jobReports: jobReportsResult),
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
          allJobs.removeWhere((job) => job.id.toString() == jobId);
          
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
      emit(ReportedJobsLoadingState());
      try {
        await adminRepository.updateJobReportStatus(
          int.parse(event.reportId),
          event.status,
        );
        emit(JobReportStatusUpdatedState(event.reportId, event.status));
        
        // After successful update, refresh the current state
        emit(
          ReportedJobsLoadedState(
            jobs: allJobs,
            hasReachedEnd: hasReachedEnd,
            jobReports: jobReports,
          ),
        );
      } catch (e) {
        emit(JobsErrorState(e.toString()));
      }
    });
  }
}

