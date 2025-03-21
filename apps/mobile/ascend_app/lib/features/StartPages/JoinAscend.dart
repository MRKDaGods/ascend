import 'package:ascend_app/features/StartPages/Widget/ContinueButton.dart';
import 'package:ascend_app/features/StartPages/Widget/InputWidgets.dart'; // Add this import
import 'package:ascend_app/shared/navigation/main_navigation.dart';
import 'package:flutter/material.dart';

class Joinascend extends StatefulWidget {
  const Joinascend({super.key});

  @override
  State<Joinascend> createState() => _JoinascendState();
}

class _JoinascendState extends State<Joinascend>
    with SingleTickerProviderStateMixin {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

  bool showPasswordField = false;
  bool showNameFields = false;
  double progress = 0.3; // Initial progress at 30%

  String emailError = '';
  String passwordError = '';
  String firstNameError = '';
  String lastNameError = '';

  late AnimationController _animationController;
  late Animation<Offset> _emailPasswordSlide;
  late Animation<Offset> _nameSlide;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300),
    );

    _emailPasswordSlide = Tween<Offset>(
      begin: Offset(0, 0),
      end: Offset(-1.0, 0),
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _nameSlide = Tween<Offset>(
      begin: Offset(1.0, 0),
      end: Offset(0, 0),
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    firstNameController.addListener(_validateFirstName);
    lastNameController.addListener(_validateLastName);
  }

  void _validateFirstName() {
    if (firstNameController.text.isNotEmpty) {
      setState(() {
        firstNameError = '';
      });
    }
  }

  void _validateLastName() {
    if (lastNameController.text.isNotEmpty) {
      setState(() {
        lastNameError = '';
      });
    }
  }

  void handleContinue() {
    setState(() {
      if (!showPasswordField) {
        final email = emailController.text;
        if (InputValidators.isValidEmailOrPhone(email)) {
          emailError = '';
          showPasswordField = true;
          progress = 0.6; // Move progress to 60%
        } else {
          emailError = 'Please enter a valid email or phone number';
        }
      } else if (!showNameFields) {
        final password = passwordController.text;
        final passwordErrorText = InputValidators.validatePassword(password);
        if (passwordErrorText == null) {
          passwordError = '';
          showNameFields = true;
          progress = 0.9; // Move progress to 90%
          _animationController.forward();
        } else {
          passwordError = passwordErrorText;
        }
      } else if (firstNameController.text.isEmpty ||
          lastNameController.text.isEmpty) {
        if (firstNameController.text.isEmpty) {
          setState(() {
            firstNameError = 'Please enter your first name';
          });
        }
        if (lastNameController.text.isEmpty) {
          setState(() {
            lastNameError = 'Please enter your last name';
          });
        }
      } else if (showNameFields && showPasswordField) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) {
              return const MainNavigation();
            },
          ),
        );
      }
    });
  }

  Future<bool> handleBackPress() async {
    if (showNameFields) {
      _animationController.reverse().then((_) {
        setState(() {
          showNameFields = false;
          progress = 0.6; // Move progress back to 60%
        });
      });
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    _animationController.dispose();
    firstNameController.removeListener(_validateFirstName);
    lastNameController.removeListener(_validateLastName);
    firstNameController.dispose();
    lastNameController.dispose();
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
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Image.asset('assets/logo/logo13.png', height: 40),
                          SizedBox(width: 8),
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
                      SizedBox(height: 20),

                      // Progress Bar
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(
                            color: Colors.grey,
                            width: 1,
                          ), // Add border line
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: LinearProgressIndicator(
                          value: progress,
                          backgroundColor: Colors.transparent,
                          color: Colors.green[800],
                          minHeight: 8,
                        ),
                      ),
                      SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              "Create Account",
                              style: TextStyle(
                                color: Colors.grey[800],
                                fontSize: 16,
                              ),
                            ),
                          ),
                          Align(
                            alignment: Alignment.centerRight,
                            child: Text(
                              "${(progress * 100).toInt()}%",
                              style: TextStyle(
                                color: Colors.grey[800],
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 40),
                      Text(
                        'Join Ascend',
                        style: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                        ),
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
                        child: RichText(
                          text: const TextSpan(
                            children: [
                              TextSpan(
                                text: 'or ',
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 16,
                                ),
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
                      ),
                      SizedBox(height: 20),
                      AnimatedSwitcher(
                        duration: Duration(milliseconds: 300),
                        child:
                            !showNameFields
                                ? SlideTransition(
                                  position: _emailPasswordSlide,
                                  child: Column(
                                    key: ValueKey("email_password"),
                                    children: [
                                      CustomTextFormField(
                                        controller: emailController,
                                        labelText: 'Email or Phone',
                                        errorText: emailError,
                                      ),
                                      SizedBox(height: 20),
                                      if (showPasswordField)
                                        CustomTextFormField(
                                          controller: passwordController,
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
                        duration: Duration(milliseconds: 300),
                        child:
                            showNameFields
                                ? SlideTransition(
                                  position: _nameSlide,
                                  child: Column(
                                    key: ValueKey("name_inputs"),
                                    children: [
                                      CustomTextFormField(
                                        controller: firstNameController,
                                        labelText: 'First Name',
                                        errorText: firstNameError,
                                      ),
                                      SizedBox(height: 20),
                                      CustomTextFormField(
                                        controller: lastNameController,
                                        labelText: 'Last Name',
                                        errorText: lastNameError,
                                      ),
                                      SizedBox(height: 20),
                                    ],
                                  ),
                                )
                                : Container(),
                      ),
                      SizedBox(height: 20),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          TextButton(
                            onPressed: () {},
                            child: RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text:
                                        'By clicking Agree & Join, you agree to the Ascend ',
                                    style: TextStyle(
                                      color: Colors.grey[800],
                                      fontSize: 12,
                                    ),
                                  ),
                                  TextSpan(
                                    text:
                                        'User Agreement, Privacy Policy, and Cookie Policy',
                                    style: TextStyle(
                                      color: Colors.blue,
                                      fontSize: 12,
                                    ),
                                  ),
                                  TextSpan(
                                    text:
                                        '. For phone number signups, you agree to receive SMS for account verification. Message & data rates may apply.',
                                    style: TextStyle(
                                      color: Colors.grey[800],
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                              textAlign: TextAlign.left,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          buildTextButton(
                            label: 'Agree & Join',
                            onPressed: handleContinue,
                            backgroundColor: Colors.blue,
                            textColor: Colors.white,
                          ),
                        ],
                      ),
                      SizedBox(height: 15),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: screenWidth * 0.4,
                            child: Divider(
                              color: Colors.grey[500],
                              thickness: 1,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              'or',
                              style: TextStyle(
                                color: Colors.grey[800],
                                fontSize: 16,
                              ),
                            ),
                          ),
                          Container(
                            width: screenWidth * 0.4,
                            child: Divider(
                              color: Colors.grey[500],
                              thickness: 1,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: screenHeight * 0.02),
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
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
