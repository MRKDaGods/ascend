import 'package:flutter/material.dart';
import 'models/profile_section.dart';
import 'expanded_section_page.dart';
import 'edit_entry_page.dart';
import 'profile_entry.dart';
import 'custom_alert_dialog.dart';

class SectionBuilder extends StatefulWidget {
  final ProfileSection section;
  final bool isMyProfile;
  final bool isExpanded;
  final bool inEditMode;
  final void Function(ProfileSection)? onUpdateSection;
  final void Function()? deleteResume; // Callback for deleting resume
  final VoidCallback? onAddEntry; // New callback for adding entries

  const SectionBuilder({
    super.key,
    required this.section,
    required this.isMyProfile,
    this.isExpanded = false,
    this.inEditMode = false,
    this.onUpdateSection,
    this.onAddEntry, // Pass the callback
    this.deleteResume,
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

  void _showWarningDialogForRemovingResumee(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Do you want to delete this item?",
          description: "This cannot be undone.",
          confirmText: "Delete",
          onConfirm: () {
            Navigator.pop(context); // Close the dialog
            print(widget.deleteResume?.toString());
            if (widget.deleteResume != null)
              widget.deleteResume!(); // Safely call the deleteResume callback
          },
        );
      },
    );
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
                            onPressed: widget.onAddEntry, // Call the callback
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
                                      deleteResume: widget.deleteResume,
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
              if (widget.section.title == "Featured" &&
                  widget.section.contentWidgets.isNotEmpty &&
                  !widget.isExpanded)
                widget.section.contentWidgets[0]
              else if (widget.section.title == "Featured" && widget.isExpanded)
                Column(
                  children: [
                    widget.section.contentWidgets[0],
                    const SizedBox(height: 5),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        OutlinedButton.icon(
                          icon: Icon(Icons.edit_outlined),
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                              vertical: 8,
                              horizontal: 10,
                            ),
                          ),
                          label: Text("Edit"),
                        ),
                        const SizedBox(width: 10),
                        OutlinedButton.icon(
                          icon: Icon(Icons.delete_outline),
                          onPressed:
                              () =>
                                  _showWarningDialogForRemovingResumee(context),
                          style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.symmetric(
                              vertical: 8,
                              horizontal: 10,
                            ),
                          ),
                          label: Text("Delete"),
                        ),
                      ],
                    ),
                  ],
                ),

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
