import 'package:dummy_cross/src/api/client.dart';
import 'package:flutter/material.dart';
import 'package:dummy_cross/src/rust/frb_generated.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await RustLib.init();
  await ApiClient.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('xx quickstart')),
        body: const _AuthPage(),
      ),
    );
  }
}

class _AuthPage extends StatefulWidget {
  const _AuthPage();

  @override
  State<_AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<_AuthPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _errorMessage;
  String? _authToken;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            if (_authToken != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text('Auth Token: $_authToken'),
              ),
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
            ElevatedButton(onPressed: _login, child: const Text('Login')),

            if (_authToken != null) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Notifications:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh),
                    onPressed: () => setState(() {}), // Refresh notifications
                    tooltip: 'Refresh notifications',
                  ),
                ],
              ),
              FutureBuilder(
                future: ApiClient.notification.getNotifications(1),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const CircularProgressIndicator();
                  } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else if (snapshot.hasData) {
                    final notifs = snapshot.data;
                    if (notifs == null || notifs.isEmpty) {
                      return const Text('No notifications available.');
                    }
                    return Column(
                      children: [
                        const Text('Notifications:'),
                        for (var notification in notifs)
                          ListTile(
                            title: const Text('Notification'),
                            subtitle: Text(notification.message),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () {
                                ApiClient.notification.deleteNotification(
                                  notification.id,
                                );
                                setState(() {}); // Refresh the UI
                              },
                            ),
                          ),
                      ],
                    );
                  } else {
                    return const SizedBox.shrink();
                  }
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _login() async {
    final String email = _emailController.text;
    final String password = _passwordController.text;

    try {
      final response = await ApiClient.auth.login(email, password);
      // Handle successful login
      debugPrint('Login successful: ${response.userId} tk: ${response.token}');
      setState(() {
        _authToken = response.token;
        _errorMessage = null;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Login failed: $e';
        _authToken = null;
      });
    }
  }
}
