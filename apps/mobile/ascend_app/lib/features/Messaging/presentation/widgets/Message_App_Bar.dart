import 'package:flutter/material.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/choice_chips_options.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/Focused_Dropdown.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/message_lists.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/show_conversation_modal.dart';

class MessageAppBar extends StatefulWidget {
  final Function(String)? onFilterChanged;
  final String selectedValue;
  final Function(String)? onSelected;

  const MessageAppBar({
    Key? key,
    this.onFilterChanged,
    required this.selectedValue,
    this.onSelected,
  }) : super(key: key);

  @override
  State<MessageAppBar> createState() => _MessageAppBarState();
}

class _MessageAppBarState extends State<MessageAppBar> {
  final TextEditingController textEditingController = TextEditingController();
  final FocusNode searchFocusNode = FocusNode();
  final ScrollController scrollController = ScrollController();
  List<String> _displayOptions = ['Jobs', 'Unread', 'Drafts', 'InMail'];
  String _currentDropDownFilter = '';
  // Local state to track the selected filter
  String _currentFilter = '';

  @override
  void initState() {
    super.initState();
    searchFocusNode.addListener(_onFocusChange);
    scrollController.addListener(_onScroll);
    _currentFilter = widget.selectedValue;
  }

  @override
  void didUpdateWidget(MessageAppBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Update local state when parent widget's selectedValue changes
    if (widget.selectedValue != oldWidget.selectedValue) {
      _currentFilter = widget.selectedValue;
    }
  }

  @override
  void dispose() {
    textEditingController.dispose();
    searchFocusNode.removeListener(_onFocusChange);
    scrollController.removeListener(_onScroll);
    searchFocusNode.dispose();
    super.dispose();
  }

  void _onFocusChange() {
    // Implement focus change logic here
    setState(() {});
  }

  void _onScroll() {
    // Implement scroll logic here
    if (scrollController.position.pixels >=
        scrollController.position.maxScrollExtent - 200) {
      // Load more items
    }
  }

  @override
  Widget build(BuildContext context) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(100),
      child: Column(
        children: [
          // Search bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: const Offset(0, 3), // changes position of shadow
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(Icons.arrow_back),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
                Expanded(
                  child: TextField(
                    controller: textEditingController,
                    focusNode: searchFocusNode,
                    decoration: InputDecoration(
                      hintText: 'Search Messag...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[200],
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.more_horiz),
                  onPressed: () {
                    showConversationModal(context);
                  },
                ),
                IconButton(icon: Icon(Icons.edit), onPressed: () {}),
              ],
            ),
          ),

          // Filter chips
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: Row(
              children: [
                FocusedDropDown(
                  selectedValue: _currentDropDownFilter, // Use current filter
                  onSelected: (value) {
                    if (widget.onFilterChanged != null) {
                      widget.onFilterChanged!(value);
                    }
                  },
                ),
                const SizedBox(width: 8),
                ChoiceChipSet(
                  options:
                      _displayOptions, // Make sure this is a state variable in MessageAppBar
                  selectedValue: _currentFilter,
                  onSelected: (value) {
                    setState(() {
                      _currentFilter = value;

                      // Special case for Starred and My Connections
                      if (value == 'Starred' || value == 'My Connections') {
                        // Make sure it's in the list
                        if (!_displayOptions.contains(value)) {
                          _displayOptions.insert(0, value);
                        }
                      }
                    });

                    if (widget.onSelected != null) {
                      widget.onSelected!(value);
                    }
                  },
                  onItemAdded: (newItem) {
                    setState(() {
                      if (!_displayOptions.contains(newItem)) {
                        _displayOptions.insert(0, newItem);
                      }
                      _currentFilter =
                          newItem; // Also update the current filter
                    });

                    if (widget.onFilterChanged != null) {
                      widget.onFilterChanged!(newItem);
                    }
                  },
                  selectedColor: Colors.green,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
