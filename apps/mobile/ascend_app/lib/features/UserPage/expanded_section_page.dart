import 'package:ascend_app/features/UserPage/add_course_page.dart';
import 'package:ascend_app/features/UserPage/models/profile_section.dart';
import 'package:flutter/material.dart';
import 'section_builder.dart';
import 'add_education_page.dart';
import 'add_experience_page.dart';
import 'add_skill_page.dart';
import 'profile_entry.dart';
import 'add_project_page.dart';
import 'add_interest_page.dart';

class ExpandedSectionPage extends StatefulWidget {
  final ProfileSection section;
  final bool isMyProfile;
  const ExpandedSectionPage({
    super.key,
    required this.section,
    required this.isMyProfile,
  });

  @override
  State<ExpandedSectionPage> createState() => _ExpandedSectionPageState();
}

class _ExpandedSectionPageState extends State<ExpandedSectionPage> {
  void _addOrUpdateSection(String title, ProfileEntryWidget newEntry) {
    final existingSectionIndex = widget.section.content.indexWhere(
      (entry) => entry.title == title,
    );
    if (existingSectionIndex != -1) {
      setState(() {
        widget.section.content.add(newEntry);
      });
    } else {
      setState(() {
        widget.section.content.add(newEntry);
      });
    }
  }

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
          widget.section.title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true, // Ensures proper centering
        actions:
            widget.isMyProfile
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
                      if (widget.section.title == "Education") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddEducationPage(
                                  onSave: (education) {
                                    final newEntry = ProfileEntryWidget(
                                      title: education.school,
                                      subtitle:
                                          "${education.degree} in ${education.fieldOfStudy}",
                                      description:
                                          "From ${education.startDate.year} to ${education.endDate ?? 'Present'}",
                                    );
                                    _addOrUpdateSection("Education", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (widget.section.title == "Experience") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddExperiencePage(
                                  onSave: (experience) {
                                    final newEntry = ProfileEntryWidget(
                                      title: experience.position,
                                      subtitle: experience.company,
                                      description:
                                          "From ${experience.startDate.year} to ${experience.endDate?.year ?? 'Present'}",
                                    );
                                    _addOrUpdateSection("Experience", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (widget.section.title == "Skills") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddSkillPage(
                                  onSave: (skill) {
                                    final newEntry = ProfileEntryWidget(
                                      title: skill.name,
                                    );
                                    _addOrUpdateSection("Skills", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (widget.section.title == "Projects") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddProjectPage(
                                  onSave: (project) {
                                    final newEntry = ProfileEntryWidget(
                                      title: project.name,
                                      description: project.description,
                                    );
                                    _addOrUpdateSection("Projects", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (widget.section.title == "Courses") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddCoursePage(
                                  onSave: (course) {
                                    final newEntry = ProfileEntryWidget(
                                      title: course.name,
                                      subtitle: course.provider,
                                      description:
                                          course.completionDate != null
                                              ? "Completed on ${course.completionDate!.toLocal()}"
                                              : null,
                                    );
                                    _addOrUpdateSection("Courses", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (widget.section.title == 'Interests') {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddInterestPage(
                                  onSave: (interest) {
                                    final newEntry = ProfileEntryWidget(
                                      title: interest.name,
                                    );
                                    _addOrUpdateSection("Interests", newEntry);
                                  },
                                ),
                          ),
                        );
                      }
                    },
                  ),
                ]
                : null,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: SectionBuilder(
            section: widget.section,
            isMyProfile: false,
            isExpanded: true,
            inEditMode: widget.isMyProfile,
          ),
        ),
      ),
    );
  }
}
