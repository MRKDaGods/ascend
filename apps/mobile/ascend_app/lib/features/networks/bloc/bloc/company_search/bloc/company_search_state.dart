part of 'company_search_bloc.dart';

abstract class CompanySearchState extends Equatable {
  const CompanySearchState();

  @override
  List<Object> get props => [];
}

final class CompanySearchInitial extends CompanySearchState {}

class CompanySearchLoading extends CompanySearchState {}

class CompanySearchLoaded extends CompanySearchState {
  final List<CompanyModel> companies;

  CompanySearchLoaded({required this.companies});

  CompanySearchLoaded copyWith({List<CompanyModel>? companies}) {
    return CompanySearchLoaded(companies: companies ?? this.companies);
  }

  @override
  List<Object> get props => [companies];
}

class CompanySearchError extends CompanySearchState {
  final String error;

  CompanySearchError({required this.error});

  @override
  List<Object> get props => [error];
}
