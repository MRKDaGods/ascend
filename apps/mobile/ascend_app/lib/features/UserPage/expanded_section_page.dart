import 'package:ascend_app/features/UserPage/models/profile_section.dart';
import 'package:flutter/material.dart';
import 'section_builder.dart';

class EditSectionPage extends StatelessWidget {
  final ProfileSection section;
  final bool isMyProfile;
  const EditSectionPage({
    super.key,
    required this.section,
    required this.isMyProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        backgroundColor: Colors.grey[900],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white70),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          section.title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true, // Ensures proper centering
        actions:
            isMyProfile
                ? [
                  IconButton(
                    icon: const Icon(Icons.reorder, color: Colors.white70),
                    onPressed: () {
                      // Handle settings action
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.add, color: Colors.white70),
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
