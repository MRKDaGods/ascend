import 'dart:convert';

import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:logger/logger.dart';
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

    // Add this to the constructor to handle ResetPasswordRequested
    on<ResetPasswordRequested>(_onResetPasswordRequested);

    // Add this to the constructor to handle the new event
    on<VerifyCodeSubmitted>(_onVerifyCodeSubmitted);

    on<AuthTokenUpdated>(_onAuthTokenUpdated);

    FirebaseMessaging.instance.onTokenRefresh.listen((token) async {
      _logger.i('[XAUTH] Firebase token refreshed: $token');

      if (state is AuthSuccess) {
        _logger.i("[XAUTH] Sending token to server");

        try {
          final res = await apiClient.post(
            "/auth/fcm-token",
            data: {"fcm_token": token},
          );
          _logger.i("[XAUTH] Token sent successfully: ${res.body}");
        } catch (e) {
          _logger.e("[XAUTH] Error sending token: $e");
        }
      }
    });
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

  Future<void> _onAuthTokenUpdated(
    AuthTokenUpdated event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      _logger.i('Auth token updated successfully: ${event.token}');
      emit(AuthSuccess(token: event.token, signUpMode: false));

      // Get fcm
      try {
        final token = await FirebaseMessaging.instance.getToken();
        _logger.i('[XAUTH] Firebase token: $token');
        if (token != null) {
          await sl.apiClient.post(
            "/auth/fcm-token",
            data: {"fcm_token": token},
          );
        } else {
          _logger.e('Firebase token is null');
        }
      } catch (e) {
        _logger.e('Error getting Firebase token: $e');
      }
    } catch (error) {
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
      final res = await sl.apiClient.post(
        "/auth/forget-password",
        data: {"email": event.emailOrPhone, "send_code": true},
      );

      final response = jsonDecode(res.body);
      emit(AuthForgetPasswordSuccess(message: response['message']));
    } catch (error) {
      _logger.e('ForgotPassword failed: $error'); // Log the error
      emit(AuthForgetPasswordFaliure(error: error.toString()));
    }
  }

  // Add the new method to handle ResetPasswordRequested

  // Add the new method to handle VerifyCodeSubmitted
  Future<void> _onVerifyCodeSubmitted(
    VerifyCodeSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthVerificationCodeLoading());
    try {
      debugPrint("xemail: ${event.emailOrPhone}");
      // Call the repository method to verify the code
      await sl.apiClient.post(
        "/auth/verify-code",
        data: {
          "code": int.parse(event.verificationCode),
          "xemail": event.emailOrPhone,
        },
      );

      emit(
        AuthVerificationCodeSuccess(
          token: "${event.emailOrPhone}~${event.verificationCode}",
          message: "Code verified successfully!",
        ),
      );
    } catch (error) {
      _logger.e('Verification failed: $error'); // Log the error
      emit(AuthVerificationCodeFailure(error: error.toString()));
    }
  }

  Future<void> _onResetPasswordRequested(
    ResetPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthResetPasswordLoading());
    try {
      final xemail = event.token.split("~")[0];
      final code = event.token.split("~")[1];

      final res = await sl.apiClient.post(
        "/auth/reset-password",
        data: {
          "code": code,
          "xemail": xemail,
          "new_password": event.newPassword,
        },
      );
      final response = jsonDecode(res.body);
      final message = response['message'] ?? "Password reset successfully!";

      emit(AuthResetPasswordSuccess(message: message));
      // Log the full response for debugging
      _logger.i('Reset Password Response: $message');
    } catch (error) {
      _logger.e('Password reset failed: $error'); // Log the error
      emit(AuthResetPasswordFailure(error: error.toString()));
    }
  }
}
