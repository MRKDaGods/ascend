import 'package:flutter/material.dart';
import 'Models/profile_section.dart';
import 'expanded_section_page.dart';
import 'edit_entry_page.dart';
import 'profile_entry.dart';

class SectionBuilder extends StatefulWidget {
  final ProfileSection section;
  final bool isMyProfile;
  final bool isExpanded;
  final bool inEditMode;
  final void Function(ProfileSection)? onUpdateSection;

  const SectionBuilder({
    super.key,
    required this.section,
    required this.isMyProfile,
    this.isExpanded = false,
    this.inEditMode = false,
    this.onUpdateSection,
  });

  @override
  _SectionBuilderState createState() => _SectionBuilderState();
}

class _SectionBuilderState extends State<SectionBuilder> {
  static const sectionNamesWithLimitTwo = [
    "Education",
    "Volunteering",
    "Licenses & Certifications",
    "Skills",
    "Accomplishments",
    "Organizations",
  ];
  ProfileEntryWidget? editedItem;
  void saveEntry(ProfileEntryWidget newData) {
    setState(() {
      // Find the index of the edited item
      final int index = widget.section.content.indexWhere(
        (entry) => entry == editedItem,
      );
      if (index != -1) {
        // Replace the old entry with the new data
        widget.section.content[index] = newData;
      }
      widget.onUpdateSection?.call(widget.section);
      editedItem = null; // Reset the edited item
      // Notify the parent
    });
  }

  void _editEntry(BuildContext context, ProfileEntryWidget entry) {
    // Navigate to a new page to edit the entry
    setState(() {
      editedItem = entry;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => EditEntryPage(entry: entry, saveEntry: saveEntry),
        ),
      );
      print(entry.title);
    });
  }

  @override
  Widget build(BuildContext context) {
    final int contentCount = widget.section.content.length;
    int limit = 5;
    if (sectionNamesWithLimitTwo.contains(widget.section.title)) {
      limit = 2;
    }
    final bool hasMoreThanLimit = contentCount > limit;
    final List<Widget> displayedContent =
        hasMoreThanLimit && !widget.isExpanded
            ? widget.section.content.sublist(0, limit)
            : widget.section.content;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Full-width Black Divider
        if (!widget.isExpanded)
          Container(
            height: 6,
            width: double.infinity,
            color: const Color.fromARGB(255, 180, 180, 180),
          ),

        // Section Content with Padding
        Padding(
          padding: EdgeInsets.symmetric(horizontal: widget.isExpanded ? 0 : 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Section Title
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (!widget.isExpanded)
                    Column(
                      children: [
                        const SizedBox(height: 10),
                        Text(
                          widget.section.title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  // Icons for Editing and Adding Items
                  if (widget.isMyProfile &&
                      widget.section.title != "Analytics" &&
                      !widget.isExpanded)
                    Row(
                      children: [
                        if (widget.section.title != "About")
                          IconButton(
                            icon: const Icon(Icons.add),
                            onPressed: () {
                              // Handle add action
                            },
                          ),
                        IconButton(
                          icon: const Icon(Icons.edit_outlined),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (context) => ExpandedSectionPage(
                                      section: widget.section,
                                      isMyProfile: widget.isMyProfile,
                                    ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                ],
              ),
              if (widget.isMyProfile && widget.section.title == "Analytics")
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: const [
                    Icon(Icons.remove_red_eye),
                    SizedBox(width: 5),
                    Text("Private to you"),
                  ],
                ),
              const SizedBox(height: 5),

              // Section Content with Dividers
              for (var item in displayedContent) ...[
                if (item != displayedContent.first || !widget.isExpanded)
                  const SizedBox(height: 5),
                Row(
                  children: [
                    Expanded(child: item),
                    if (widget.inEditMode &&
                        widget.section.title != "Analytics")
                      IconButton(
                        icon: const Icon(Icons.edit_outlined),
                        onPressed: () {
                          _editEntry(context, item as ProfileEntryWidget);
                          editedItem = item;
                        },
                      ),
                  ],
                ),
                if (item != displayedContent.last)
                  const Divider(), // Grey divider between items
              ],

              // "Show All" Button if more content exists
              if ((hasMoreThanLimit || widget.section.title == "Analytics") &&
                  !widget.isExpanded)
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => ExpandedSectionPage(
                              section: widget.section,
                              isMyProfile: widget.isMyProfile,
                            ),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Show all ${widget.section.title != "Analytics" ? contentCount : ""} ${widget.section.title.toLowerCase()}',
                        ),
                        const Icon(Icons.arrow_forward),
                      ],
                    ),
                  ),
                ),

              const SizedBox(height: 12), // Keep spacing consistent
            ],
          ),
        ),
      ],
    );
  }
}
