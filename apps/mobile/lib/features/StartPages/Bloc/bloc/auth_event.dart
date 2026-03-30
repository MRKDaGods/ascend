import 'package:equatable/equatable.dart';
import 'package:firebase_auth/firebase_auth.dart';

abstract class AuthEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class SignInRequested extends AuthEvent {
  final String email;
  final String password;

  SignInRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class SignUpRequested extends AuthEvent {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  SignUpRequested({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });

  @override
  List<Object?> get props => [email, password, firstName, lastName];
}

class ForgotPasswordRequested extends AuthEvent {
  final String emailOrPhone;

  ForgotPasswordRequested({required this.emailOrPhone});

  @override
  List<Object?> get props => [emailOrPhone];
}

class VerifyCodeSubmitted extends AuthEvent {
  final String emailOrPhone;
  final String verificationCode;

  VerifyCodeSubmitted({
    required this.emailOrPhone,
    required this.verificationCode,
  });

  @override
  List<Object?> get props => [emailOrPhone, verificationCode];
}

class ResetPasswordRequested extends AuthEvent {
  final String token;
  final String newPassword;

  ResetPasswordRequested({required this.token, required this.newPassword});

  @override
  List<Object?> get props => [newPassword];
}

class SignOutRequested extends AuthEvent {}

class AuthTokenUpdated extends AuthEvent {
  final String token;

  AuthTokenUpdated({required this.token});

  @override
  List<Object?> get props => [token];
}

class GoogleSignInRequested extends AuthEvent {
  final User? user;
  final String? tokenId;

  GoogleSignInRequested({this.user, this.tokenId});

  @override
  List<Object?> get props => [user, tokenId];
}
