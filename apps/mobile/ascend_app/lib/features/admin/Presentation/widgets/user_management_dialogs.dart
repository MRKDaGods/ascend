import 'package:ascend_app/features/admin/bloc/users/bloc/users_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

/// Class containing reusable dialog methods for user management operations
class UserManagementDialogs {
  /// Shows a dialog to add a new user
  static void showAddUserModal(BuildContext context) {
    final firstNameController = TextEditingController();
    final lastNameController = TextEditingController();
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final formKey = GlobalKey<FormState>();
    bool isLoading = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (stateContext, setState) {
            return AlertDialog(
              title: const Text('Create New User'),
              content: Form(
                key: formKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (isLoading)
                        const Padding(
                          padding: EdgeInsets.all(8.0),
                          child: CircularProgressIndicator(),
                        ),
                      TextFormField(
                        controller: firstNameController,
                        decoration: const InputDecoration(
                          labelText: 'First Name',
                        ),
                        enabled: !isLoading,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter first name';
                          }
                          return null;
                        },
                      ),
                      TextFormField(
                        controller: lastNameController,
                        decoration: const InputDecoration(
                          labelText: 'Last Name',
                        ),
                        enabled: !isLoading,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter last name';
                          }
                          return null;
                        },
                      ),
                      TextFormField(
                        controller: emailController,
                        decoration: const InputDecoration(labelText: 'Email'),
                        keyboardType: TextInputType.emailAddress,
                        enabled: !isLoading,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter email';
                          } else if (!value.contains('@')) {
                            return 'Please enter a valid email';
                          }
                          return null;
                        },
                      ),
                      TextFormField(
                        controller: passwordController,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                        ),
                        obscureText: true,
                        enabled: !isLoading,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter password';
                          } else if (value.length < 3) {
                            return 'Password must be at least 3 characters';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed:
                      isLoading ? null : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed:
                      isLoading
                          ? null
                          : () async {
                            if (formKey.currentState!.validate()) {
                              setState(() {
                                isLoading = true;
                              });

                              try {
                                // Get the UsersBloc from the original context
                                final usersBloc = context.read<UsersBloc>();

                                // Use the repository from the bloc
                                await usersBloc.adminRepository.createUser({
                                  'first_name': firstNameController.text.trim(),
                                  'last_name': lastNameController.text.trim(),
                                  'email': emailController.text.trim(),
                                  'password': passwordController.text,
                                });

                                // Close the dialog
                                if (dialogContext.mounted) {
                                  Navigator.pop(dialogContext);
                                }

                                // Show success message
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        'User ${firstNameController.text} created successfully',
                                      ),
                                      backgroundColor: Colors.green,
                                      duration: const Duration(seconds: 2),
                                    ),
                                  );
                                }
                              } catch (e) {
                                // Reset loading state on error
                                setState(() {
                                  isLoading = false;
                                });

                                // Show user-friendly error message
                                String errorMessage = 'Error creating user';

                                if (e.toString().contains(
                                  'email address is already registered',
                                )) {
                                  errorMessage =
                                      'This email address is already registered';
                                } else if (e.toString().contains(
                                  'validation failed',
                                )) {
                                  errorMessage =
                                      'Please check your input and try again';
                                }

                                // Show error message
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(errorMessage),
                                      backgroundColor: Colors.red,
                                      duration: const Duration(seconds: 3),
                                    ),
                                  );
                                }

                                debugPrint('Error creating user: $e');
                              }
                            }
                          },
                  child: const Text('Create'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Keep your existing showDeleteByIdModal and other methods

  /// Shows a dialog to delete a user by ID
  static void showDeleteByIdModal(
    BuildContext context,
    Function(BuildContext, String) handleDeleteUser,
  ) {
    final userIdController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          title: const Text('Delete User by ID'),
          content: Form(
            key: formKey,
            child: TextFormField(
              controller: userIdController,
              decoration: const InputDecoration(labelText: 'User ID'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a user ID';
                }
                if (int.tryParse(value) == null) {
                  return 'Please enter a valid numeric ID';
                }
                return null;
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                if (formKey.currentState!.validate()) {
                  // Form is valid, delete the user
                  // Important: Use the original context, not dialogContext
                  Navigator.pop(dialogContext);

                  // Call the delete handler with the parent context and user ID
                  handleDeleteUser(context, userIdController.text);

                  // Show a temporary confirmation
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Deleting user with ID: ${userIdController.text}',
                      ),
                      backgroundColor: Colors.orange,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                }
              },
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}
