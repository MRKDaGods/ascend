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
      debugPrint('Fetching reports for jobId: ${event.jobId}'); // Log the jobId
      emit(ReportedJobsLoadingState());
      try {
        final jobReports = await adminRepository.fetchJobReports(
          event.jobId,
          page: event.page,
        );

        // Debug the fetched reports
        debugPrint(
          'Fetched ${jobReports.length} reports for jobId: ${event.jobId}',
        );
        for (var report in jobReports) {
          debugPrint(
            'Report: ${report.reporterFullName}, Reason: ${report.reason}',
          );
        }

        emit(JobReportsLoadedState(jobId: event.jobId, jobReports: jobReports));
      } catch (e) {
        debugPrint('Error fetching reports for jobId: ${event.jobId} - $e');
        emit(JobsErrorState(e.toString()));
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
