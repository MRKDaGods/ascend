import 'package:flutter/material.dart';

class CustomTextFormField extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String errorText;
  final bool obscureText;
  final Function(String)? onChanged;
  final Function(String)? onFieldSubmitted;

  const CustomTextFormField({
    Key? key,
    required this.controller,
    required this.labelText,
    required this.errorText,
    this.obscureText = false,
    this.onChanged,
    this.onFieldSubmitted,
  }) : super(key: key);

  @override
  _CustomTextFormFieldState createState() => _CustomTextFormFieldState();
}

class _CustomTextFormFieldState extends State<CustomTextFormField> {
  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      decoration: InputDecoration(
        labelText: widget.labelText,
        border: OutlineInputBorder(),
        errorText: widget.errorText.isEmpty ? null : widget.errorText,
      ),
      obscureText: widget.obscureText,
      onChanged: widget.onChanged,
      onFieldSubmitted: widget.onFieldSubmitted,
    );
  }
}

class InputValidators {
  static bool isValidEmailOrPhone(String input) {
    // Simple regex for email validation
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    // Simple regex for phone validation (10 digits)
    final phoneRegex = RegExp(r'^\d{10}$');
    return emailRegex.hasMatch(input) || phoneRegex.hasMatch(input);
  }

  static String? validatePassword(String password) {
    if (password.length < 6) {
      return 'Password should be at least 6 characters';
    }
    return null;
  }
}