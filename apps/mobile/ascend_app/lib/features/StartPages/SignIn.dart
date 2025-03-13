import 'package:ascend_app/features/StartPages/JoinAscend.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final screenWidth = constraints.maxWidth;
          final screenHeight = constraints.maxHeight;

          return Padding(
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
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: screenHeight * 0.05),
                const Text(
                  'Sign in',
                  style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
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
                          style: TextStyle(color: Colors.grey, fontSize: 16),
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
                SizedBox(height: screenHeight * 0.05),
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
                        style: TextStyle(color: Colors.grey, fontSize: 16),
                      ),
                    ),
                    Container(
                      width: screenWidth * 0.4,
                      child: Divider(color: Colors.grey, thickness: 1),
                    ),
                  ],
                ),
                SizedBox(height: screenHeight * 0.05),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Email or Phone',
                    border: OutlineInputBorder(),
                  ),
                ),
                SizedBox(height: screenHeight * 0.02),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
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
                buildOutlinedButton(onPressed: () {}, label: 'Continue'),
              ],
            ),
          );
        },
      ),
    );
  }
}
