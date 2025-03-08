import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/SignIn.dart';

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.max, // Use max to fill the available space
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 150),
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
                            color: Colors.blue, // Use the blue color
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 40,
                    ), // Add some space between the logo and the text
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
            ),
            const SizedBox(height: 40), // Adjusted spacing
            _buildTextButton(
              label: 'Join Now',
              onPressed: () {},
              backgroundColor: Colors.blue,
              textColor: Colors.white,
            ),
            const SizedBox(height: 15),
            _buildOutlinedButton(
              label: 'Continue with Google',
              iconPath: 'assets/google.png',
              onPressed: () {},
            ),
            const SizedBox(height: 15),
            _buildOutlinedButton(
              label: 'Continue with Facebook',
              iconPath: 'assets/facebook.png',
              onPressed: () {},
            ),
            const SizedBox(height: 20),
            _buildTextButton(
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
            const SizedBox(height: 20), // Add some space at the bottom
          ],
        ),
      ),
    );
  }

  Widget _buildTextButton({
    required String label,
    required VoidCallback onPressed,
    required Color backgroundColor,
    required Color textColor,
    FontWeight fontWeight = FontWeight.normal,
  }) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        minimumSize: const Size(450, 50),
        backgroundColor: backgroundColor,
        textStyle: const TextStyle(fontSize: 18),
      ),
      child: Text(
        label,
        style: TextStyle(color: textColor, fontWeight: fontWeight),
      ),
    );
  }

  Widget _buildOutlinedButton({
    required String label,
    required String iconPath,
    required VoidCallback onPressed,
  }) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(minimumSize: const Size(450, 50)),
      icon: Image.asset(iconPath, height: 24.0, width: 24.0),
      label: Text(label, style: const TextStyle(fontSize: 16)),
    );
  }
}
