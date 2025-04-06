import 'package:flutter/material.dart';

class SignOutPage extends StatefulWidget {
  const SignOutPage({super.key});

  @override
  State<SignOutPage> createState() => _SignOutPageState();
}

class _SignOutPageState extends State<SignOutPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign Out')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Are you sure you want to sign out?'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Handle sign out logic here
                Navigator.pushNamed(
                  context,
                  '/',
                ); // Navigate to the welcome page
              },
              child: const Text('Sign Out'),
            ),
          ],
        ),
      ),
    );
  }
}
