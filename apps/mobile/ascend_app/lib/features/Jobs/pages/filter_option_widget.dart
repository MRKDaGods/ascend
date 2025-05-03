import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/data/dummy_company_names.dart';

class FilterOptionWidget extends StatefulWidget {
  final String filterName;
  final List<String> options;
  final bool allowMultipleSelection;
  final Function(List<String>, String filterName) onFilterChanged;
  final bool isReset;

  const FilterOptionWidget({
    super.key,
    required this.filterName,
    required this.options,
    required this.allowMultipleSelection,
    required this.onFilterChanged,
    required this.isReset,
  });



  @override

  // ignore: library_private_types_in_public_api
  _FilterOptionWidgetState createState() => _FilterOptionWidgetState();

}

class _FilterOptionWidgetState extends State<FilterOptionWidget> {
  late String selectedFilterName;
  late RangeValues selectedSalaryRange;
  Color? chipColor;
  Set<String> selectedOptions = {};
  List<String> filteredOptions = [];

  @override
  void initState() {
    super.initState();
    selectedFilterName = widget.filterName;
    filteredOptions = List<String>.from(widget.options);
    selectedSalaryRange = const RangeValues(0, 100000);

    if (widget.isReset) {
      resetFilters();
    }
  }

  void updateFilterName() {
    if (widget.filterName.toLowerCase() == 'salary') {
      selectedFilterName =
          'Salary: \$${selectedSalaryRange.start.toInt()} - \$${selectedSalaryRange.end.toInt()}';
      widget.onFilterChanged([
        selectedSalaryRange.start.toString(),
        selectedSalaryRange.end.toString(),
      ], "salary"); // Notify parent about filter change
      return;
    }

    if (selectedOptions.isEmpty) {
      setState(() {
        chipColor = null;
        selectedFilterName = widget.filterName;
      });
    } else if (selectedOptions.length > 1) {
      setState(() {
        chipColor = Colors.green;
        selectedFilterName = widget.filterName;
      });
    } else {
      setState(() {
        chipColor = Colors.green;
        selectedFilterName = selectedOptions.join(', ');
      });
    }

    widget.onFilterChanged(
      selectedOptions.toList(),
      "salary",
    ); // Notify parent about filter change
  }

  void resetFilters() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setState(() {
        selectedOptions.clear();
        chipColor = null;
        selectedFilterName = widget.filterName;
        selectedSalaryRange = const RangeValues(
          0,
          100000,
        ); // Reset salary range to original value
        widget.onFilterChanged([], "Reset"); // Notify parent about reset
      });
    });
  }

  void _openFilterBottomSheet() {
    setState(() {
      filteredOptions = List<String>.from(widget.options);
    });
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
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
                mainAxisSize: MainAxisSize.min,
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
                      if (widget.filterName.toLowerCase() == 'salary')
                        TextButton(
                          onPressed: () {
                            setModalState(() {
                              selectedOptions.clear();
                              if (widget.filterName.toLowerCase() == 'salary') {
                                selectedFilterName = "Salary";
                                selectedSalaryRange = const RangeValues(
                                  0,
                                  100000,
                                );
                              }
                              updateFilterName();
                            });
                            setState(() {
                              if (widget.filterName.toLowerCase() == 'salary') {
                                selectedFilterName = "Salary";
                                selectedSalaryRange = const RangeValues(
                                  0,
                                  100000,
                                );
                                chipColor = null;
                              }
                            });
                          },
                          child: const Text('Reset'),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  if (widget.filterName.toLowerCase() == 'salary')
                    Column(
                      children: [
                        const Text(
                          'Select Salary Range',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(
                                  labelText: 'Min',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (value) {
                                  setModalState(() {
                                    final min = double.tryParse(value) ?? 0;
                                    if (min < 0) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Minimum value cannot be negative.',
                                          ),
                                        ),
                                      );
                                      return;
                                    }
                                    if (min > selectedSalaryRange.end) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Minimum value cannot be greater than the maximum value.',
                                          ),
                                        ),
                                      );
                                      return;
                                    }
                                    selectedSalaryRange = RangeValues(
                                      min,
                                      selectedSalaryRange.end,
                                    );
                                    updateFilterName();
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(
                                  labelText: 'Max',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (value) {
                                  setModalState(() {
                                    final max =
                                        double.tryParse(value) ??
                                        double.infinity;
                                    if (max < 0) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Maximum value cannot be negative.',
                                          ),
                                        ),
                                      );
                                      return;
                                    }
                                    if (max > 200000) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Maximum value cannot exceed 200,000.',
                                          ),
                                        ),
                                      );
                                      return;
                                    }
                                    if (max < selectedSalaryRange.start) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Maximum value cannot be less than the minimum value.',
                                          ),
                                        ),
                                      );
                                      return;
                                    }
                                    selectedSalaryRange = RangeValues(
                                      selectedSalaryRange.start,
                                      max,
                                    );
                                    updateFilterName();
                                  });
                                },
                              ),
                            ),
                          ],
                        ),
                        RangeSlider(
                          values: selectedSalaryRange,
                          min: 0,
                          max: 200000,
                          divisions: 20,
                          labels: RangeLabels(
                            '\$${selectedSalaryRange.start.toInt()}',
                            '\$${selectedSalaryRange.end.toInt()}',
                          ),
                          onChanged: (RangeValues values) {
                            setModalState(() {
                              if (values.start > values.end) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                      'Start value cannot be greater than end value.',
                                    ),
                                  ),
                                );
                                return;
                              }
                              selectedSalaryRange = values;
                              updateFilterName();
                            });
                          },
                        ),
                      ],
                    ),
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
                              filteredOptions =
                                  companySearchNames
                                      .where(
                                        (company) => company
                                            .toLowerCase()
                                            .contains(value.toLowerCase()),
                                      )
                                      .toList();
                              if (!filteredOptions.contains(value) &&
                                  value.isNotEmpty) {
                                setState(() {
                                  companySearchNames.add(value);
                                  filteredOptions.add(value);
                                });
                              } else if (filteredOptions.contains(value) &&
                                  value.isNotEmpty) {
                                filteredOptions.remove(value);
                              }
                            });
                          },
                        ),
                        const SizedBox(height: 10),
                        if (filteredOptions.isNotEmpty)
                          SizedBox(
                            height: 200,
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
                                if (!companySearchNames.contains(
                                  selectedFilterName,
                                )) {
                                  companySearchNames.add(selectedFilterName);
                                  filteredOptions = companySearchNames;
                                }
                              });
                            },
                            child: const Text('Add New Company'),
                          ),
                      ],
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
                              // ignore: deprecated_member_use
                              isSelected ? Colors.green.withOpacity(0.2) : null,
                          onTap: () {
                            setModalState(() {
                              if (selectedOptions.contains(option)) {
                                selectedOptions.remove(option);
                                widget.onFilterChanged(
                                  selectedOptions.toList(),
                                  widget.filterName,
                                ); // Update parent
                              } else {
                                if (widget.allowMultipleSelection) {
                                  selectedOptions.add(option);
                                } else {
                                  selectedOptions.clear();
                                  selectedOptions.add(option);
                                }
                                widget.onFilterChanged(
                                  selectedOptions.toList(),
                                  widget.filterName,
                                ); // Update parent
                              }
                              updateFilterName();
                            });
                            setState(() {
                              // Ensure the parent widget reflects the changes
                              widget.onFilterChanged(
                                selectedOptions.toList(),
                                widget.filterName,
                              );
                            });
                          },
                        );
                      },
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        if (selectedOptions.isNotEmpty) {
                          chipColor =
                              Colors.green; // Set the filter color to green
                        } else {
                          selectedFilterName = widget.filterName;
                        }
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
      resetFilters();
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
