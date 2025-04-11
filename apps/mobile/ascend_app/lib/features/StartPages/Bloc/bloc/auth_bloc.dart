import 'package:ascend_app/features/StartPages/repository/ApiClient.dart';
import 'package:logger/logger.dart';
import 'package:bloc/bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Repository/auth_repository.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  final ApiClient apiClient;
  final _logger = Logger();

  AuthBloc({required this.authRepository, required this.apiClient})
    : super(AuthInitial()) {
    on<SignInRequested>(_onSignInRequested);
    on<SignUpRequested>(_onSignUpRequested);
    on<SignOutRequested>(_onSignOutRequested);
  }

  // Handle Sign-In
  Future<void> _onSignInRequested(
    SignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await authRepository.login(event.email, event.password);

      emit(AuthSuccess(token: response['token']));
    } catch (error) {
      _logger.e('SignIn failed: $error');
      emit(AuthFailure(error: error.toString()));
    }
  }

  // Handle Sign-Up
  Future<void> _onSignUpRequested(
    SignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await authRepository.signUp(
        email: event.email,
        password: event.password,
        firstName: event.firstName,
        lastName: event.lastName,
      );

      _logger.i('SignUp successful: ${response.token}'); // Logging the success

      // Save token and user data in SecureStorageHelper
      await SecureStorageHelper.setAuthToken(response.token);
      await SecureStorageHelper.setUserId(response.userId);

      emit(AuthSuccess(token: response.token));
    } catch (error) {
      _logger.e('SignUp failed: $error'); // Log the error
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
}
