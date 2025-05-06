import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:ascend_app/features/home/presentation/widgets/search/user_search_result_model.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:get/get.dart';

class UserSearchResultTile extends StatelessWidget {
  final UserSearchResult user;

  const UserSearchResultTile({super.key, required this.user});

  void _showConnectBottomSheet(BuildContext context) {
    final TextEditingController messageController = TextEditingController();
    final ApiClient apiClient = sl.apiClient;
    bool isLoading = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                top: 16,
                left: 16,
                right: 16,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Connect with ${user.fullName}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: messageController,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      hintText: 'Add a personalized message...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed:
                        isLoading
                            ? null
                            : () async {
                              setState(() {
                                isLoading = true;
                              });
                              try {
                                Navigator.pop(Get.context!);

                                await apiClient.post(
                                  '/connection/request',
                                  data: {
                                    'userId': user.id,
                                    'message': messageController.text,
                                  },
                                );

                                ScaffoldMessenger.of(Get.context!).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Connection request sent to ${user.fullName}',
                                    ),
                                  ),
                                );
                              } catch (e) {
                                ScaffoldMessenger.of(Get.context!).showSnackBar(
                                  SnackBar(
                                    content: Text('Error: ${e.toString()}'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              } finally {
                                if (context.mounted) {
                                  setState(() {
                                    isLoading = false;
                                  });
                                }
                              }
                            },
                    child:
                        isLoading
                            ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                            : const Text('Send Connection Request'),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bloc = context.read<UserProfileBloc>();
    final isUs = user.id == bloc.profile!.userId;

    return ListTile(
      leading: CircleAvatar(
        backgroundImage:
            user.profilePictureUrl != null
                ? CachedNetworkImageProvider(user.profilePictureUrl!)
                : null,
        child: user.profilePictureUrl == null ? const Icon(Icons.person) : null,
      ),
      title: Text(
        user.fullName,
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle:
          user.headline != null
              ? Text(
                user.headline!,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              )
              : null,
      trailing:
          isUs
              ? null
              : IconButton(
                icon: const Icon(Icons.person_add_alt_1_outlined),
                onPressed: () => _showConnectBottomSheet(context),
              ),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => UserProfilePage(
                  profileId: user.id == bloc.profile!.userId ? null : user.id,
                ),
          ),
        );
      },
    );
  }
}
