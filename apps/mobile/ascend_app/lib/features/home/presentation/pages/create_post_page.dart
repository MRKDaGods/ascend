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
import 'package:ascend_app/features/profile/models/user_profile_model.dart'; // Import UserProfileModel
import 'package:ascend_app/features/home/presentation/widgets/comment/user_tagging_overlay.dart'; // Import UserTaggingOverlay
import 'package:ascend_app/shared/data/mock_users.dart'; // Import MockUserData
import 'package:http/http.dart' as http; // Import http package
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart'; // Import secure storage
import 'package:path/path.dart' as path; // Import path package
import 'package:mime/mime.dart'; // Import mime package
import 'package:http_parser/http_parser.dart'; // Import for MediaType

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  final TextEditingController _textController = TextEditingController();
  final FocusNode _focusNode = FocusNode(); // Add FocusNode
  final ImagePicker _picker = ImagePicker();
  bool _canPost = false;
  String _selectedVisibility = 'Anyone';
  String _commentControl = 'Anyone';
  bool _brandPartnership = false;
  DateTime? _scheduledDateTime;
  List<XFile> _selectedImages = []; // List to hold selected images
  bool _isLoading = false; // Add loading state

  // Tagging related state variables
  final LayerLink _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  List<UserProfileModel> _suggestedUsers = [];
  String _currentTagQuery = '';
  bool _showTaggingOverlay = false;
  int _tagStartIndex = -1;

  @override
  void initState() {
    super.initState();
    _textController.addListener(_handleTextChanged); // Use combined listener
    _focusNode.addListener(_handleFocusChange); // Add focus listener
  }

  @override
  void dispose() {
    _textController.removeListener(_handleTextChanged);
    _focusNode.removeListener(_handleFocusChange);
    _removeOverlay(); // Ensure overlay is removed on dispose
    _textController.dispose();
    _focusNode.dispose(); // Dispose focus node
    super.dispose();
  }

  // Combined listener for text changes and tagging
  void _handleTextChanged() {
    _updateCanPost(); // Update post button state

    // Tagging logic
    final text = _textController.text;
    final selection = _textController.selection;

    if (selection.isCollapsed) {
      final cursorPosition = selection.baseOffset;
      int potentialTagStart = -1;

      // Find the start of the potential tag (@)
      for (int i = cursorPosition - 1; i >= 0; i--) {
        if (text[i] == '@') {
          // Ensure it's the start of a word or the beginning of the text
          if (i == 0 || RegExp(r'\s').hasMatch(text[i - 1])) {
            potentialTagStart = i;
            break;
          } else {
            break; // '@' is in the middle of a word
          }
        }
        // Stop searching if we hit whitespace going backwards
        if (RegExp(r'\s').hasMatch(text[i])) {
          break;
        }
      }

      if (potentialTagStart != -1) {
        final query = text.substring(potentialTagStart + 1, cursorPosition);
        // Basic check to prevent tags with spaces
        if (!query.contains(RegExp(r'\s'))) {
          _tagStartIndex = potentialTagStart;
          _currentTagQuery = query;
          _fetchUserSuggestions(query); // Fetch suggestions
        } else {
          _hideUserSuggestions(); // Hide if query contains space
        }
      } else {
        _tagStartIndex = -1; // Explicitly reset tag start index
        _hideUserSuggestions(); // Hide if no '@' trigger found
      }
    } else {
      _hideUserSuggestions(); // Hide if text is selected
    }
  }

  // Handle focus changes to hide overlay
  void _handleFocusChange() {
    if (!_focusNode.hasFocus) {
      _hideUserSuggestions();
    }
  }

  void _updateCanPost() {
    setState(() {
      _canPost = _textController.text.trim().isNotEmpty || _selectedImages.isNotEmpty;
    });
  }

  // --- API Submission Logic ---
  Future<void> _submitPost() async {
    if (!_canPost || _isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final token = await SecureStorageHelper.getAuthToken();
      if (token == null) {
        throw Exception('Authentication token not found.');
      }

      final url = Uri.parse('https://api.ascendx.tech/post');
      final request = http.MultipartRequest('POST', url);

      // Add headers
      request.headers['Authorization'] = 'Bearer $token';
      request.headers['Accept'] = 'application/json';
      if (_selectedImages.isEmpty) {
        request.headers['x-no-parse-body'] = '1';
      }

      // Map visibility to privacy
      String privacy = 'public'; // Default
      if (_selectedVisibility == 'Connections only') {
        privacy = 'private';
      }

      // Add text fields
      request.fields['content'] = _textController.text;
      request.fields['privacy'] = privacy;
      request.fields['title'] = _textController.text; // Using content as title for now
      request.fields['description'] = ''; // Empty description as requested

      // Conditionally add type and media files
      if (_selectedImages.isNotEmpty) {
        request.fields['type'] = 'image'; // Only add type if images exist
        print('[SubmitPost] Adding ${_selectedImages.length} image(s).');
        for (var i = 0; i < _selectedImages.length; i++) {
          var file = _selectedImages[i];
          final filename = path.basename(file.path);
          print('[SubmitPost] Processing file ${i + 1}: ${file.path}');

          // Read file bytes first
          final fileBytes = await file.readAsBytes();

          // Determine content type using header bytes
          final headerBytes = fileBytes.length > 1024 ? fileBytes.sublist(0, 1024) : fileBytes;
          String? mimeType = lookupMimeType(filename, headerBytes: headerBytes);
          MediaType? contentType;
          if (mimeType != null) {
            contentType = MediaType.parse(mimeType);
          } else {
            contentType = MediaType('application', 'octet-stream'); // Fallback
            print('[SubmitPost] Warning: Could not determine MIME type for $filename. Using fallback.');
          }

          // Try using MultipartFile.fromPath
          print('[SubmitPost] Attaching file ${i + 1}: $filename with Content-Type: ${contentType.toString()} using fromPath to field media');
          final multipartFile = await http.MultipartFile.fromPath(
            'media', // Correct field name
            file.path, // Pass the file path
            filename: filename, // Optional: Explicitly set filename if different from path basename
            contentType: contentType, // Explicitly set Content-Type
          );
          request.files.add(multipartFile);
        }
      } else {
        print('[SubmitPost] No images selected. Sending text-only post.');
      }

      print('Sending POST request to $url with fields: ${request.fields}, files: ${request.files.length}, headers: ${request.headers}');

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      print('Create Post Response status: ${response.statusCode}');
      print('Create Post Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Success
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Post created successfully!')),
          );
          Navigator.of(context).pop(); // Go back after successful post
        }
      } else {
        // Handle error
        throw Exception('Failed to create post: ${response.statusCode} ${response.body}');
      }
    } catch (e) {
      print('Error creating post: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to create post: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
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

  // --- Tagging Methods ---

  Future<void> _fetchUserSuggestions(String query) async {
    // Store the tag start index at the time of fetch request
    final int fetchTagStartIndex = _tagStartIndex;

    try {
      final users = await MockUserData.searchUsers(query);

      if (mounted) { // Check if the widget is still mounted
        // Check if the tag context is still valid (cursor hasn't moved away)
        if (_tagStartIndex == fetchTagStartIndex) {
          setState(() {
            _suggestedUsers = users;
          });
          // Now explicitly call show/hide based on results
          if (_suggestedUsers.isNotEmpty) {
            _showUserSuggestions();
          } else {
            _hideUserSuggestions();
          }
        } else {
          // If _tagStartIndex changed while fetching, the context is stale, do nothing or hide.
          _hideUserSuggestions();
        }
      }
    } catch (e) {
      print("Error fetching user suggestions: $e");
      if (mounted) {
        setState(() {
          _suggestedUsers = [];
        });
        _hideUserSuggestions();
      }
    }
  }

  void _showUserSuggestions() {
    print('[Tagging] Attempting to show suggestions. Overlay exists: ${_overlayEntry != null}, Users: ${_suggestedUsers.length}'); // Debugging
    if (!mounted) {
      print('[Tagging] Widget not mounted, aborting show suggestions.');
      return;
    }

    if (_overlayEntry == null && _suggestedUsers.isNotEmpty) {
      print('[Tagging] Creating and inserting overlay.'); // Debugging
      _overlayEntry = _createOverlayEntry();
      // Ensure Overlay.of(context) is not null before inserting
      final overlay = Overlay.of(context);
      if (overlay != null) {
        overlay.insert(_overlayEntry!);
        print('[Tagging] Overlay inserted.'); // Debugging
        setState(() {
          _showTaggingOverlay = true;
        });
      } else {
        print('[Tagging] Error: Overlay.of(context) is null.'); // Debugging
      }
    } else if (_overlayEntry != null && _suggestedUsers.isEmpty) {
      print('[Tagging] Hiding overlay because no users.'); // Debugging
      _hideUserSuggestions(); // Hide if no users match
    } else if (_overlayEntry != null) {
      print('[Tagging] Overlay exists, marking for rebuild.'); // Debugging
      // If overlay exists, just rebuild it with new suggestions
      _overlayEntry?.markNeedsBuild();
      if (!_showTaggingOverlay) {
        setState(() {
          _showTaggingOverlay = true;
        });
      }
    }
  }

  void _hideUserSuggestions() {
    print('[Tagging] Attempting to hide suggestions. Overlay exists: ${_overlayEntry != null}, Show flag: $_showTaggingOverlay'); // Debugging
    if (_overlayEntry != null) {
      print('[Tagging] Removing overlay.'); // Debugging
      _removeOverlay();
    }
    // Use mounted check before setState
    if (mounted && _showTaggingOverlay) {
      print('[Tagging] Resetting tagging state.'); // Debugging
      setState(() {
        _showTaggingOverlay = false;
        _suggestedUsers = [];
        _currentTagQuery = '';
        _tagStartIndex = -1;
      });
    } else if (_tagStartIndex != -1) {
       // Ensure tagStartIndex is reset even if overlay wasn't shown yet
       print('[Tagging] Resetting tagStartIndex as overlay was not shown.'); // Debugging
       _tagStartIndex = -1;
    }
  }

  void _removeOverlay() {
    // Add safety check
    try {
       _overlayEntry?.remove();
    } catch (e) {
       print("[Tagging] Error removing overlay: $e");
    }
    _overlayEntry = null;
  }

  OverlayEntry _createOverlayEntry() {
    // Simplified positioning: Directly below the TextField using the LayerLink offset.
    // The CompositedTransformFollower handles the positioning relative to the Target.
    print('[Tagging] Creating OverlayEntry definition.'); // Debugging
    return OverlayEntry(
      builder: (overlayContext) { // Use a different name to avoid confusion with state's context
        print('[Tagging] Building OverlayEntry content.'); // Debugging
        // Get RenderBox using the State's context, which is associated with the CompositedTransformTarget
        final RenderBox? renderBox = context.findRenderObject() as RenderBox?;
        final size = renderBox?.size ?? Size(MediaQuery.of(overlayContext).size.width * 0.9, 150); // Fallback size

        return Positioned(
          // Positioned relative to the screen, but CompositedTransformFollower adjusts it
          width: size.width, // Match width of the TextField
          child: CompositedTransformFollower(
            link: _layerLink,
            showWhenUnlinked: false,
            // Offset below the TextField. Adjust the dy value for spacing.
            offset: const Offset(0, 5), // 5 pixels below the TextField
            child: UserTaggingOverlay(
              users: _suggestedUsers,
              onUserSelected: _insertTag,
            ),
          ),
        );
      },
    );
  }

  void _insertTag(UserProfileModel user) {
    if (_tagStartIndex == -1) return;

    final currentText = _textController.text;
    final selection = _textController.selection;
    final cursorPosition = selection.baseOffset;

    if (_tagStartIndex < 0 || cursorPosition < _tagStartIndex) {
      _hideUserSuggestions();
      return;
    }

    final textBeforeTag = currentText.substring(0, _tagStartIndex);
    final textAfterTag = cursorPosition <= currentText.length ? currentText.substring(cursorPosition) : '';

    final tag = '@${user.name} '; // Add space after tag
    final newText = textBeforeTag + tag + textAfterTag;
    final newCursorPosition = _tagStartIndex + tag.length;

    _textController.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: newCursorPosition),
    );

    _hideUserSuggestions();
  }

  // --- End Tagging Methods ---

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
              onPressed: (_canPost && !_isLoading) ? _submitPost : null, // Call _submitPost
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 20),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Text(postButtonText),
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
                    // Wrap TextField with CompositedTransformTarget
                    CompositedTransformTarget(
                      link: _layerLink,
                      child: TextField(
                        controller: _textController,
                        focusNode: _focusNode, // Assign focus node
                        maxLines: null,
                        minLines: 5,
                        keyboardType: TextInputType.multiline,
                        decoration: const InputDecoration(
                          hintText: 'What do you want to talk about?',
                          border: InputBorder.none,
                        ),
                        style: const TextStyle(fontSize: 18),
                      ),
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
