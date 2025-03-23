// import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:ascend_app/theme.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart'; // Import the welcome.dart file
import 'package:flutter/rendering.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      debugShowCheckedModeBanner: false,
      home: const Welcome(), // Set Welcome as the home widget
    );
  }
}
