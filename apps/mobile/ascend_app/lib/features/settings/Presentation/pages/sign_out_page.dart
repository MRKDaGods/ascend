import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/Model/secure_storage_helper.dart';

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
              onPressed: () async {
                await SecureStorageHelper.clearAll(); // Clear stored data
                Navigator.pushReplacementNamed(
                  context,
                  '/signIn',
                ); // Navigate to SignIn
              },
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
