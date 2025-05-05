import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/model/connection_preferences.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_preferences/bloc/connection_preferences_bloc.dart';

class ConnectionPreferencesPage extends StatefulWidget {
  const ConnectionPreferencesPage({super.key});

  @override
  State<ConnectionPreferencesPage> createState() =>
      _ConnectionPreferencesPageState();
}

class _ConnectionPreferencesPageState extends State<ConnectionPreferencesPage> {
  ConnectionPreferences _preferences = ConnectionPreferences();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _isLoading = true;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Load initial preferences
      context.read<ConnectionPreferencesBloc>().add(
        ConnectionPreferencesLoadEvent(),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connection Preferences'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: () {
              // Save updated preferences
              context.read<ConnectionPreferencesBloc>().add(
                ConnectionPreferencesUpdateEvent(_preferences),
              );
            },
          ),
        ],
      ),
      body: BlocConsumer<ConnectionPreferencesBloc, ConnectionPreferencesState>(
        listener: (context, state) {
          if (state is ConnectionPreferencesLoaded) {
            setState(() {
              _preferences = (state).connectionPreferences;
              _isLoading = false;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Preferences saved successfully')),
            );
          } else if (state is ConnectionPreferencesError) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text('Error: ${state.error}')));
          }
        },
        builder: (context, state) {
          if (state is ConnectionPreferencesLoading && _isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionHeader('Connection Requests'),

                SwitchListTile(
                  title: const Text('Allow connection requests'),
                  subtitle: const Text(
                    'Others can send you connection requests',
                  ),
                  value: _preferences.allow_connection_requests ?? true,
                  onChanged: (value) {
                    setState(() {
                      _preferences = _preferences.copyWith(
                        allow_connection_requests: value,
                      );
                    });
                  },
                ),

                const Divider(),
                _buildSectionHeader('Messaging'),

                _buildRadioListTile('Allow messages from everyone', 'all'),

                _buildRadioListTile(
                  'Allow messages from connections only',
                  'connections_only',
                ),

                _buildRadioListTile('Don\'t allow messages', 'none'),

                const Divider(),
                _buildSectionHeader('Profile Visibility'),

                SwitchListTile(
                  title: const Text('Visible to public'),
                  subtitle: const Text('Your profile is visible to everyone'),
                  value: _preferences.visible_to_public ?? true,
                  onChanged: (value) {
                    setState(() {
                      _preferences = _preferences.copyWith(
                        visible_to_public: value,
                      );
                    });
                  },
                ),

                SwitchListTile(
                  title: const Text('Visible to connections'),
                  subtitle: const Text(
                    'Your profile is visible to your connections',
                  ),
                  value: _preferences.visible_to_connections ?? true,
                  onChanged: (value) {
                    setState(() {
                      _preferences = _preferences.copyWith(
                        visible_to_connections: value,
                      );
                    });
                  },
                ),

                SwitchListTile(
                  title: const Text('Visible to network'),
                  subtitle: const Text(
                    'Your profile is visible to your extended network',
                  ),
                  value: _preferences.visible_to_network ?? true,
                  onChanged: (value) {
                    setState(() {
                      _preferences = _preferences.copyWith(
                        visible_to_network: value,
                      );
                    });
                  },
                ),

                const Divider(),
                _buildSectionHeader('Activity Visibility'),

                SwitchListTile(
                  title: const Text('Show followers'),
                  subtitle: const Text('Let others see who follows you'),
                  value: _preferences.show_followers ?? true,
                  onChanged: (value) {
                    setState(() {
                      _preferences = _preferences.copyWith(
                        show_followers: value,
                      );
                    });
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildRadioListTile(String title, String value) {
    return RadioListTile<String>(
      title: Text(title),
      value: value,
      groupValue: _preferences.allow_messages_from,
      onChanged: (newValue) {
        setState(() {
          _preferences = _preferences.copyWith(allow_messages_from: newValue);
        });
      },
    );
  }
}
