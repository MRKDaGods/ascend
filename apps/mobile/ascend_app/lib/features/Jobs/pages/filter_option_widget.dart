import 'package:flutter/material.dart';

class FilterOptionWidget extends StatefulWidget {
  final String filterName;
  final List<String> options;
  final bool allowMultipleSelection;
  final List<String> companyNames; // List of company names
  final Function(List<String>)
  onFilterChanged; // Callback to return selected filters
  final bool isReset; // New parameter to reset filters

  const FilterOptionWidget({
    Key? key,
    required this.filterName,
    required this.options,
    required this.allowMultipleSelection, // Default to allowing multiple selections
    required this.companyNames,
    required this.onFilterChanged,
    required this.isReset, // Add isReset as a required parameter
  }) : super(key: key);

  @override
  _FilterOptionWidgetState createState() => _FilterOptionWidgetState();
}

class _FilterOptionWidgetState extends State<FilterOptionWidget> {
  late String selectedFilterName;
  Color? chipColor;
  Set<String> selectedOptions = {};
  List<String> filteredOptions = [];

  @override
  void initState() {
    super.initState();
    selectedFilterName = widget.filterName;
    filteredOptions = widget.options;

    if (widget.isReset) {
      resetFilters(); // Reset filters if isReset is true
    }
  }

  void updateFilterName() {
    if (selectedOptions.isEmpty) {
      setState(() {
        chipColor = null; // Allow theme to determine color
        selectedFilterName = widget.filterName; // Reset filter name
      });
    } else if (selectedOptions.length == 1) {
      selectedFilterName = selectedOptions.first;
    } else {
      selectedFilterName = widget.filterName;
    }
    widget.onFilterChanged(
      selectedOptions.toList(),
    ); // Notify parent of changes
  }

  void resetFilters() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(() {
        selectedOptions.clear();
        chipColor = null; // Reset chip color
        selectedFilterName = widget.filterName; // Reset filter name
        widget.onFilterChanged([]); // Notify parent to clear filters
      });
    });
  }

  void _openFilterBottomSheet() {
    setState(() {
      filteredOptions =
          widget.options; // Initialize filteredOptions with all options
    });
    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Allow scrolling for large content
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 10,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min, // Take minimum space
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        selectedFilterName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          setModalState(() {
                            selectedOptions.clear();
                            updateFilterName();
                          });
                          setState(() {
                            chipColor = null; // Allow theme to determine color
                          });
                        },
                        child: const Text('Reset'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  if (widget.filterName.toLowerCase() == 'company')
                    Column(
                      children: [
                        TextField(
                          decoration: InputDecoration(
                            prefixIcon: const Icon(
                              Icons.search,
                              color: Colors.grey,
                            ),
                            hintText: 'Search or add a company',
                            filled: true,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8.0),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          onChanged: (value) {
                            setModalState(() {
                              // Filter the options based on user input and limit to 3
                              filteredOptions =
                                  widget.companyNames
                                      .where(
                                        (company) => company
                                            .toLowerCase()
                                            .contains(value.toLowerCase()),
                                      )
                                      .take(3)
                                      .toList();
                            });
                            const SizedBox(height: 10);
                          },
                        ),
                        const SizedBox(height: 10),
                        if (filteredOptions.isNotEmpty)
                          SizedBox(
                            height: 200, // Set a fixed height to avoid overflow
                            child: ListView.builder(
                              shrinkWrap: true,
                              itemCount: filteredOptions.length,
                              itemBuilder: (context, index) {
                                final suggestion = filteredOptions[index];
                                return ListTile(
                                  title: Text(suggestion),
                                  onTap: () {
                                    setModalState(() {
                                      if (!widget.options.contains(
                                        suggestion,
                                      )) {
                                        widget.options.add(suggestion);
                                      }
                                      if (!selectedOptions.contains(
                                        suggestion,
                                      )) {
                                        selectedOptions.add(suggestion);
                                        updateFilterName();
                                      }
                                    });
                                  },
                                );
                              },
                            ),
                          ),
                        const Divider(color: Colors.grey),
                        if (filteredOptions.isEmpty)
                          TextButton(
                            onPressed: () {
                              setModalState(() {
                                if (!widget.companyNames.contains(
                                  selectedFilterName,
                                )) {
                                  widget.companyNames.add(selectedFilterName);
                                  filteredOptions = widget.companyNames;
                                }
                              });
                            },
                            child: const Text('Add New Company'),
                          ),
                      ],
                    ),
                  const SizedBox(height: 10),
                  if (widget.filterName.toLowerCase() == 'company')
                    const Text(
                      'Choose companies from the options below:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  const SizedBox(height: 10),
                  Flexible(
                    child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: widget.options.length,
                      itemBuilder: (context, index) {
                        String option = widget.options[index];
                        bool isSelected = selectedOptions.contains(option);

                        return ListTile(
                          title: Text(option),
                          trailing:
                              isSelected
                                  ? const Icon(Icons.check, color: Colors.green)
                                  : null,
                          tileColor:
                              isSelected ? Colors.green.withOpacity(0.2) : null,
                          onTap: () {
                            setModalState(() {
                              if (selectedOptions.contains(option)) {
                                selectedOptions.remove(
                                  option,
                                ); // Remove if already selected
                              } else {
                                if (widget.allowMultipleSelection) {
                                  selectedOptions.add(
                                    option,
                                  ); // Add if not selected
                                } else {
                                  selectedOptions.clear();
                                  selectedOptions.add(option);
                                }
                              }
                              updateFilterName();
                            });
                          },
                        );
                      },
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        if (!selectedOptions.isNotEmpty) {
                          selectedOptions.clear();
                        }
                        chipColor =
                            selectedOptions.isNotEmpty ? Colors.green : null;
                        chipColor = widget.isReset ? null : chipColor;
                      });
                      Navigator.pop(context);
                    },
                    child: const Text('Show Results'),
                  ),
                  const SizedBox(height: 10),
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
    if (widget.isReset) {
      resetFilters(); // Reset filters if isReset is true
    }
    return GestureDetector(
      onTap: _openFilterBottomSheet,
      child: Chip(
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(selectedFilterName),
            if (selectedOptions.length > 1 && widget.allowMultipleSelection)
              Container(
                margin: const EdgeInsets.only(left: 8.0),
                padding: const EdgeInsets.all(4.0),
                decoration: const BoxDecoration(shape: BoxShape.circle),
                child: Text(
                  '${selectedOptions.length}',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
        backgroundColor: chipColor,
      ),
    );
  }
}
