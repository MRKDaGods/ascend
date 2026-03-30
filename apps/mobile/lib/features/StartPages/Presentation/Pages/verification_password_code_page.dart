import 'package:ascend_app/core/routes/app_routes.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Logo/logo_widget.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class VerificationPasswordCodePage extends StatefulWidget {
  const VerificationPasswordCodePage({super.key});

  @override
  State<VerificationPasswordCodePage> createState() =>
      _VerificationPasswordCodePageState();
}

class _VerificationPasswordCodePageState
    extends State<VerificationPasswordCodePage> {
  late String maskedEmail;
  late String actualEmail;
  final TextEditingController _verificationCodeController =
      TextEditingController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Retrieve the email from the arguments
    final email = ModalRoute.of(context)?.settings.arguments as String?;

    if (email == null) {
      // Handle the case where no email is passed
      maskedEmail = "No email provided";
    } else {
      // Mask the email for display
      maskedEmail = _maskEmail(email);
    }

    actualEmail = email ?? '';
  }

  String _maskEmail(String email) {
    final parts = email.split('@');
    if (parts.length != 2) return email; // Return original if not a valid email
    final localPart = parts[0];
    final domain = parts[1];
    final maskedLocal =
        localPart.length > 2
            ? '${localPart[0]}*****${localPart[localPart.length - 1]}'
            : '*****';
    return '$maskedLocal@$domain';
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthVerificationCodeLoading) {
          // Show a loading indicator
          showDialog(
            context: context,
            barrierDismissible: false,
            builder:
                (context) => const Center(child: CircularProgressIndicator()),
          );
        } else if (state is AuthVerificationCodeSuccess) {
          // Dismiss the loading indicator and show success message
          Navigator.of(context).pop(); // Close the loading dialog
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.message)));

          // Navigate to ResetPasswordPage with the token
          Navigator.of(context).pushNamed(
            RouteNames.resetPasswordPage,
            arguments: {'token': state.token}, // Pass the token as an argument
          );
        } else if (state is AuthVerificationCodeFailure) {
          // Dismiss the loading indicator and show error message
          Navigator.of(context).pop(); // Close the loading dialog
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.error)));
        }
      },
      child: LayoutBuilder(
        builder: (context, constraints) {
          final screenHeight = constraints.maxHeight;

          return Scaffold(
            body: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        LogoWidget(height: screenHeight * 0.04, fontSize: 28),
                        SizedBox(height: screenHeight * 0.02),
                      ],
                    ),
                    SizedBox(height: screenHeight * 0.02),
                    const Text(
                      "Enter the 6-digit code",
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.01),
                    RichText(
                      text: TextSpan(
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 18,
                        ),
                        children: [
                          const TextSpan(text: 'Check '),
                          TextSpan(
                            text: maskedEmail,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const TextSpan(text: ' for a verification code. '),
                          WidgetSpan(
                            child: TextButton(
                              onPressed: () {
                                Navigator.pushReplacementNamed(
                                  context,
                                  '/forgotPasswordPage',
                                );
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero, // Remove padding
                                minimumSize: Size.zero, // Remove minimum size
                                tapTargetSize:
                                    MaterialTapTargetSize
                                        .shrinkWrap, // Shrink tap area
                              ),
                              child: const Text(
                                'Change',
                                style: TextStyle(
                                  color: Colors.blue,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.02),
                    TextField(
                      controller: _verificationCodeController,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      decoration: InputDecoration(
                        hintText: '6-digit code',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        counterText: '',
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.01),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: TextButton(
                        onPressed: () {
                          context.read<AuthBloc>().add(
                            ForgotPasswordRequested(emailOrPhone: actualEmail),
                          );
                        },
                        child: Text(
                          'Resend code',
                          style: TextStyle(
                            color: Colors.blue[700],
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.005),
                    SizedBox(
                      width: double.infinity,
                      height: screenHeight * 0.055,
                      child: ElevatedButton(
                        onPressed: () {
                          final verificationCode =
                              _verificationCodeController.text.trim();
                          if (verificationCode.isNotEmpty) {
                            context.read<AuthBloc>().add(
                              VerifyCodeSubmitted(
                                emailOrPhone: actualEmail,
                                verificationCode: verificationCode,
                              ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Please enter the verification code',
                                ),
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue[700],
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        child: const Text(
                          'Submit',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.02),
                    Text(
                      "If you don’t see the email in your inbox, check your spam folder. "
                      "If it’s not there, the email address may not be confirmed, or it may not match an existing LinkedIn account.",
                      style: TextStyle(color: Colors.grey[700]),
                    ),
                    SizedBox(height: screenHeight * 0.02),
                    GestureDetector(
                      onTap: () {},
                      child: Text(
                        "Can’t access this email?",
                        style: TextStyle(
                          color: Colors.blue[700],
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
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
}
