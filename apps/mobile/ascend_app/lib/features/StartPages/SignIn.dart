import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  bool _rememberMe = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Image.asset('assets/logo/logo13.png', height: 40),
                  Text(
                    'Ascend',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Trocchi', // Set the font family to Trocchi
                      color: Colors.blue, // Set the color to blue[900]
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 90),
              const Text(
                'Sign in',
                style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  minimumSize: const Size(0, 0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  textStyle: const TextStyle(fontSize: 24),
                  animationDuration: Duration.zero, // Disable animation
                  shadowColor: Colors.transparent, // Disable shadow animation
                  elevation: 0, // Disable elevation
                ),
                child: RichText(
                  text: const TextSpan(
                    children: [
                      TextSpan(
                        text: 'or ',
                        style: TextStyle(color: Colors.grey, fontSize: 16),
                      ),
                      TextSpan(
                        text: ' Join Ascend',
                        style: TextStyle(color: Colors.black, fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 40),
              _buildOutlinedButton(
                onPressed: () {},
                iconPath: 'assets/google.png',
                label: 'Sign in with Google',
              ),
              const SizedBox(height: 15),
              _buildOutlinedButton(
                onPressed: () {},
                iconPath: 'assets/apple-logo.png',
                label: 'Sign in with Apple',
              ),
              const SizedBox(height: 15),
              _buildOutlinedButton(
                onPressed: () {},
                iconPath: 'assets/facebook.png',
                label: 'Sign in with Facebook',
              ),
              const SizedBox(height: 60),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 205, // Set the desired width here
                    child: Divider(color: Colors.grey, thickness: 1),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      'or',
                      style: TextStyle(color: Colors.grey, fontSize: 16),
                    ),
                  ),
                  Container(
                    width: 205, // Set the desired width here
                    child: Divider(color: Colors.grey, thickness: 1),
                  ),
                ],
              ),
              const SizedBox(height: 70),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Email or Phone',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 10),
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
                    animationDuration: Duration.zero, // Disable animation
                    shadowColor: Colors.transparent, // Disable shadow animation
                    elevation: 0, // Disable elevation
                  ),
                  child: const Text('Forgot password?'),
                ),
              ),
              const SizedBox(height: 5),
              _buildOutlinedButton(onPressed: () {}, label: 'Continue'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOutlinedButton({
    required VoidCallback onPressed,
    String? iconPath,
    required String label,
  }) {
    return Center(
      child: OutlinedButton.icon(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(minimumSize: const Size(450, 50)),
        icon:
            iconPath != null
                ? Image.asset(iconPath, height: 24.0, width: 24.0)
                : const SizedBox.shrink(),
        label: Text(label, style: const TextStyle(fontSize: 16)),
      ),
    );
  }
}
