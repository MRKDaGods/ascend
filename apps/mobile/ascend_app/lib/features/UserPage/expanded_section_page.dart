import 'package:ascend_app/features/UserPage/models/profile_section.dart';
import 'package:flutter/material.dart';
import 'section_builder.dart';

<<<<<<< HEAD
class EditSectionPage extends StatelessWidget {
  final ProfileSection section;
  final bool isMyProfile;
  const EditSectionPage({
=======
class ExpandedSectionPage extends StatelessWidget {
  final ProfileSection section;
  final bool isMyProfile;
  const ExpandedSectionPage({
>>>>>>> Cross
    super.key,
    required this.section,
    required this.isMyProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
<<<<<<< HEAD
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        backgroundColor: Colors.grey[900],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white70),
=======
      appBar: AppBar(
        
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
>>>>>>> Cross
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          section.title,
          style: const TextStyle(
<<<<<<< HEAD
            color: Colors.white,
=======

>>>>>>> Cross
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true, // Ensures proper centering
        actions:
            isMyProfile
                ? [
                  IconButton(
<<<<<<< HEAD
                    icon: const Icon(Icons.reorder, color: Colors.white70),
=======
                    icon: const Icon(Icons.reorder),
>>>>>>> Cross
                    onPressed: () {
                      // Handle settings action
                    },
                  ),
                  IconButton(
<<<<<<< HEAD
                    icon: const Icon(Icons.add, color: Colors.white70),
=======
                    icon: const Icon(Icons.add),
>>>>>>> Cross
                    onPressed: () {
                      // Handle add action
                    },
                  ),
                ]
                : null,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: SectionBuilder(
            section: section,
            isMyProfile: false,
            isExpanded: true,
            inEditMode: isMyProfile,
          ),
        ),
      ),
    );
  }
}
