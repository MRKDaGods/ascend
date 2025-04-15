import 'package:ascend_app/features/UserPage/models/profile_section.dart';
import 'package:flutter/material.dart';
import 'section_builder.dart';

class ExpandedSectionPage extends StatelessWidget {
  final ProfileSection section;
  final bool isMyProfile;
  const ExpandedSectionPage({
    super.key,
    required this.section,
    required this.isMyProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Text(
          section.title,
          style: const TextStyle(

            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true, // Ensures proper centering
        actions:
            isMyProfile
                ? [
                  IconButton(
                    icon: const Icon(Icons.reorder),
                    onPressed: () {
                      // Handle settings action
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.add),
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
