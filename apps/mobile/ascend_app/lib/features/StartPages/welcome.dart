import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/SignIn.dart';
import 'package:ascend_app/features/StartPages/Widget/ContinueButton.dart';

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {
  @override
  Widget build(BuildContext context) {
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
                    onPressed: () {},
                    backgroundColor: Colors.blue,
                    textColor: Colors.white,
                  ),
                  const SizedBox(height: 15),
                  buildOutlinedButton(
                    label: 'Continue with Google',
                    iconPath: 'assets/google.png',
                    onPressed: () {},
                  ),
                  const SizedBox(height: 15),
                  buildOutlinedButton(
                    label: 'Continue with Facebook',
                    iconPath: 'assets/facebook.png',
                    onPressed: () {},
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: buildTextButton(
                      label: 'Sign In',
                      onPressed: () {
                        Navigator.push(
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
