import 'package:ascend_app/features/home/presentation/widgets/create_post/comment_control_sheet.dart';
import 'package:ascend_app/features/home/presentation/widgets/create_post/visibility_options_sheet.dart';
import 'package:ascend_app/features/home/presentation/widgets/create_post/schedule_post_bottom_sheet.dart';
import 'package:ascend_app/features/home/presentation/widgets/create_post/post_type_selection_grid.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_state.dart';
import 'package:ascend_app/shared/widgets/user_avatar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final TextEditingController _textController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  bool _canPost = false;
  String _selectedVisibility = 'Anyone';
  String _commentControl = 'Anyone';
  bool _brandPartnership = false;
  DateTime? _scheduledDateTime;

  @override
  void initState() {
    super.initState();
    _textController.addListener(() {
      setState(() {
        _canPost = _textController.text.trim().isNotEmpty;
      });
    });
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  // Method to show the visibility options bottom sheet
  void _showVisibilityOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext bc) {
        return VisibilityOptionsSheet(
          initialSelectedVisibility: _selectedVisibility,
          initialCommentControl: _commentControl,
          initialBrandPartnership: _brandPartnership,
          onVisibilityChanged: (value) {
            setState(() {
              _selectedVisibility = value;
            });
          },
          onCommentControlTap: () {
            // This is called after the first sheet is popped
            _showCommentControlOptions(context);
          },
          onBrandPartnershipChanged: (value) {
            setState(() {
              _brandPartnership = value;
            });
          },
        );
      },
    );
  }

  // Method to show the comment control options bottom sheet
  void _showCommentControlOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Added for consistency if content grows
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext bc) {
        return CommentControlSheet(
          initialCommentControl: _commentControl,
          onCommentControlConfirmed: (value) {
            setState(() {
              _commentControl = value;
            });
          },
        );
      },
    );
  }

  // Method to show the schedule bottom sheet
  void _showScheduleOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext bc) {
        return SchedulePostBottomSheet(
          onScheduleConfirmed: (DateTime? selectedDateTime) {
            setState(() {
              _scheduledDateTime = selectedDateTime;
            });
          },
        );
      },
    );
  }

  // Method to show the post type selection grid bottom sheet
  void _showPostTypeSelectionGrid(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Allows the sheet to take up more height if needed
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext bc) {
        // Wrap the grid in a container or SizedBox if you need to control its height
        return const PostTypeSelectionGrid();
      },
    );
  }

  // Method to handle picking an image directly
  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        print('Image picked directly: ${image.path}');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Selected image: ${image.path}')),
          );
          // TODO: Add logic to handle the selected image (e.g., display preview)
        }
      } else {
        print('Image picking cancelled.');
      }
    } catch (e) {
      print('Error picking image: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final String postButtonText = _scheduledDateTime != null ? 'Schedule' : 'Post';

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: BlocBuilder<UserProfileBloc, UserProfileState>(
          builder: (context, state) {
            final profile = state is UserProfileLoaded ? state.profile : null;
            return Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                UserAvatar(
                  imageUrl: profile?.avatarUrl,
                  radius: 18,
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: TextButton(
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    onPressed: () => _showVisibilityOptions(context),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Flexible(
                          child: Text(
                            _selectedVisibility,
                            style: TextStyle(
                              fontSize: 16,
                              color: Theme.of(context).textTheme.titleLarge?.color,
                              fontWeight: FontWeight.normal,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(Icons.arrow_drop_down, size: 24),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.schedule),
            tooltip: 'Schedule post',
            onPressed: () {
              _showScheduleOptions(context);
            },
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: ElevatedButton(
              onPressed: _canPost
                  ? () {
                      if (_scheduledDateTime != null) {
                        print('Scheduling post for: $_scheduledDateTime');
                      } else {
                        print('Posting immediately');
                      }
                      Navigator.of(context).pop();
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 20),
              ),
              child: Text(postButtonText),
            ),
          ),
        ],
        elevation: 1,
      ),
      body: Column(
        children: [
          if (_scheduledDateTime != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Row(
                children: [
                  Icon(Icons.public, size: 16, color: Theme.of(context).hintColor),
                  const SizedBox(width: 8),
                  Text(
                    'Posting ${DateFormat("E, MMM d 'at' h:mm a").format(_scheduledDateTime!)}.',
                    style: TextStyle(color: Theme.of(context).hintColor),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () => _showScheduleOptions(context),
                    child: Text(
                      'Edit',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                controller: _textController,
                maxLines: null,
                expands: true,
                keyboardType: TextInputType.multiline,
                decoration: const InputDecoration(
                  hintText: 'What do you want to talk about?',
                  border: InputBorder.none,
                ),
                style: const TextStyle(fontSize: 18),
              ),
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.image_outlined),
                  tooltip: 'Add photo',
                  onPressed: _pickImage,
                ),
                IconButton(
                  icon: const Icon(Icons.calendar_today_outlined),
                  tooltip: 'Create event',
                  onPressed: () {
                    // TODO: Implement add event functionality
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.more_horiz_rounded),
                  tooltip: 'More post options',
                  onPressed: () {
                    _showPostTypeSelectionGrid(context);
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
