import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:ascend_app/features/networks/model/company_model.dart';
import 'package:ascend_app/features/networks/repositories/company_repository.dart';
import 'package:flutter/material.dart';

part 'company_search_event.dart';
part 'company_search_state.dart';

class CompanySearchBloc extends Bloc<CompanySearchEvent, CompanySearchState> {
  final CompanyRepository _companyRepository = MockCompanyRepository();

  CompanySearchBloc() : super(CompanySearchInitial()) {
    on<CompanySearchStarted>(_onSearchStarted);
    on<CompanySearchQueryChanged>(_onQueryChanged);
  }

  void _onSearchStarted(
    CompanySearchStarted event,
    Emitter<CompanySearchState> emit,
  ) async {
    try {
      emit(CompanySearchLoading());
      final companies = await _companyRepository.getAllCompanies();
      if (companies.isEmpty) {
        emit(CompanySearchError(error: "No companies found"));
        return;
      } else
        emit(CompanySearchLoaded(companies: companies));
    } catch (e) {
      emit(CompanySearchError(error: e.toString()));
    }
  }

  void _onQueryChanged(
    CompanySearchQueryChanged event,
    Emitter<CompanySearchState> emit,
  ) async {
    try {
      emit(CompanySearchLoading());
      final companies =
          event.query.isEmpty
              ? await _companyRepository.getAllCompanies()
              : await _companyRepository.searchCompanies(event.query);
      emit(CompanySearchLoaded(companies: companies));
    } catch (e) {
      emit(CompanySearchError(error: e.toString()));
    }
  }
}
