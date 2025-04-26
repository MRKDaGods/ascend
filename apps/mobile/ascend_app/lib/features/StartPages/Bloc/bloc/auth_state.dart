import 'package:equatable/equatable.dart';

abstract class AuthState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final String? token;
  final bool signUpMode; // Default to false for sign-in

  AuthSuccess({this.token, required this.signUpMode});

  @override
  List<Object?> get props => [token, signUpMode];
}

class AuthFailure extends AuthState {
  final String error;

  AuthFailure({required this.error});

  @override
  List<Object?> get props => [error];
}

class AuthSignedOut extends AuthState {}

class AuthForgetPasswordSuccess extends AuthState {
  final String message;

  AuthForgetPasswordSuccess({required this.message});

  @override
  List<Object?> get props => [message];
}

class AuthForgetPasswordFaliure extends AuthState {
  final String error;

  AuthForgetPasswordFaliure({required this.error});

  @override
  List<Object?> get props => [error];
}
