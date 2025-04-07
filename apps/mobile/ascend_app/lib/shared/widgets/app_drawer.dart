import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../features/profile/bloc/user_profile_bloc.dart';
import '../../features/profile/bloc/user_profile_state.dart';
import '../../features/profile/models/user_profile_model.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserProfileBloc, UserProfileState>(
      builder: (context, state) {
        // Extract profile from state or use empty profile if not loaded
        final profile = state is UserProfileLoaded 
            ? state.profile 
            : UserProfileModel.empty();

        return Drawer(
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16.0),
                      child: SafeArea(
                        bottom: false,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // If the profile is loading, show a loading indicator
                            if (state is UserProfileLoading)
                              const Center(child: CircularProgressIndicator())
                            else
                              CircleAvatar(
                                radius: 30,
                                backgroundImage: profile.avatarUrl.isNotEmpty 
                                    ? NetworkImage(profile.avatarUrl) as ImageProvider
                                    : const AssetImage('assets/logo.jpg'),
                              ),
                            const SizedBox(height: 10),
                            Text(
                              profile.name,
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 5),
                            Text(profile.position, style: const TextStyle(fontSize: 14)),
                            const SizedBox(height: 5),
                            Text(profile.location, style: const TextStyle(fontSize: 14)),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 8,
                                  backgroundImage: profile.companyLogoUrl.isNotEmpty 
                                      ? NetworkImage(profile.companyLogoUrl) as ImageProvider
                                      : const AssetImage('assets/logo.jpg'),
                                ),
                                const SizedBox(width: 5),
                                Flexible(
                                  child: Text(
                                    profile.companyName,
                                    style: const TextStyle(fontSize: 14),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const Divider(),
                    // Profile viewers
                    ListTile(
                      horizontalTitleGap: 5,
                      leading: Text(
                        profile.profileViewers.toString(),
                        style: TextStyle(
                          fontSize: 20,
                          color: Theme.of(context).primaryColor,
                        ),
                      ),
                      dense: true,
                      title: const Text('Profile viewers'),
                      onTap: () {
                        Navigator.pop(context);
                      },
                    ),
                    // Post impressions
                    ListTile(
                      horizontalTitleGap: 5,
                      leading: Text(
                        profile.postImpressions.toString(),
                        style: TextStyle(
                          fontSize: 20,
                          color: Theme.of(context).primaryColor,
                        ),
                      ),
                      dense: true,
                      title: const Text('Post impressions'),
                      onTap: () {
                        Navigator.pop(context);
                      },
                    ),
                    // Add more list tiles as needed
                  ],
                ),
              ),
              const SizedBox(height: 16), // Add some padding at the bottom
            ],
          ),
        );
      },
    );
  }
}
