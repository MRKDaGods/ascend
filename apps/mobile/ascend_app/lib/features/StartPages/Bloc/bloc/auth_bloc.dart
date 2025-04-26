import 'dart:convert';
import 'package:ascend_app/features/StartPages/Model/auth_response.dart';
import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'package:logger/logger.dart';
import 'package:bloc/bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/repository/auth_repository.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  final ApiClient apiClient;
  final _logger = Logger();

  // Flag to track whether the current operation is a sign-up
  bool signUpMode = false;

  AuthBloc({required this.authRepository, required this.apiClient})
    : super(AuthInitial()) {
    _logger.i('AuthBloc initializeddddddddddddd');
    on<SignInRequested>(_onSignInRequested);
    on<SignUpRequested>(_onSignUpRequested);
    on<SignOutRequested>(_onSignOutRequested);
    on<ForgotPasswordRequested>(_onForgotPasswordRequested);
  }
  // Handle Sign-In
  Future<void> _onSignInRequested(
    SignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      signUpMode = false; // Set sign-up mode to false for sign-in
      final response = await authRepository.login(event.email, event.password);

      // Always update the auth token in secure storage
      await SecureStorageHelper.setAuthToken(response['token']);
      await SecureStorageHelper.saveEmail(event.email);
      await SecureStorageHelper.setPassword(event.password);

      // Validate the token
      if (response['token'] == null || response['token'].isEmpty) {
        throw Exception("Authentication token not found.");
      }

      final savedToken = await SecureStorageHelper.getAuthToken();
      _logger.i('Token after saving: $savedToken');
      _logger.i('SignIn successful: ${response['token']}'); // Log success

      emit(AuthSuccess(token: response['token'], signUpMode: false));
    } catch (error) {
      _logger.e('SignIn failed: $error'); // Log the error
      emit(AuthFailure(error: error.toString()));
    }
  }

  // Handle Sign-Up
  Future<void> _onSignUpRequested(
    SignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    _logger.i('Handling SignUpRequested event');
    emit(AuthLoading());
    try {
      final signUpMode = true; // Set sign-up mode to true for sign-up
      // Call the signUp method and get the AuthResponse object
      final responseData = await authRepository.signUp(
        firstName: event.firstName,
        lastName: event.lastName,
        email: event.email,
        password: event.password,
      );

      // Access properties of the AuthResponse object
      final userId = responseData.userId; // Access userId directly
      final email = responseData.email; // Access email directly

      _logger.i('SignUp successful for $email (User ID: $userId)');
      _logger.i('signUpMode ISSSSSSS: $signUpMode'); // Log success

      // Emit AuthSuccess to indicate successful sign-up
      emit(AuthSuccess(token: "", signUpMode: true));
    } catch (error) {
      _logger.e('SignUp failed: $error');
      emit(AuthFailure(error: error.toString()));
    }
  }

  // Handle Sign-Out
  Future<void> _onSignOutRequested(
    SignOutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      // Clear all stored data
      await SecureStorageHelper.clearAll();
      _logger.i('SignOut successful'); // Logging the success
      emit(AuthSignedOut());
    } catch (error) {
      _logger.e('SignOut failed: $error'); // Log the error
      emit(AuthFailure(error: error.toString()));
    }
  }

  // Handle Forgot Password
  Future<void> _onForgotPasswordRequested(
    ForgotPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await authRepository.forgotPassword(event.emailOrPhone);
      if (response['success'] == true) {
        emit (
          AuthForgetPasswordSuccess(message: response['message']),
        );
      } else {
        emit (
          AuthForgetPasswordFaliure(error: response['message']),
        );
      }
      } catch (error) {
        _logger.e('ForgotPassword failed: $error'); // Log the error
        emit (
          AuthForgetPasswordFaliure(error: error.toString()),
        );
    }
  }
}
