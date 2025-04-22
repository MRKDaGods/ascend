import 'dart:io'; // Import for File
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
  List<XFile> _selectedImages = []; // List to hold selected images

  @override
  void initState() {
    super.initState();
    _textController.addListener(_updateCanPost);
  }

  @override
  void dispose() {
    _textController.removeListener(_updateCanPost);
    _textController.dispose();
    super.dispose();
  }

  void _updateCanPost() {
    setState(() {
      _canPost = _textController.text.trim().isNotEmpty || _selectedImages.isNotEmpty;
    });
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
      isScrollControlled: true,
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
  void _showPostTypeSelectionGrid(BuildContext context) async {
    final List<XFile>? imagesFromGrid = await showModalBottomSheet<List<XFile>?>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext bc) {
        return const PostTypeSelectionGrid();
      },
    );

    if (imagesFromGrid != null && imagesFromGrid.isNotEmpty) {
      setState(() {
        _selectedImages.addAll(imagesFromGrid);
        _updateCanPost();
      });
      print('${imagesFromGrid.length} images selected from grid.');
    }
  }

  // Method to handle picking multiple images directly
  Future<void> _pickImage() async {
    try {
      final List<XFile> images = await _picker.pickMultiImage();
      if (images.isNotEmpty) {
        setState(() {
          _selectedImages.addAll(images);
          _updateCanPost();
        });
        print('${images.length} images picked directly.');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('${images.length} image(s) selected.')),
          );
        }
      } else {
        print('Image picking cancelled or no images selected.');
      }
    } catch (e) {
      print('Error picking images: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking images: $e')),
        );
      }
    }
  }

  // Method to remove an image
  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
      _updateCanPost();
    });
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
                      final postText = _textController.text;
                      final imagePaths = _selectedImages.map((f) => f.path).toList();
                      if (_scheduledDateTime != null) {
                        print('Scheduling post for: $_scheduledDateTime');
                        print('Text: $postText');
                        print('Images: $imagePaths');
                      } else {
                        print('Posting immediately');
                        print('Text: $postText');
                        print('Images: $imagePaths');
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
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _textController,
                      maxLines: null,
                      minLines: 5,
                      keyboardType: TextInputType.multiline,
                      decoration: const InputDecoration(
                        hintText: 'What do you want to talk about?',
                        border: InputBorder.none,
                      ),
                      style: const TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 16),
                    if (_selectedImages.isNotEmpty) _buildImagePreviews(),
                  ],
                ),
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
                  tooltip: 'Add photo(s)',
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

  Widget _buildImagePreviews() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 4.0,
        mainAxisSpacing: 4.0,
      ),
      itemCount: _selectedImages.length,
      itemBuilder: (context, index) {
        return Stack(
          children: [
            Image.file(
              File(_selectedImages[index].path),
              fit: BoxFit.cover,
              width: double.infinity,
              height: double.infinity,
            ),
            Positioned(
              top: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => _removeImage(index),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.6),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.close, color: Colors.white, size: 18),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
