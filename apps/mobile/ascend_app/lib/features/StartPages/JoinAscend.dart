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
      begin: Offset(0, 0), // Starts in place
      end: Offset(-1.0, 0), // Moves out to the left
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _nameSlide = Tween<Offset>(
      begin: Offset(1.0, 0), // Starts off-screen to the right
      end: Offset(0, 0), // Moves to its position
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  void handleContinue() {
    if (!showPasswordField) {
      // First press: Show password field
      setState(() {
        showPasswordField = true;
      });
    } else if (!showNameFields) {
      // Second press: Slide email & password out, slide name inputs in
      setState(() {
        showNameFields = true;
      });
      _animationController.forward();
    }
  }

  Future<bool> handleBackPress() async {
    if (showNameFields) {
      // If user is on name input, slide back to email/password instead of exiting
      _animationController.reverse().then((_) {
        setState(() {
          showNameFields = false;
        });
      });
      return false; // Prevent app from closing
    }
    return true; // Allow default back behavior
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: handleBackPress, // Handles back gesture behavior
      child: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo & App Name
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
                SizedBox(height: 40),

                // Slide Transition for Email & Password Inputs
                AnimatedSwitcher(
                  duration: Duration(milliseconds: 300),
                  child:
                      !showNameFields
                          ? SlideTransition(
                            position: _emailPasswordSlide,
                            child: Column(
                              key: ValueKey("email_password"),
                              children: [
                                // Email Input
                                TextField(
                                  controller: emailController,
                                  decoration: InputDecoration(
                                    labelText: "Email or Phone",
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                SizedBox(height: 20),

                                // Password Input (Appears after first Continue press)
                                if (showPasswordField)
                                  Column(
                                    children: [
                                      TextField(
                                        controller: passwordController,
                                        obscureText: true,
                                        decoration: InputDecoration(
                                          labelText: "Password",
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                      SizedBox(height: 20),
                                    ],
                                  ),
                              ],
                            ),
                          )
                          : Container(),
                ),

                // Slide Transition for First & Last Name Inputs
                AnimatedSwitcher(
                  duration: Duration(milliseconds: 300),
                  child:
                      showNameFields
                          ? SlideTransition(
                            position: _nameSlide,
                            child: Column(
                              key: ValueKey("name_inputs"),
                              children: [
                                // First Name Input
                                TextField(
                                  controller: firstNameController,
                                  decoration: InputDecoration(
                                    labelText: "First Name",
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                SizedBox(height: 20),

                                // Last Name Input
                                TextField(
                                  controller: lastNameController,
                                  decoration: InputDecoration(
                                    labelText: "Last Name",
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                SizedBox(height: 20),
                              ],
                            ),
                          )
                          : Container(),
                ),

                // Continue Button (Always Enabled)
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    onPressed: handleContinue,
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 14),
                      textStyle: TextStyle(fontSize: 16),
                    ),
                    child: Text("Continue"),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
