import 'package:ascend_app/features/Logo/LogoWidget.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/SignIn.dart';
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:url_launcher/url_launcher.dart';

class ResetPasswordPage extends StatefulWidget {
  final String token; // Add token parameter

  const ResetPasswordPage({Key? key, required this.token}) : super(key: key);

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;
  bool _requireAllDevices = true;

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthResetPasswordLoading) {
          _showLoading();
        } else if (state is AuthResetPasswordSuccess) {
          _showSuccess(state.message);
        } else if (state is AuthResetPasswordFailure) {
          _showError(state.error);
        }
      },
      child: LayoutBuilder(
        builder: (context, constraints) {
          final screenWidth = constraints.maxWidth;
          final screenHeight = constraints.maxHeight;

          return Scaffold(
            body: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Logo
                    Row(
                      children: [
                        LogoWidget(height: screenHeight * 0.04, fontSize: 28),
                        SizedBox(height: screenHeight * 0.02),
                      ],
                    ),
                    SizedBox(height: screenHeight * 0.02),

                    // Title
                    const Text(
                      "Choose a new password",
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.02),

                    // Subtitle with "What makes a strong password?" link
                    RichText(
                      text: TextSpan(
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                        children: [
                          const TextSpan(
                            text:
                                "To secure your account, choose a strong password you haven't used before and is at least 8 characters long. ",
                          ),
                          TextSpan(
                            text: "What makes a strong password?",
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.blue,
                              decoration: TextDecoration.underline,
                            ),
                            recognizer:
                                TapGestureRecognizer()
                                  ..onTap = () {
                                    launchUrl(
                                      Uri.parse(
                                        'https://www.linkedin.com/help/linkedin/answer/a1375084',
                                      ),
                                    );
                                  },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.03),

                    // New Password field
                    _buildPasswordField(
                      controller: _newPasswordController,
                      labelText: 'New password',
                      obscureText: _obscureNewPassword,
                      onToggleVisibility: () {
                        setState(() {
                          _obscureNewPassword = !_obscureNewPassword;
                        });
                      },
                    ),
                    const SizedBox(height: 20),

                    // Retype Password field
                    _buildPasswordField(
                      controller: _confirmPasswordController,
                      labelText: 'Retype new password',
                      obscureText: _obscureConfirmPassword,
                      onToggleVisibility: () {
                        setState(() {
                          _obscureConfirmPassword = !_obscureConfirmPassword;
                        });
                      },
                    ),
                    const SizedBox(height: 20),

                    // Checkbox
                    Row(
                      children: [
                        Checkbox(
                          value: _requireAllDevices,
                          onChanged: (value) {
                            setState(() {
                              _requireAllDevices = value ?? true;
                            });
                          },
                        ),
                        const Expanded(
                          child: Text(
                            "Require all devices to sign in with new password",
                            style: TextStyle(fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(40),
                          ),
                        ),
                        child: const Text(
                          "Submit",
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPasswordField({
    required TextEditingController controller,
    required String labelText,
    required bool obscureText,
    required VoidCallback onToggleVisibility,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      decoration: InputDecoration(
        labelText: labelText,
        suffixIcon: IconButton(
          icon: Icon(obscureText ? Icons.visibility : Icons.visibility_off),
          onPressed: onToggleVisibility,
        ),
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
    );
  }

  void _submit() {
    final newPassword = _newPasswordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();

    // Validate the fields in the UI
    if (newPassword.isEmpty || confirmPassword.isEmpty) {
      _showError("Please fill both fields");
      return;
    }

    if (newPassword.length < 2) {
      _showError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword != confirmPassword) {
      _showError("Passwords do not match");
      return;
    }

    // Dispatch the ResetPasswordRequested event without confirmPassword
    context.read<AuthBloc>().add(
      ResetPasswordRequested(
        token: widget.token, // Pass the token
        newPassword: newPassword, // Only send the new password
      ),
    );
  }

  void _showLoading() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Processing...")));
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));

    // Navigate to the SignInPage
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const SignInPage()),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }
}
