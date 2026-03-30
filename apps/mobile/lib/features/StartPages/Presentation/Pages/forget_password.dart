import 'package:ascend_app/features/Logo/logo_widget.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/input_widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController _emailPhoneController = TextEditingController();
  String _emailError = '';

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          _showLoadingDialog(context);
        } else if (state is AuthForgetPasswordSuccess) {
          _handleSuccess(context, state.message);
        } else if (state is AuthForgetPasswordFaliure) {
          _handleFailure(context, state.error);
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildLogo(),
                const SizedBox(height: 32),
                _buildTitle(),
                const SizedBox(height: 24),
                _buildInputField(),
                const SizedBox(height: 16),
                _buildInfoText(),
                const SizedBox(height: 42),
                _buildNextButton(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Row(children: const [LogoWidget(height: 40, fontSize: 28)]);
  }

  Widget _buildTitle() {
    return const Text(
      "Forgot password",
      style: TextStyle(fontSize: 34, fontWeight: FontWeight.bold),
    );
  }

  Widget _buildInputField() {
    return CustomTextFormField(
      controller: _emailPhoneController,
      labelText: 'Email or Phone',
      fieldId: "ForgotPasswordEmail",
      errorText: _emailError,
      onChanged: (value) {
        if (InputValidators.isValidEmailOrPhone(value.trim())) {
          setState(() {
            _emailError = ''; // Clear the error message if the input is valid
          });
        }
      },
    );
  }

  Widget _buildInfoText() {
    return const Text(
      "We’ll send a verification code to this email or phone number if it matches an existing LinkedIn account.",
      style: TextStyle(fontSize: 18, color: Colors.black87),
    );
  }

  Widget _buildNextButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => _handleNextButtonPressed(context),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(40),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        child: const Text(
          "Next",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  void _handleNextButtonPressed(BuildContext context) {
    final emailOrPhone = _emailPhoneController.text.trim();
    if (!InputValidators.isValidEmailOrPhone(emailOrPhone)) {
      setState(() {
        _emailError = 'Invalid email';
      });
      return;
    }

    context.read<AuthBloc>().add(
      ForgotPasswordRequested(emailOrPhone: emailOrPhone),
    );
  }

  void _showLoadingDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );
  }

  void _handleSuccess(BuildContext context, String message) {
    Navigator.pop(context); // Close the loading dialog
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));

    Navigator.pushReplacementNamed(
      context,
      '/verficationPasswordCodePage',
      arguments: _emailPhoneController.text.trim(),
    );
  }

  void _handleFailure(BuildContext context, String error) {
    // Ensure the loading dialog is dismissed if it's open
    if (Navigator.canPop(context)) {
      Navigator.pop(context); // Close the loading dialog
    }

    // Show the error dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Error"),
          content: Text(error),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context); // Close the dialog
                Navigator.pushReplacementNamed(
                  context,
                  '/forgetPasswordPage',
                ); // Navigate back to ForgotPasswordPage
              },
              child: const Text("OK"),
            ),
          ],
        );
      },
    );
  }
}
