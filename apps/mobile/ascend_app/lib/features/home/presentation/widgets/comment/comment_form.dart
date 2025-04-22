import 'package:flutter/material.dart';
import 'package:ascend_app/shared/widgets/user_avatar.dart';
import 'package:ascend_app/features/profile/models/user_profile_model.dart';
import 'package:ascend_app/features/home/presentation/widgets/comment/user_tagging_overlay.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/shared/data/mock_users.dart'; // Import the mock user data source

class CommentForm extends StatefulWidget {
  final TextEditingController controller;
  final FocusNode? focusNode;
  final Function(String) onSubmit;
  final VoidCallback? onTap;
  final String? hintText;
  final String? userAvatarUrl;
  final String? userName;
  final String? replyingTo;
  final VoidCallback? onCancelReply;

  const CommentForm({
    Key? key,
    required this.controller,
    this.focusNode,
    required this.onSubmit,
    this.onTap,
    this.hintText,
    this.userAvatarUrl,
    this.userName,
    this.replyingTo,
    this.onCancelReply,
  }) : super(key: key);

  @override
  State<CommentForm> createState() => _CommentFormState();
}

class _CommentFormState extends State<CommentForm> {
  final LayerLink _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  List<UserProfileModel> _suggestedUsers = [];
  String _currentTagQuery = '';
  bool _showTaggingOverlay = false;
  int _tagStartIndex = -1;

  final List<UserProfileModel> _mockUsers = [
    UserProfileModel(id: '1', name: 'Rafat Sarosh', avatarUrl: 'assets/EmptyUser.png', position: 'AI for Enterprise'),
    UserProfileModel(id: '2', name: 'Abdallah Khalil', avatarUrl: 'assets/EmptyUser.png', position: 'Ex-Software Testing Engineer'),
    UserProfileModel(id: '3', name: 'Ali Mamdouh', avatarUrl: 'assets/EmptyUser.png', position: 'Head of Embedded Team'),
    UserProfileModel(id: '4', name: 'Alan Levy', avatarUrl: 'assets/EmptyUser.png', position: 'Virtual Mentorship Leader'),
    UserProfileModel(id: '5', name: 'Ahmed Sarhan', avatarUrl: 'assets/EmptyUser.png', position: 'IT Helpdesk Specialist'),
    UserProfileModel(id: '6', name: 'Ahmed 2bany', avatarUrl: 'assets/EmptyUser.png', position: 'Interior Designer'),
    UserProfileModel(id: '7', name: 'Abdelrahman Amin', avatarUrl: 'assets/EmptyUser.png', position: 'Software Engineer'),
  ];

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_handleTextChanged);
    widget.focusNode?.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_handleTextChanged);
    widget.focusNode?.removeListener(_handleFocusChange);
    _removeOverlay();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!(widget.focusNode?.hasFocus ?? false)) {
      _hideUserSuggestions();
    }
  }

  void _handleTextChanged() {
    final text = widget.controller.text;
    final selection = widget.controller.selection;

    if (selection.isCollapsed) {
      final cursorPosition = selection.baseOffset;
      int potentialTagStart = -1;

      for (int i = cursorPosition - 1; i >= 0; i--) {
        if (text[i] == '@') {
          if (i == 0 || RegExp(r'\s').hasMatch(text[i - 1])) {
            potentialTagStart = i;
            break;
          } else {
            break;
          }
        }
        if (RegExp(r'\s').hasMatch(text[i])) {
          break;
        }
      }

      if (potentialTagStart != -1) {
        final query = text.substring(potentialTagStart + 1, cursorPosition);
        _tagStartIndex = potentialTagStart;
        _currentTagQuery = query;
        _fetchUserSuggestions(query);
        _showUserSuggestions();
      } else {
        _hideUserSuggestions();
      }
    } else {
      _hideUserSuggestions();
    }
  }

  void _fetchUserSuggestions(String query) {
    setState(() {
      if (query.isEmpty) {
        _suggestedUsers = _mockUsers.take(5).toList();
      } else {
        _suggestedUsers = _mockUsers
            .where((user) =>
                user.name.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
    if (_showTaggingOverlay) {
      _overlayEntry?.markNeedsBuild();
    }
  }

  void _showUserSuggestions() {
    if (_overlayEntry == null && _suggestedUsers.isNotEmpty) {
      _overlayEntry = _createOverlayEntry();
      Overlay.of(context).insert(_overlayEntry!);
      setState(() {
        _showTaggingOverlay = true;
      });
    } else if (_overlayEntry != null && _suggestedUsers.isEmpty) {
      _hideUserSuggestions();
    } else if (_overlayEntry != null) {
      _overlayEntry?.markNeedsBuild();
      if (!_showTaggingOverlay) {
        setState(() {
          _showTaggingOverlay = true;
        });
      }
    }
  }

  void _hideUserSuggestions() {
    if (_overlayEntry != null) {
      _removeOverlay();
    }
    if (_showTaggingOverlay) {
      setState(() {
        _showTaggingOverlay = false;
        _suggestedUsers = [];
        _currentTagQuery = '';
        _tagStartIndex = -1;
      });
    }
  }

  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }

  OverlayEntry _createOverlayEntry() {
    final renderBox = context.findRenderObject() as RenderBox?;
    final size = renderBox?.size ?? Size.zero;
    final offset = renderBox?.localToGlobal(Offset.zero) ?? Offset.zero;
    final screenHeight = MediaQuery.of(context).size.height;
    final overlayHeight = 150.0; // Estimated height of the overlay
    final textFieldHeight = size.height; // Height of the TextField area

    // Calculate space above and below
    final spaceAbove = offset.dy;
    final spaceBelow = screenHeight - (offset.dy + textFieldHeight);

    // Decide position: prefer below if enough space, otherwise above
    final bool showAbove = (spaceBelow < overlayHeight) && (spaceAbove > overlayHeight);

    // Calculate the vertical offset
    // If showing above, offset is negative overlay height.
    // If showing below, offset is the text field height.
    final verticalOffset = showAbove ? -overlayHeight : textFieldHeight;

    return OverlayEntry(
      builder: (context) => Positioned(
        width: size.width,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: Offset(0, verticalOffset),
          child: UserTaggingOverlay(
            users: _suggestedUsers,
            onUserSelected: _insertTag,
          ),
        ),
      ),
    );
  }

  void _insertTag(UserProfileModel user) {
    if (_tagStartIndex == -1) return;

    final currentText = widget.controller.text;
    final selection = widget.controller.selection;
    final cursorPosition = selection.baseOffset;

    final textBeforeTag = currentText.substring(0, _tagStartIndex);
    final textAfterTag = currentText.substring(cursorPosition);

    final tag = '@${user.name} ';
    final newText = textBeforeTag + tag + textAfterTag;

    final newCursorPosition = _tagStartIndex + tag.length;

    widget.controller.value = TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: newCursorPosition),
    );

    _hideUserSuggestions();
  }

  @override
  Widget build(BuildContext context) {
    final String displayName = widget.userName ?? 'You';
    final bool hasAvatar = widget.userAvatarUrl != null && widget.userAvatarUrl!.isNotEmpty;

    return CompositedTransformTarget(
      link: _layerLink,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            UserAvatar(
              imageUrl: widget.userAvatarUrl,
              radius: 18,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (widget.replyingTo != null)
                    Container(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        children: [
                          Text(
                            'Replying to ${widget.replyingTo}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                          ),
                          const Spacer(),
                          InkWell(
                            onTap: widget.onCancelReply,
                            child: Icon(Icons.close, size: 16, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  TextField(
                    controller: widget.controller,
                    focusNode: widget.focusNode,
                    onTap: widget.onTap,
                    decoration: InputDecoration(
                      hintText: widget.hintText ?? 'Add a comment...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25.0),
                        borderSide: BorderSide(color: Colors.grey[300]!),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25.0),
                        borderSide: BorderSide(color: Colors.grey[300]!),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25.0),
                        borderSide: BorderSide(color: Theme.of(context).primaryColor),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.send),
                        onPressed: () {
                          if (widget.controller.text.isNotEmpty) {
                            widget.onSubmit(widget.controller.text);
                          }
                        },
                        color: Theme.of(context).primaryColor,
                      ),
                    ),
                    keyboardType: TextInputType.multiline,
                    maxLines: null,
                    textInputAction: TextInputAction.newline,
                    onSubmitted: (text) {},
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}