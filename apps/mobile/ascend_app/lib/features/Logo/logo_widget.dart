import 'package:flutter/material.dart';

class LogoWidget extends StatelessWidget {
  final double height;
  final double fontSize;

  const LogoWidget({super.key, required this.height, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Image.asset('assets/logo/logo13.png', height: height),
        const SizedBox(width: 8), // Add some spacing between the image and text
        Text(
          'Ascend',
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
      ],
    );
  }
}
