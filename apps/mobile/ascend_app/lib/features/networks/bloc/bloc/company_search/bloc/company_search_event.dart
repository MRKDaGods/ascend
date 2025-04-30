part of 'company_search_bloc.dart';

abstract class CompanySearchEvent extends Equatable {
  const CompanySearchEvent();

  @override
  List<Object> get props => [];
}

class CompanySearchStarted extends CompanySearchEvent {}

class CompanySearchQueryChanged extends CompanySearchEvent {
  final String query;

  const CompanySearchQueryChanged({required this.query});

  @override
  List<Object> get props => [query];
}
