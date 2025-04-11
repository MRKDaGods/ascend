import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_event.dart';
import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_state.dart';
import 'package:ascend_app/features/StartPages/Presentation/Pages/SignIn.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/ContinueButton.dart';
import 'package:ascend_app/features/StartPages/Presentation/Widget/InputWidgets.dart';
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class JoinAscend extends StatefulWidget {
  const JoinAscend({super.key});

  @override
  State<JoinAscend> createState() => _JoinAscendState();
}

class _JoinAscendState extends State<JoinAscend>
    with SingleTickerProviderStateMixin {
  // Controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();

  // State variables
  bool showPasswordField = false;
  bool showNameFields = false;
  double progress = _initialProgress;

  // Error messages
  String emailError = '';
  String passwordError = '';
  String firstNameError = '';
  String lastNameError = '';

  // Animation
  late final AnimationController _animationController;
  late final Animation<Offset> _emailPasswordSlide;
  late final Animation<Offset> _nameSlide;

  // Constants
  static const double _initialProgress = 0.3;
  static const double _passwordProgress = 0.6;
  static const double _nameProgress = 0.9;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _addFieldListeners();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _emailPasswordSlide = Tween<Offset>(
      begin: const Offset(0, 0),
      end: const Offset(-1.0, 0),
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _nameSlide = Tween<Offset>(
      begin: const Offset(1.0, 0),
      end: const Offset(0, 0),
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  void _addFieldListeners() {
    firstNameController.addListener(
      () => _clearError(firstNameController, (value) {
        setState(() => firstNameError = value);
      }),
    );
    lastNameController.addListener(
      () => _clearError(lastNameController, (value) {
        setState(() => lastNameError = value);
      }),
    );
  }

  void _clearError(
    TextEditingController controller,
    Function(String) setError,
  ) {
    if (controller.text.isNotEmpty) {
      setError('');
    }
  }

  void handleContinue() {
    setState(() {
      if (!showPasswordField) {
        _validateEmail();
      } else if (!showNameFields) {
        _validatePassword();
      } else {
        _validateNameFields();
      }
    });

    if (showNameFields && firstNameError.isEmpty && lastNameError.isEmpty) {
      final email = emailController.text.trim();
      final password = passwordController.text.trim();
      final firstName = firstNameController.text.trim();
      final lastName = lastNameController.text.trim();

      // Dispatch SignUpRequested event to AuthBloc
      context.read<AuthBloc>().add(
        SignUpRequested(
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        ),
      );
      context.read<AuthBloc>().stream.listen((state) {
        if (state is AuthSuccess) {
          // Handle successful sign-up
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const MainNavigation()),
          );
        } else if (state is AuthFailure) {
          // Handle sign-up failure
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.error)));
        }
      });
    }
  }

  void _validateEmail() {
    final email = emailController.text;
    if (InputValidators.isValidEmailOrPhone(email)) {
      emailError = '';
      showPasswordField = true;
      progress = _passwordProgress;
    } else {
      emailError = 'Please enter a valid email or phone number';
    }
  }

  void _validatePassword() {
    final password = passwordController.text;
    final passwordErrorText = InputValidators.validatePassword(password);
    if (passwordErrorText == null) {
      passwordError = '';
      showNameFields = true;
      progress = _nameProgress;
      _animationController.forward();
    } else {
      passwordError = passwordErrorText;
    }
  }

  void _validateNameFields() {
    if (firstNameController.text.isEmpty) {
      firstNameError = 'Please enter your first name';
    }
    if (lastNameController.text.isEmpty) {
      lastNameError = 'Please enter your last name';
    }
    if (firstNameError.isEmpty && lastNameError.isEmpty) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainNavigation()),
      );
    }
  }

  Future<bool> handleBackPress() async {
    if (showNameFields) {
      // Go back to the password field
      _animationController.reverse().then((_) {
        setState(() {
          showNameFields = false;
          progress = _passwordProgress;
        });
      });
      return false;
    } else if (showPasswordField) {
      // Go back to the email field
      setState(() {
        showPasswordField = false;
        progress = _initialProgress;
      });
      return false;
    }
    return true; // Allow exiting the screen
  }

  @override
  void dispose() {
    _animationController.dispose();
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: handleBackPress,
      child: Scaffold(
        body: LayoutBuilder(
          builder: (context, constraints) {
            final screenWidth = constraints.maxWidth;
            final screenHeight = constraints.maxHeight;
            return SafeArea(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 20),
                      _buildProgressBar(),
                      const SizedBox(height: 40),
                      _buildTitle(),
                      _buildSignInLink(),
                      const SizedBox(height: 20),
                      _buildInputFields(),
                      const SizedBox(height: 20),
                      _buildAgreementText(),
                      const SizedBox(height: 10),
                      _buildContinueButton(),
                      const SizedBox(height: 15),
                      _buildDivider(screenWidth),
                      const SizedBox(height: 20),
                      _buildSocialButtons(screenHeight),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        Image.asset('assets/logo/logo13.png', height: 40),
        const SizedBox(width: 8),
        const Text(
          'Ascend',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
      ],
    );
  }

  Widget _buildProgressBar() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey, width: 1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.transparent,
            color: Colors.green[800],
            minHeight: 8,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "Create Account",
              style: TextStyle(color: Colors.grey[800], fontSize: 16),
            ),
            Text(
              "${(progress * 100).toInt()}%",
              style: TextStyle(color: Colors.grey[800], fontSize: 16),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTitle() {
    return const Text(
      'Join Ascend',
      style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
    );
  }

  Widget _buildSignInLink() {
    return TextButton(
      onPressed: () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const SignInPage()),
        );
      },
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: 'or ',
              style: TextStyle(color: Colors.grey, fontSize: 16),
            ),
            TextSpan(
              text: ' Sign In',
              style: TextStyle(
                color: Colors.blue,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputFields() {
    return Column(
      children: [
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child:
              !showNameFields
                  ? SlideTransition(
                    position: _emailPasswordSlide,
                    child: Column(
                      key: const ValueKey("email_password"),
                      children: [
                        CustomTextFormField(
                          controller: emailController,
                          labelText: 'Email or Phone',
                          errorText: emailError,
                          fieldId: "Join_email",
                        ),
                        const SizedBox(height: 20),
                        if (showPasswordField)
                          CustomTextFormField(
                            controller: passwordController,
                            fieldId: "Join_password",
                            labelText: 'Password',
                            errorText: passwordError,
                            obscureText: true,
                          ),
                      ],
                    ),
                  )
                  : Container(),
        ),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child:
              showNameFields
                  ? SlideTransition(
                    position: _nameSlide,
                    child: Column(
                      key: const ValueKey("name_inputs"),
                      children: [
                        CustomTextFormField(
                          controller: firstNameController,
                          labelText: 'First Name',
                          fieldId: "Join_first_name",
                          errorText: firstNameError,
                        ),
                        const SizedBox(height: 20),
                        CustomTextFormField(
                          controller: lastNameController,
                          fieldId: "Join_last_name",
                          labelText: 'Last Name',
                          errorText: lastNameError,
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  )
                  : Container(),
        ),
      ],
    );
  }

  Widget _buildAgreementText() {
    return TextButton(
      onPressed: () {},
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: 'By clicking Agree & Join, you agree to the Ascend ',
              style: TextStyle(color: Colors.grey[800], fontSize: 12),
            ),
            TextSpan(
              text: 'User Agreement, Privacy Policy, and Cookie Policy',
              style: TextStyle(color: Colors.blue, fontSize: 12),
            ),
            TextSpan(
              text:
                  '. For phone number signups, you agree to receive SMS for account verification. Message & data rates may apply.',
              style: TextStyle(color: Colors.grey[800], fontSize: 12),
            ),
          ],
        ),
        textAlign: TextAlign.left,
      ),
    );
  }

  Widget _buildContinueButton() {
    return buildTextButton(
      label: 'Agree & Join',
      onPressed: handleContinue,
      backgroundColor: Colors.blue,
      textColor: Colors.white,
    );
  }

  Widget _buildDivider(double screenWidth) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: screenWidth * 0.4,
          child: Divider(color: Colors.grey[500], thickness: 1),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            'or',
            style: TextStyle(color: Colors.grey[800], fontSize: 16),
          ),
        ),
        Container(
          width: screenWidth * 0.4,
          child: Divider(color: Colors.grey[500], thickness: 1),
        ),
      ],
    );
  }

  Widget _buildSocialButtons(double screenHeight) {
    return Column(
      children: [
        buildOutlinedButton(
          onPressed: () {},
          iconPath: 'assets/google.png',
          label: 'Sign in with Google',
        ),
        SizedBox(height: screenHeight * 0.015),
        buildOutlinedButton(
          onPressed: () {},
          iconPath: 'assets/facebook.png',
          label: 'Sign in with Facebook',
        ),
      ],
    );
  }
}
