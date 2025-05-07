import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/join_ascend.dart';
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/sign_in.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/continue_button.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:flutter_bloc/flutter_bloc.dart'; // Import SecureStorageHelper

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _checkAuthenticationStatus();
  }

  Future<void> _checkAuthenticationStatus() async {
    final isFirstTimeUser = await SecureStorageHelper.isFirstTimeUser();
    final authToken = await SecureStorageHelper.getAuthToken();
    final rememberMe = await SecureStorageHelper.getRememberMe();

    if (authToken != null && authToken.isNotEmpty && rememberMe) {
      // ammar magnus was here wmsh mabsooot
      // inline
      if ((await sl.apiClient.get("/user/profile")).statusCode == 200) {
        // ignore: use_build_context_synchronously
        context.read<AuthBloc>().add(AuthTokenUpdated(token: authToken));
        // Navigate to Home if the user is authenticated and "Remember Me" is enabled
        Navigator.pushReplacement(
          // ignore: use_build_context_synchronously
          context,
          MaterialPageRoute(builder: (context) => const MainNavigation()),
        );
      } else {
        await SecureStorageHelper.clearAll();
        await SecureStorageHelper.setFirstTimeUser(true);

        Navigator.pushReplacement(
          // ignore: use_build_context_synchronously
          context,
          MaterialPageRoute(builder: (context) => const SignInPage()),
        );
      }
    } else if (isFirstTimeUser == true) {
      // Stay on the Welcome page
      setState(() {
        _loading = false;
      });
    } else {
      // Navigate to Sign In if not a first-time user
      Navigator.pushReplacement(
        // ignore: use_build_context_synchronously
        context,
        MaterialPageRoute(builder: (context) => const SignInPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        body: Center(
          // loading
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(width: 10),
              const Text("Checking your credentials..."),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('assets/logo/logo13.png', height: 40),
                      const Text(
                        'Ascend',
                        style: TextStyle(
                          fontSize: 35,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Build your network',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.normal,
                      color: Colors.grey[800],
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  buildTextButton(
                    label: 'Join Now',
                    onPressed: () async {
                      await SecureStorageHelper.setFirstTimeUser(
                        false,
                      ); // Mark as not first-time user
                      Navigator.push(
                        // ignore: use_build_context_synchronously
                        context,
                        MaterialPageRoute(
                          builder: (context) {
                            return const JoinAscend();
                          },
                        ),
                      );
                    },
                    backgroundColor: Colors.blue,
                    textColor: Colors.white,
                  ),
                  const SizedBox(height: 15),
                  buildOutlinedButton(
                    label: 'Continue with Google',
                    iconPath: 'assets/google.png',
                    onPressed: () async {
                      try {
                        // Initialize Google Sign In for mobile
                        final GoogleSignIn googleSignIn = GoogleSignIn();
                        final GoogleSignInAccount? googleUser =
                            await googleSignIn.signIn();

                        if (googleUser != null) {
                          // Obtain auth details from request
                          final GoogleSignInAuthentication googleAuth =
                              await googleUser.authentication;

                          // Create new credential for Firebase
                          final credential = GoogleAuthProvider.credential(
                            accessToken: googleAuth.accessToken,
                            idToken: googleAuth.idToken,
                          );

                          // Sign in with Firebase using the credential
                          final UserCredential userCredential =
                              await FirebaseAuth.instance.signInWithCredential(
                                credential,
                              );

                          final User? user = userCredential.user;

                          if (user != null) {
                            final idToken = await user.getIdToken();

                            context.read<AuthBloc>().add(
                              GoogleSignInRequested(
                                user: user,
                                tokenId: idToken,
                              ),
                            );
                          }
                        }
                      } catch (e) {
                        debugPrint('Google Sign-In error: $e');
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              'Failed to sign in with Google: ${e.toString()}',
                            ),
                          ),
                        );
                      }
                    },
                  ),
                  const SizedBox(height: 15),
                  buildOutlinedButton(
                    label: 'Continue with Facebook',
                    iconPath: 'assets/facebook.png',
                    onPressed: () async {
                      await SecureStorageHelper.setFirstTimeUser(
                        false,
                      ); // Mark as not first-time user
                      // Add Facebook sign-in logic here
                    },
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: buildTextButton(
                      label: 'Sign In',
                      onPressed: () async {
                        await SecureStorageHelper.setFirstTimeUser(
                          false,
                        ); // Mark as not first-time user
                        Navigator.push(
                          // ignore: use_build_context_synchronously
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return const SignInPage();
                            },
                          ),
                        );
                      },
                      backgroundColor: Colors.transparent,
                      textColor: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
