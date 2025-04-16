import 'package:ascend_app/features/Messaging/presentation/widgets/choice_chip_item.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Messaging/presentation/widgets/Focused_Dropdown.dart';

class ChoiceChipSet extends StatefulWidget {
  final List<String> options;
  final String selectedValue;
  final Function(String) onSelected;
  final Function(String)? onItemAdded; // NEW callback
  final Color selectedColor;
  final VoidCallback? onAllFiltersPressed;

  const ChoiceChipSet({
    Key? key,
    required this.options,
    required this.selectedValue,
    required this.onSelected,
    this.onItemAdded,
    this.selectedColor = Colors.green,
    this.onAllFiltersPressed,
  }) : super(key: key);

  @override
  State<ChoiceChipSet> createState() => _ChoiceChipSetState();
}

class _ChoiceChipSetState extends State<ChoiceChipSet> {
  late String selectedValue;
  late List<String> displayOptions;

  @override
  void initState() {
    super.initState();
    selectedValue = widget.selectedValue;
    displayOptions = List<String>.from(widget.options);
    _organizeChips();
  }

  @override
  void didUpdateWidget(ChoiceChipSet oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectedValue != oldWidget.selectedValue ||
        widget.options != oldWidget.options) {
      selectedValue = widget.selectedValue;
      displayOptions = List<String>.from(widget.options);
      _organizeChips();
    }
  }

  void _organizeChips() {
    if (displayOptions.contains(selectedValue)) {
      displayOptions.remove(selectedValue);
      displayOptions.insert(0, selectedValue);
    }
  }

  void _onSelected(String value, bool isSelected) {
    if (isSelected) {
      setState(() {
        final previousValue = selectedValue;
        selectedValue = value;

        // Special handling for Starred and My Connections
        if (value == 'Starred' || value == 'My Connections') {
          // Always try to remove first to avoid duplicates
          displayOptions.remove(value);
          // Then add at the beginning
          displayOptions.insert(0, value);
          debugPrint("Added special filter: $value");
        } else {
          // Regular filters...
          if (!displayOptions.contains(value)) {
            displayOptions.add(value);
          }

          // Remove special filters when another is selected
          if (previousValue == 'Starred' || previousValue == 'My Connections') {
            displayOptions.remove(previousValue);
          }
        }

        _organizeChips();
      });

      // Force rebuild after a short delay to ensure UI updates
      Future.microtask(() => setState(() {}));

      widget.onSelected(value);
      debugPrint("Display options after: $displayOptions");
    }
  }

  void _showAllFiltersModal(BuildContext context) {
    final List<Map<String, dynamic>> allFilters = [
      {'name': 'Jobs', 'icon': Icons.work},
      {'name': 'Unread', 'icon': Icons.mark_email_unread},
      {'name': 'Focused', 'icon': Icons.star},
      {'name': 'InMail', 'icon': Icons.mail},
      {'name': 'Starred', 'icon': Icons.star_border},
      {'name': 'My Connections', 'icon': Icons.people},
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'All Filters',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ...allFilters.map((filter) {
                return ListTile(
                  leading: Icon(
                    filter['icon'] as IconData,
                    color:
                        selectedValue == filter['name']
                            ? widget.selectedColor
                            : Colors.grey,
                  ),
                  title: Text(
                    filter['name'] as String,
                    style: TextStyle(
                      fontWeight:
                          selectedValue == filter['name']
                              ? FontWeight.bold
                              : FontWeight.normal,
                    ),
                  ),
                  trailing:
                      selectedValue == filter['name']
                          ? Icon(Icons.check, color: widget.selectedColor)
                          : null,
                  onTap: () {
                    _onSelected(filter['name'] as String, true);

                    // Also notify parent about new item
                    if (filter['name'] == 'Starred' ||
                        filter['name'] == 'My Connections') {
                      if (widget.onItemAdded != null) {
                        widget.onItemAdded!(filter['name'] as String);
                      }
                    }

                    Navigator.pop(context);
                  },
                );
              }).toList(),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            ...displayOptions.map((option) {
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChipItem(
                  item: option,
                  isSelected: selectedValue == option,
                  onSelected: (isSelected) => _onSelected(option, isSelected),
                  selectedColor: widget.selectedColor,
                ),
              );
            }).toList(),
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: TextButton(
                child: Text(
                  'All Filters',
                  style: TextStyle(
                    color: Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onPressed: () => _showAllFiltersModal(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
