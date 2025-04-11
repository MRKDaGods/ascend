import 'package:ascend_app/features/Logo/LogoWidget.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/JoinAscend.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/InputWidgets.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/ContinueButton.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  bool _rememberMe = false;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _emailError = '';
  String _passwordError = '';

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _validatePassword(String password) {
    final error = InputValidators.validatePassword(password);
    setState(() {
      _passwordError = error ?? '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            if (state is AuthSuccess) {
              // Navigate to the main page after successful login
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const MainNavigation()),
              );
            } else if (state is AuthFailure) {
              // Show an error message if login fails
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text(state.error)));
            }
          },
          child: LayoutBuilder(
            builder: (context, constraints) {
              final screenWidth = constraints.maxWidth;
              final screenHeight = constraints.maxHeight;

              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: screenHeight),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const LogoWidget(height: 40, fontSize: 28),
                        SizedBox(height: screenHeight * 0.03),
                        const Text(
                          'Sign in',
                          style: TextStyle(
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) {
                                  return const JoinAscend();
                                },
                              ),
                            );
                          },
                          style: TextButton.styleFrom(
                            minimumSize: const Size(0, 0),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(4),
                            ),
                            textStyle: const TextStyle(fontSize: 24),
                            animationDuration: Duration.zero,
                            shadowColor: Colors.transparent,
                            elevation: 0,
                          ),
                          child: RichText(
                            text: const TextSpan(
                              children: [
                                TextSpan(
                                  text: 'or ',
                                  style: TextStyle(
                                    color: Colors.grey,
                                    fontSize: 16,
                                  ),
                                ),
                                TextSpan(
                                  text: ' Join Ascend',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(height: screenHeight * 0.03),
                        buildOutlinedButton(
                          onPressed: () {},
                          iconPath: 'assets/google.png',
                          label: 'Sign in with Google',
                        ),
                        SizedBox(height: screenHeight * 0.02),
                        buildOutlinedButton(
                          onPressed: () {},
                          iconPath: 'assets/apple-logo.png',
                          label: 'Sign in with Apple',
                        ),
                        SizedBox(height: screenHeight * 0.02),
                        buildOutlinedButton(
                          onPressed: () {},
                          iconPath: 'assets/facebook.png',
                          label: 'Sign in with Facebook',
                        ),
                        SizedBox(height: screenHeight * 0.05),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: screenWidth * 0.4,
                              child: Divider(color: Colors.grey, thickness: 1),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                              ),
                              child: Text(
                                'or',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Container(
                              width: screenWidth * 0.4,
                              child: Divider(color: Colors.grey, thickness: 1),
                            ),
                          ],
                        ),
                        SizedBox(height: screenHeight * 0.05),
                        CustomTextFormField(
                          controller: _emailController,
                          labelText: 'Email or Phone',
                          fieldId: "SignInEmail",
                          errorText: _emailError,
                        ),
                        SizedBox(height: screenHeight * 0.02),
                        CustomTextFormField(
                          controller: _passwordController,
                          labelText: 'Password',
                          fieldId: "SignInPassword",
                          errorText: _passwordError,
                          obscureText: true,
                          onChanged: _validatePassword,
                          onFieldSubmitted: _validatePassword,
                        ),
                        SizedBox(height: screenHeight * 0.01),
                        Row(
                          children: [
                            Checkbox(
                              value: _rememberMe,
                              onChanged: (value) {
                                setState(() {
                                  _rememberMe = value ?? false;
                                });
                              },
                            ),
                            const Text('Remember Me'),
                          ],
                        ),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: TextButton(
                            onPressed: () {
                              // Handle forgot password
                            },
                            style: TextButton.styleFrom(
                              animationDuration: Duration.zero,
                              shadowColor: Colors.transparent,
                              elevation: 0,
                            ),
                            child: const Text('Forgot password?'),
                          ),
                        ),
                        SizedBox(height: screenHeight * 0.01),
                        buildOutlinedButton(
                          onPressed: () async {
                            // Save the "Remember Me" flag
                            await SecureStorageHelper.setRememberMe(
                              _rememberMe,
                            );

                            final email = _emailController.text.trim();
                            final password = _passwordController.text.trim();

                            // Validate email and password inputs
                            if (!InputValidators.isValidEmailOrPhone(email)) {
                              setState(() {
                                _emailError = 'Invalid email or phone number';
                              });
                              return;
                            }

                            if (password.isEmpty) {
                              setState(() {
                                _passwordError = 'Password cannot be empty';
                              });
                              return;
                            }

                            // Clear previous errors
                            setState(() {
                              _emailError = '';
                              _passwordError = '';
                            });

                            // Dispatch SignInRequested event to AuthBloc
                            context.read<AuthBloc>().add(
                              SignInRequested(email: email, password: password),
                            );
                          },
                          label: 'Continue',
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
