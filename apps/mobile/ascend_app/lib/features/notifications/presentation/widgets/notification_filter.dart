import 'package:flutter/material.dart';

/// Widget for filtering notifications by type
class NotificationFilter extends StatefulWidget {
  /// Available notification types for filtering
  final List<String> availableTypes;
  
  /// Currently selected notification type
  final String? selectedType;
  
  /// Called when a filter type is selected
  final Function(String?) onFilterSelected;
  
  const NotificationFilter({
    Key? key,
    required this.availableTypes,
    this.selectedType,
    required this.onFilterSelected,
  }) : super(key: key);

  @override
  State<NotificationFilter> createState() => _NotificationFilterState();
}

class _NotificationFilterState extends State<NotificationFilter> {
  late String? _selectedType;
  
  @override
  void initState() {
    super.initState();
    _selectedType = widget.selectedType;
  }
  
  @override
  void didUpdateWidget(NotificationFilter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedType != widget.selectedType) {
      _selectedType = widget.selectedType;
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          _buildFilterChip('All', null),
          ...widget.availableTypes.map((type) => _buildFilterChip(
            _formatTypeLabel(type), 
            type,
          )),
        ],
      ),
    );
  }
  
  Widget _buildFilterChip(String label, String? type) {
    final isSelected = _selectedType == type;
    
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            _selectedType = selected ? type : null;
          });
          widget.onFilterSelected(_selectedType);
        },
        backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
        selectedColor: Theme.of(context).colorScheme.primaryContainer,
        checkmarkColor: Theme.of(context).colorScheme.onPrimaryContainer,
        labelStyle: TextStyle(
          color: isSelected 
              ? Theme.of(context).colorScheme.onPrimaryContainer
              : Theme.of(context).colorScheme.onSurfaceVariant,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
  
  String _formatTypeLabel(String type) {
    // Convert camelCase or snake_case to Title Case
    if (type.contains('_')) {
      return type.split('_').map(_capitalizeFirst).join(' ');
    } else {
      // Insert space before capital letters and capitalize
      return _capitalizeFirst(type.replaceAllMapped(
        RegExp(r'([A-Z])'), 
        (match) => ' ${match.group(0)}',
      ).trim());
    }
  }
  
  String _capitalizeFirst(String text) {
    if (text.isEmpty) return text;
    return text[0].toUpperCase() + text.substring(1);
  }
}