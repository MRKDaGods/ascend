import 'package:ascend_app/features/Logo/LogoWidget.dart';
import 'package:ascend_app/features/StartPages/JoinAscend.dart';
import 'package:ascend_app/features/StartPages/Widget/InputWidgets.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart';
import 'package:ascend_app/features/StartPages/Widget/ContinueButton.dart';

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
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return const Joinascend();
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
                            padding: const EdgeInsets.symmetric(horizontal: 10),
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
                      Padding(
                        padding: const EdgeInsets.only(left: 0.0, bottom: 0.0),
                        child: CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          title: const Text('Remember me'),
                          value: _rememberMe,
                          onChanged: (bool? value) {
                            setState(() {
                              _rememberMe = value ?? false;
                            });
                          },
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
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
                        onPressed: () {
                          // Handle the email data
                          final email = _emailController.text;
                          if (InputValidators.isValidEmailOrPhone(email)) {
                            setState(() {
                              _emailError = '';
                            });
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) {
                                  return const MainNavigation();
                                },
                              ),
                            );
                          } else {
                            setState(() {
                              _emailError =
                                  'Email address or phone number is not valid';
                            });
                          }
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
    );
  }
}
