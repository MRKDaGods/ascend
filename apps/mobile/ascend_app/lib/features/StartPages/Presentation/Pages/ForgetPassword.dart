import 'package:ascend_app/features/Logo/LogoWidget.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/InputWidgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class forgotPasswordPage extends StatefulWidget {
  forgotPasswordPage({super.key});

  @override
  State<forgotPasswordPage> createState() => _forgotPasswordPageState();
}

class _forgotPasswordPageState extends State<forgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  String _emailError = '';

  final TextEditingController _emailPhoneController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          // Show a loading indicator
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (_) => const Center(child: CircularProgressIndicator()),
          );
        } else if (state is AuthForgetPasswordSuccess) {
          // Hide loading indicator and show success message
          Navigator.pop(context); // Close the loading dialog
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.message)));
        } else if (state is AuthForgetPasswordFaliure) {
          // Hide loading indicator and show error message
          Navigator.pop(context); // Close the loading dialog
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.error)));
        }
      },
      child: LayoutBuilder(
        builder: (context, constraints) {
          final screenWidth = constraints.maxWidth;
          final screenHeight = constraints.maxHeight;

          return Scaffold(
            body: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // LinkedIn Logo (you can use an image here instead)
                    Row(
                      children: [
                        const LogoWidget(height: 40, fontSize: 28),
                        SizedBox(height: screenHeight * 0.03),
                      ],
                    ),

                    const SizedBox(height: 32),

                    const Text(
                      "Forgot password",
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),

                    CustomTextFormField(
                      controller: _emailPhoneController,
                      labelText: 'Email or Phone',
                      fieldId: "ForgotPasswordEmail",
                      errorText: _emailError,
                      onChanged: (value) {
                        if (InputValidators.isValidEmailOrPhone(value.trim())) {
                          setState(() {
                            _emailError =
                                ''; // Clear the error message if the input is valid
                          });
                        }
                      },
                    ),

                    const SizedBox(height: 16),

                    const Text(
                      "We’ll send a verification code to this email or phone number if it matches an existing LinkedIn account.",
                      style: TextStyle(fontSize: 18, color: Colors.black87),
                    ),
                    const SizedBox(height: 42),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          if (!InputValidators.isValidEmailOrPhone(
                            _emailPhoneController.text.trim(),
                          )) {
                            setState(() {
                              _emailError = 'Invalid email';
                            });
                            return;
                          }

                          if (_formKey.currentState!.validate()) {
                            // Dispatch the ForgotPasswordRequested event
                            context.read<AuthBloc>().add(
                              ForgotPasswordRequested(
                                emailOrPhone: _emailPhoneController.text.trim(),
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(40),
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          "Next",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
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
