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
        final jobReports = await adminRepository.fetchJobReports(event.jobId, page: event.page);
        
        // Check if we're already in a ReportedJobsLoadedState
        if (state is ReportedJobsLoadedState) {
          final currentState = state as ReportedJobsLoadedState;
          
          // Create a copy of the current reports map
          final updatedReports = Map<int, List<JobReport>>.from(currentState.jobReports);
          
          // Update with the new reports
          updatedReports[event.jobId] = jobReports;
          
          // Emit a new state with updated reports
          emit(ReportedJobsLoadedState(
            reportedJobs: currentState.reportedJobs,
            jobReports: updatedReports,
          ));
        } else {
          // Fallback if we somehow get here without having loaded jobs first
          emit(JobReportsLoadedState(jobId: event.jobId, jobReports: jobReports));
        }
      } catch (e) {
        emit(JobsErrorState('Failed to load reports: ${e.toString()}'));
      }
    });

    // Handle DeleteJobEvent
    on<DeleteJobEvent>((event, emit) async {
      emit(ReportedJobsLoadingState());
      try {
        await adminRepository.deleteJob(int.parse(event.jobId));
        emit(JobDeletedState(event.jobId));
      } catch (e) {
        emit(JobsErrorState(e.toString()));
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
