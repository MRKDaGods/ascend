// ignore_for_file: use_build_context_synchronously

import 'package:ascend_app/core/constants/api_endpoints.dart';
import 'package:ascend_app/features/home/bloc/search/search_bloc.dart';
import 'package:ascend_app/features/home/presentation/pages/ultimate_search_page.dart';
import 'package:ascend_app/features/home/repositories/search_repository.dart';
import 'package:ascend_app/features/networks/model/connected_user.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:ascend_app/features/StartPages/repository/api_client.dart';
import 'package:mockito/mockito.dart';

enum SortOption { recentlyAdded, firstName, lastName }

class Connections extends StatefulWidget {
  final List<ConnectedUser> connections;
  final Function(String) onRemove;

  const Connections({
    super.key,
    required this.connections,
    required this.onRemove,
  });

  @override
  State<Connections> createState() => _ConnectionsState();
}

class _ConnectionsState extends State<Connections> {
  SortOption _selectedSortOption = SortOption.recentlyAdded;
  // API Client

  final ApiClient _apiClient = ApiClient();

  void _showSortOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: const Text(
                      'Sort by',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    children: [
                      _buildSortChip(
                        'Recently Added',
                        SortOption.recentlyAdded,
                        setState,
                      ),
                      _buildSortChip(
                        'First Name',
                        SortOption.firstName,
                        setState,
                      ),
                      _buildSortChip(
                        'Last Name',
                        SortOption.lastName,
                        setState,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      setState(() {
                        // Apply the sorting in the parent widget state
                        this.setState(() {});
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      backgroundColor: const Color(
                        0xFF0077B5,
                      ), // LinkedIn blue color
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Show Results'),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSortChip(
    String label,
    SortOption option,
    Function(void Function()) setModalState,
  ) {
    final isSelected = _selectedSortOption == option;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setModalState(() {
            setState(() {
              _selectedSortOption = option;
            });
          });
        }
      },
      backgroundColor: Colors.grey[200],
      selectedColor: const Color(
        0xFF006400,
      ).withOpacity(0.2), // Dark green color
      labelStyle: TextStyle(
        color:
            isSelected
                ? const Color(0xFF006400)
                : Colors.black, // Dark green text for selected chip
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  List<ConnectedUser> _getSortedConnections(List<ConnectedUser> connections) {
    final sortedConnections = List<ConnectedUser>.from(connections);

    switch (_selectedSortOption) {
      case SortOption.recentlyAdded:
        // Assuming connected_at is a date string that can be parsed
        sortedConnections.sort(
          (a, b) => b.connected_at!.compareTo(a.connected_at!),
        );
        break;
      case SortOption.firstName:
        sortedConnections.sort(
          (a, b) => a.first_name!.toLowerCase().compareTo(
            b.first_name!.toLowerCase(),
          ),
        );
        break;
      case SortOption.lastName:
        sortedConnections.sort(
          (a, b) =>
              a.last_name!.toLowerCase().compareTo(b.last_name!.toLowerCase()),
        );
        break;
    }

    return sortedConnections;
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConnectionRequestBloc, ConnectionRequestState>(
      builder: (context, state) {
        if (state is ConnectionRequestLoading) {
          return Scaffold(
            appBar: AppBar(title: Text('Connections'), centerTitle: true),
            body: const Center(child: CircularProgressIndicator()),
          );
        } else if (state is ConnectionRequestSuccess) {
          final connections = _getSortedConnections(state.acceptedConnections);

          return Scaffold(
            appBar: AppBar(
              title: Text('Connections'),
              centerTitle: true,
              backgroundColor: Colors.white,
              elevation: 0,
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(0),
                child: Container(color: Colors.grey[300], height: 1),
              ),
            ),
            body: Column(
              children: [
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${state.acceptedConnections.length} Connections',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.search),
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) {
                                    return BlocProvider(
                                      create:
                                          (context) => SearchBloc(
                                            searchRepository:
                                                SearchRepository(),
                                          ),
                                      child: const UltimateSearchPage(),
                                    );
                                  },
                                ),
                              );
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.filter_list),
                            onPressed: () => _showSortOptions(context),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Divider(color: Colors.grey, thickness: 1, height: 1),
                if (connections.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text('No connections'),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      itemCount: connections.length,
                      itemBuilder: (context, index) {
                        final connection = connections[index];

                        return InkWell(
                          onTap: () {
                            // Optional: Navigate to user profile when clicked
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 16,
                            ),
                            color: Colors.white,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Profile image
                                connection.profile_image_url != null
                                    ? CircleAvatar(
                                      radius: 24,
                                      backgroundImage: NetworkImage(
                                        connection.profile_image_url!,
                                      ),
                                    )
                                    : CircleAvatar(
                                      radius: 24,
                                      backgroundImage: const AssetImage(
                                        'assets/EmptyUser.png',
                                      ),
                                    ),
                                const SizedBox(width: 12),

                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  '${connection.first_name} ${connection.last_name}',
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 16,
                                                  ),
                                                ),
                                                if (connection.headline !=
                                                    null) ...[
                                                  Text(
                                                    connection.headline!,
                                                    style: TextStyle(
                                                      fontSize: 14,
                                                      color: Colors.grey[600],
                                                    ),
                                                    maxLines: 2,
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                                ],
                                                // Connection date
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                        top: 4,
                                                      ),
                                                  child: Text(
                                                    'Connected on ${connection.connected_at}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey[500],
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              _buildActionButton(
                                                onPressed:
                                                    () => _showOptionsModal(
                                                      context,
                                                      connection.user_id!,
                                                    ),
                                                icon: Icons.more_vert,
                                                backgroundColor:
                                                    Colors.transparent,
                                                iconColor: Colors.grey[800]!,
                                                hasBorder: false,
                                              ),
                                              const SizedBox(width: 8),
                                              _buildActionButton(
                                                onPressed: () {
                                                  _messageConnection(
                                                    context,
                                                    connection,
                                                  );
                                                },
                                                icon: Icons.send,
                                                backgroundColor:
                                                    Colors.transparent,
                                                iconColor: Colors.grey[800]!,
                                                hasBorder: false,
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                      separatorBuilder:
                          (context, index) => const Divider(
                            height: 1,
                            thickness: 1,
                            indent: 0,
                            endIndent: 0,
                          ),
                    ),
                  ),
              ],
            ),
          );
        } else {
          return Center(child: Text('Error loading connections'));
        }
      },
    );
  }

  void _showOptionsModal(BuildContext context, String requestId) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListTile(
            leading: const Icon(Icons.delete),
            title: const Text(
              'Remove Connection',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            onTap: () {
              Future.delayed(Duration.zero, () {
                // ignore: use_build_context_synchronously
                Navigator.of(context).pop();
              });
              widget.onRemove(requestId); // Call the remove function
            },
          ),
        );
      },
    );
  }

  Widget _buildActionButton({
    required VoidCallback onPressed,
    required IconData icon,
    required Color backgroundColor,
    required Color iconColor,
    bool hasBorder = true,
    Color borderColor = Colors.grey,
  }) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: backgroundColor,
          border: hasBorder ? Border.all(color: borderColor, width: 1.5) : null,
        ),
        child: Center(child: Icon(icon, color: iconColor, size: 22)),
      ),
    );
  }

  void _messageConnection(BuildContext context, ConnectedUser connection) {
    // Check if the connection has a valid user ID
    if (connection.user_id == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot start chat with this user')),
      );
      return;
    }

    // Show message dialog instead of navigating
    _showMessageDialog(context, connection);
  }

  void _showMessageDialog(BuildContext context, ConnectedUser connection) {
    final TextEditingController messageController = TextEditingController();
    File? selectedFile;
    String? fileType;
    String? fileName;

    // Define a helper function inside this method to handle image picking
    Future<void> _pickAndSetImageInternal(
      Function(void Function()) stateSetter,
    ) async {
      try {
        final picker = ImagePicker();
        final pickedFile = await picker.pickImage(
          source: ImageSource.gallery,
          imageQuality: 80,
        );

        if (pickedFile != null) {
          final file = File(pickedFile.path);
          if (file.existsSync()) {
            debugPrint(
              'Image selected: ${file.path}, Size: ${file.lengthSync()} bytes',
            );
            stateSetter(() {
              selectedFile = file;
              fileType = 'image';
              fileName = pickedFile.path.split('/').last;
            });
          } else {
            // ...existing code...
          }
        }
      } catch (e) {
        // ...existing code...
      }
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Material(
              type: MaterialType.transparency,
              child: Center(
                child: Container(
                  margin: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Dialog header
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 20,
                              backgroundImage:
                                  connection.profile_image_url != null
                                      ? NetworkImage(
                                        connection.profile_image_url!,
                                      )
                                      : const AssetImage('assets/EmptyUser.png')
                                          as ImageProvider,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '${connection.first_name} ${connection.last_name}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  if (connection.headline != null)
                                    Text(
                                      connection.headline!,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      const Divider(height: 1),

                      // Dialog content - wrap in ConstrainedBox to limit height
                      ConstrainedBox(
                        constraints: BoxConstraints(
                          maxHeight: MediaQuery.of(context).size.height * 0.5,
                        ),
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // File preview if selected
                              if (selectedFile != null) ...[
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Selected ${fileType?.toUpperCase() ?? "File"}:',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                        ),
                                      ),
                                      const SizedBox(height: 4),

                                      // Simple file preview with close button
                                      fileType == 'image'
                                          ? Stack(
                                            children: [
                                              ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(8),
                                                child:
                                                    selectedFile!.existsSync()
                                                        ? Image.file(
                                                          selectedFile!,
                                                          height: 100,
                                                          width:
                                                              double.infinity,
                                                          fit: BoxFit.cover,
                                                          errorBuilder:
                                                              (
                                                                _,
                                                                __,
                                                                ___,
                                                              ) => const SizedBox(
                                                                height: 100,
                                                                child: Center(
                                                                  child: Text(
                                                                    'Failed to load image',
                                                                  ),
                                                                ),
                                                              ),
                                                        )
                                                        : const SizedBox(
                                                          height: 100,
                                                          child: Center(
                                                            child: Text(
                                                              'File not found',
                                                            ),
                                                          ),
                                                        ),
                                              ),
                                              Positioned(
                                                top: 0,
                                                right: 0,
                                                child: GestureDetector(
                                                  onTap:
                                                      () => setState(() {
                                                        selectedFile = null;
                                                        fileType = null;
                                                        fileName = null;
                                                      }),
                                                  child: Container(
                                                    padding:
                                                        const EdgeInsets.all(4),
                                                    decoration: BoxDecoration(
                                                      color: Colors.black
                                                          .withOpacity(0.7),
                                                      shape: BoxShape.circle,
                                                    ),
                                                    child: const Icon(
                                                      Icons.close,
                                                      color: Colors.white,
                                                      size: 14,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                          : ListTile(
                                            leading: Icon(
                                              fileType == 'video'
                                                  ? Icons.video_file
                                                  : fileType == 'audio'
                                                  ? Icons.audio_file
                                                  : Icons.insert_drive_file,
                                            ),
                                            title: Text(
                                              fileName ?? 'Selected file',
                                            ),
                                            trailing: IconButton(
                                              icon: const Icon(Icons.close),
                                              onPressed:
                                                  () => setState(() {
                                                    selectedFile = null;
                                                    fileType = null;
                                                    fileName = null;
                                                  }),
                                            ),
                                          ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 16),
                              ],

                              // Message field
                              TextField(
                                controller: messageController,
                                decoration: const InputDecoration(
                                  hintText: 'Write a message...',
                                  border: OutlineInputBorder(),
                                  contentPadding: EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 12,
                                  ),
                                ),
                                maxLines: 3,
                                minLines: 3,
                              ),
                              const SizedBox(height: 16),

                              // Attachment options in a simplified layout
                              Wrap(
                                alignment: WrapAlignment.spaceAround,
                                spacing: 16,
                                children: [
                                  _buildAttachmentButton(
                                    key: UniqueKey(),
                                    icon: Icons.image,
                                    label: 'Image',
                                    onTap:
                                        () =>
                                            _pickAndSetImageInternal(setState),
                                  ),
                                  _buildAttachmentButton(
                                    key: UniqueKey(),
                                    icon: Icons.videocam,
                                    label: 'Video',
                                    onTap: () async {
                                      try {
                                        final picker = ImagePicker();
                                        final pickedFile = await picker
                                            .pickVideo(
                                              source: ImageSource.gallery,
                                            );
                                        if (pickedFile != null) {
                                          setState(() {
                                            selectedFile = File(
                                              pickedFile.path,
                                            );
                                            fileType = 'video';
                                            fileName =
                                                pickedFile.path.split('/').last;
                                          });
                                        }
                                      } catch (e) {
                                        debugPrint('Error picking video: $e');
                                      }
                                    },
                                  ),
                                  _buildAttachmentButton(
                                    key: UniqueKey(),
                                    icon: Icons.mic,
                                    label: 'Audio',
                                    onTap: () async {
                                      try {
                                        FilePickerResult? result =
                                            await FilePicker.platform.pickFiles(
                                              type: FileType.audio,
                                              allowMultiple: false,
                                            );
                                        if (result != null &&
                                            result.files.single.path != null) {
                                          setState(() {
                                            selectedFile = File(
                                              result.files.single.path!,
                                            );
                                            fileType = 'audio';
                                            fileName = result.files.single.name;
                                          });
                                        }
                                      } catch (e) {
                                        debugPrint('Error picking audio: $e');
                                      }
                                    },
                                  ),
                                  _buildAttachmentButton(
                                    key: UniqueKey(),
                                    icon: Icons.insert_drive_file,
                                    label: 'File',
                                    onTap: () async {
                                      try {
                                        FilePickerResult? result =
                                            await FilePicker.platform.pickFiles(
                                              allowMultiple: false,
                                            );
                                        if (result != null &&
                                            result.files.single.path != null) {
                                          setState(() {
                                            selectedFile = File(
                                              result.files.single.path!,
                                            );
                                            fileType = 'file';
                                            fileName = result.files.single.name;
                                          });
                                        }
                                      } catch (e) {
                                        debugPrint('Error picking file: $e');
                                      }
                                    },
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),

                      const Divider(height: 1),

                      // Dialog actions
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(),
                              child: const Text('CANCEL'),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: () async {
                                final message = messageController.text.trim();
                                if (message.isNotEmpty ||
                                    selectedFile != null) {
                                  // Store the ScaffoldMessenger reference before closing the dialog
                                  final scaffoldMessenger =
                                      ScaffoldMessenger.of(context);
                                  final userName = connection.first_name;
                                  final userId = connection.user_id!;

                                  // Close dialog first
                                  Navigator.of(context).pop();

                                  // Then send the message
                                  try {
                                    if (selectedFile != null) {
                                      await _sendMediaMessage(
                                        context,
                                        userId,
                                        message,
                                        selectedFile!,
                                        fileType ?? 'file',
                                      );
                                    } else {
                                      await _sendMessage(
                                        context,
                                        userId,
                                        message,
                                      );
                                    }

                                    // Show confirmation using stored reference
                                    scaffoldMessenger.showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Message sent to $userName',
                                        ),
                                      ),
                                    );
                                  } catch (e) {
                                    // Show error using stored reference
                                    scaffoldMessenger.showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Error sending message: ${e.toString()}',
                                        ),
                                      ),
                                    );
                                  }
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0077B5),
                              ),
                              child: const Text('SEND'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Helper method to build error widget for image loading issues
  Widget _buildImageErrorWidget({String message = 'Could not display image'}) {
    return Container(
      height: 120,
      width: double.infinity,
      color: Colors.grey[300],
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, color: Colors.red[400], size: 28),
            const SizedBox(height: 8),
            Text(message, style: const TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }

  Widget _buildAttachmentButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Key? key, // Add key parameter
  }) {
    return InkWell(
      key: key, // Use the provided key
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: const Color(0xFF0077B5), size: 20),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(fontSize: 12, color: Colors.grey[700]),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _sendMessage(
    BuildContext context,
    String userId,
    String message,
  ) async {
    try {
      // Send the Message
      await _apiClient.post(
        ApiEndpoints.message,
        data: {'receiverId': userId, 'content': message},
      );
      // No SnackBar here - will be shown by the calling method
    } catch (e) {
      debugPrint('Error sending message: $e');
      // Let the calling code handle errors
      rethrow;
    }
  }

  Future<void> _sendMediaMessage(
    BuildContext context,
    String userId,
    String message,
    File mediaFile,
    String mediaType,
  ) async {
    try {
      final body = {'receiverId': userId, 'content': message};
      await _apiClient.uploadFile(
        ApiEndpoints.message,
        mediaFile,
        'message',
        body: body,
      );
      // No SnackBar here - will be shown by the calling method
    } catch (e) {
      debugPrint('Error sending media message: $e');
      // Let the calling code handle errors
      rethrow;
    }
  }
}
