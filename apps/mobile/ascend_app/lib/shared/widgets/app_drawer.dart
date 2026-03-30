import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:ascend_app/features/premium/manage_purchase_page.dart';
import 'package:ascend_app/features/premium/premium_apply_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../features/profile/bloc/user_profile_bloc.dart';
import '../../features/profile/bloc/user_profile_state.dart';
import '../../core/routes/app_routes.dart'; // Import AppRoutes to access RouteNames

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserProfileBloc, UserProfileState>(
      builder: (context, state) {
        // Extract profile from state or use empty profile if not loaded
        final profile = state is UserProfileLoaded ? state.profile : null;
        if (profile == null) {
          return const Center(child: CircularProgressIndicator());
        }

        return Drawer(
          shape: ContinuousRectangleBorder(),
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
                            GestureDetector(
                              onTap: () {
                                Navigator.pop(context);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => UserProfilePage(),
                                  ),
                                );
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    radius: 30,
                                    backgroundImage:
                                        profile.profilePictureUrl != null
                                            ? NetworkImage(
                                                  profile.profilePictureUrl!,
                                                )
                                                as ImageProvider
                                            : const AssetImage(
                                              'assets/EmptyUser.png',
                                            ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    '${profile.firstName} ${profile.lastName}',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              profile.headline ?? '',
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              profile.location ?? 'Location not set',
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              profile.getCurrentExperience()?.company ?? '',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),

                            const SizedBox(height: 8),
                            // Row(
                            //   children: [
                            //     CircleAvatar(
                            //       radius: 8,
                            //       backgroundImage:
                            //           profile.companyLogoUrl.isNotEmpty
                            //               ? NetworkImage(profile.companyLogoUrl)
                            //                   as ImageProvider
                            //               : const AssetImage('assets/logo.jpg'),
                            //     ),
                            //     const SizedBox(width: 5),
                            //     Flexible(
                            //       child: Text(
                            //         profile.companyName,
                            //         style: const TextStyle(fontSize: 14),
                            //         overflow: TextOverflow.ellipsis,
                            //       ),
                            //     ),
                            //   ],
                            // ),
                          ],
                        ),
                      ),
                    ),
                    const Divider(),
                    // Profile viewers
                    ListTile(
                      horizontalTitleGap: 5,
                      leading: Text(
                        "0",
                        // profile.profileViewers.toString(),
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
                        "0",
                        // profile.postImpressions.toString(),
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
                    const Divider(),
                    // Saved Posts
                    ListTile(
                      leading: const Icon(Icons.bookmark_border_outlined),
                      horizontalTitleGap: 5,
                      title: const Text(
                        'Saved Posts',
                        style: TextStyle(fontSize: 18),
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, RouteNames.savedPosts);
                      },
                    ),
                    // Admin Panel
                    if (profile.isAdmin)
                      ListTile(
                        leading: const Icon(
                          Icons.admin_panel_settings_outlined,
                        ),
                        horizontalTitleGap: 5,
                        title: const Text(
                          'Admin Panel',
                          style: TextStyle(fontSize: 18),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, RouteNames.adminHome);
                        },
                      ),
                  ],
                ),
              ),
              const Divider(),
              if ( /*!profile.isPremium*/ true) // TODOX: impl premium hna?
                ListTile(
                  dense: true,
                  leading: const Icon(
                    Icons.payments_rounded,
                    color: Colors.amber,
                  ),
                  horizontalTitleGap: 5,
                  title: const Text(
                    'Try premium for EGP0',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    // Navigate to premium subscription
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => PremiumApplyPage(),
                      ),
                    );
                  },
                ),
              if ( /*profile.isPremium*/ false) // TODOX: impl premium hna?
                // ignore: dead_code
                ListTile(
                  dense: true,
                  leading: const Icon(
                    Icons.subscriptions_rounded,
                    color: Colors.amber,
                  ),
                  horizontalTitleGap: 5,
                  title: const Text(
                    'Manage Subscription',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    // Navigate to premium subscription
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ManagePurchasePage(),
                      ),
                    );
                  },
                ),
              ListTile(
                horizontalTitleGap: 5,
                leading: const Icon(Icons.settings),
                title: const Text(
                  'Settings',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, '/settings');
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }
}
