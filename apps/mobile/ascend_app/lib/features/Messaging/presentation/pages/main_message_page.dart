import 'package:ascend_app/features/Messaging/presentation/widgets/Focused_Dropdown.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/Message_App_Bar.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/message_lists.dart';
import 'package:flutter/material.dart';

class MainMessagingPage extends StatefulWidget {
  const MainMessagingPage({Key? key}) : super(key: key);

  @override
  State<MainMessagingPage> createState() => _MainMessagingPageState();
}

class _MainMessagingPageState extends State<MainMessagingPage> {
  final ScrollController scrollController = ScrollController();
  final TextEditingController textEditingController = TextEditingController();
  final FocusNode searchFocusNode = FocusNode();

  // Add a state variable to track the selected filter
  String _selectedFilter = 'Focused';

  @override
  void initState() {
    super.initState();
    scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    scrollController.removeListener(_onScroll);
    scrollController.dispose();
    textEditingController.dispose();
    searchFocusNode.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (scrollController.position.pixels >=
        scrollController.position.maxScrollExtent - 200) {
      // Load more items
    }
  }

  // Create a real filter change handler
  void _onFilterChanged(String value) {
    setState(() {
      _selectedFilter = value;
      // Here you can add logic to filter messages based on the selected value
      print('Filter changed to: $_selectedFilter');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        toolbarHeight: 110,
        flexibleSpace: MessageAppBar(
          onFilterChanged: _onFilterChanged,
          selectedValue: _selectedFilter,
          onSelected: _onFilterChanged,
        ),
      ),
      body: MessageList(),
    );
  }
}
