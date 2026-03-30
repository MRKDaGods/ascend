import 'package:flutter/material.dart';
import '../UserPage/models/profile_section.dart';

class SectionBuilder extends StatefulWidget {
  final ProfileSection section;
  final bool isMyProfile;
  final Function(ProfileSection) onUpdateSection;
  final VoidCallback onAddEntry;
  final void Function(int)? onEditEntry;
  final void Function(int)? onDeleteEntry;
  final double titleSpacing;
  final bool useCondensedView;
  final int initialVisibleItems;

  const SectionBuilder({
    super.key,
    required this.section,
    required this.isMyProfile,
    required this.onUpdateSection,
    required this.onAddEntry,
    required this.onEditEntry,
    required this.onDeleteEntry,
    this.titleSpacing = 0,
    this.useCondensedView = false,
    this.initialVisibleItems = 2,
  });

  @override
  State<SectionBuilder> createState() => _SectionBuilderState();
}

class _SectionBuilderState extends State<SectionBuilder> {
  bool _showAll = false;

  @override
  Widget build(BuildContext context) {
    // Determine how many items to show
    final int itemsToShow =
        widget.useCondensedView && !_showAll
            ? widget.initialVisibleItems.clamp(0, widget.section.content.length)
            : widget.section.content.length;

    bool showExpandButton =
        widget.useCondensedView &&
        widget.section.content.length > widget.initialVisibleItems;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(context),
        Padding(
          // Decreased padding between title and content (top padding is smaller)
          padding: const EdgeInsets.fromLTRB(16.0, 2.0, 16.0, 0.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              // Show content widgets if available (for custom widgets like PDF viewers)
              if (widget.section.contentWidgets.isNotEmpty)
                ...widget.section.contentWidgets,

              // Show regular content entries
              if (widget.section.content.isNotEmpty)
                ListView.separated(
                  physics: const NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  itemCount: itemsToShow,
                  // Increased spacing between items by adjusting the divider height
                  separatorBuilder:
                      (context, index) => const Divider(height: 16),
                  itemBuilder: (context, index) {
                    final entry = widget.section.content[index];
                    return Stack(
                      children: [
                        Padding(
                          // More padding between items (especially at the bottom)
                          padding: const EdgeInsets.only(
                            bottom: 12.0,
                            right: 40,
                          ),
                          child: entry,
                        ),
                        // Only show edit/delete buttons if it's NOT the About section
                        if (widget.isMyProfile &&
                            widget.section.title != "About")
                          Positioned(
                            top: 0,
                            right: 0,
                            child: Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit, size: 16),
                                  onPressed: () => widget.onEditEntry!(index),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  visualDensity: VisualDensity.compact,
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  icon: const Icon(Icons.delete, size: 16),
                                  onPressed: () => widget.onDeleteEntry!(index),
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  visualDensity: VisualDensity.compact,
                                ),
                              ],
                            ),
                          ),
                        // Removed the edit button for About section content
                      ],
                    );
                  },
                ),

              // Show "Show all" button if needed
              if (showExpandButton)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                  child: TextButton(
                    onPressed: () {
                      setState(() {
                        _showAll = !_showAll;
                      });
                    },
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: const Size(50, 30),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _showAll
                              ? "Show less"
                              : "Show all ${widget.section.content.length} ${widget.section.title.toLowerCase()} →",
                          style: TextStyle(
                            color: Colors.grey.shade700,
                            fontWeight: FontWeight.w500,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 4),
      ],
    );
  }

  Widget _buildSectionHeader(BuildContext context) {
    return Container(
      // Reduced bottom padding to decrease space between title and content
      padding: const EdgeInsets.only(left: 12, right: 12, top: 8, bottom: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            widget.section.title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          if (widget.isMyProfile)
            Row(
              children: [
                // Edit button for the About section - now shown only in the header
                if (widget.section.title == "About")
                  IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () {
                      // Navigate to edit the About section (Bio)
                      if (widget.onEditEntry != null) {
                        widget.onEditEntry!(0);
                      }
                    },
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    visualDensity: VisualDensity.compact,
                    iconSize: 20,
                  )
                else
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: widget.onAddEntry,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    visualDensity: VisualDensity.compact,
                    iconSize: 20,
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
