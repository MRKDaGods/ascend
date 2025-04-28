import 'package:flutter/material.dart';
import 'add_education_page.dart';
import 'add_experience_page.dart';
import 'add_skill_page.dart';
import 'add_course_page.dart';
import 'add_project_page.dart';
import 'add_interest_page.dart';
import 'models/profile_section.dart';
import 'profile_entry.dart';

class AddSectionPage extends StatefulWidget {
  final void Function(ProfileSection) onSectionAdded;

  const AddSectionPage({super.key, required this.onSectionAdded});

  @override
  _AddSectionPageState createState() => _AddSectionPageState();
}

class _AddSectionPageState extends State<AddSectionPage> {
  bool _isCoreExpanded = false;
  bool _isRecommendedExpanded = false;
  bool _isAdditionalExpanded = false;

  void _toggleSection(String section) {
    setState(() {
      _isCoreExpanded = section == "Core" ? !_isCoreExpanded : false;
      _isRecommendedExpanded =
          section == "Recommended" ? !_isRecommendedExpanded : false;
      _isAdditionalExpanded =
          section == "Additional" ? !_isAdditionalExpanded : false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Add to profile"), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Core Section
            _buildExpandableSection(
              title: "Core",
              description:
                  "Start with the basics. Filling out these sections will help you be discovered by recruiters and people you may know.",
              isExpanded: _isCoreExpanded,
              onToggle: () => _toggleSection("Core"),
              items: [
                {"label": "Add education", "action": _navigateToAddEducation},
                {"label": "Add position", "action": _navigateToAddExperience},
                {"label": "Add services", "action": null},
                {"label": "Add career break", "action": null},
                {"label": "Add skills", "action": _navigateToAddSkill},
              ],
            ),
            const SizedBox(height: 20),

            // Recommended Section
            _buildExpandableSection(
              title: "Recommended",
              description:
                  "Completing these sections will increase your credibility and give you access to more opportunities.",
              isExpanded: _isRecommendedExpanded,
              onToggle: () => _toggleSection("Recommended"),
              items: [
                {"label": "Add featured", "action": null},
                {"label": "Add licenses & certifications", "action": null},
                {"label": "Add projects", "action": _navigateToAddProject},
                {"label": "Add courses", "action": _navigateToAddCourse},
                {"label": "Add recommendations", "action": null},
              ],
            ),
            const SizedBox(height: 20),

            // Additional Section
            _buildExpandableSection(
              title: "Additional",
              description:
                  "Add even more personality to your profile. These sections will help you grow your network and build more relationships.",
              isExpanded: _isAdditionalExpanded,
              onToggle: () => _toggleSection("Additional"),
              items: [
                {"label": "Add volunteer experience", "action": null},
                {"label": "Add publications", "action": null},
                {"label": "Add patents", "action": null},
                {"label": "Add honors & awards", "action": null},
                {"label": "Add test scores", "action": null},
                {"label": "Add languages", "action": null},
                {"label": "Add organizations", "action": null},
                {"label": "Add causes", "action": null},
                {"label": "Add contact info", "action": null},
                {"label": "Add interests", "action": _navigateToAddInterest},
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpandableSection({
    required String title,
    required String description,
    required bool isExpanded,
    required VoidCallback onToggle,
    required List<Map<String, dynamic>> items,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: onToggle,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Icon(isExpanded ? Icons.expand_less : Icons.expand_more),
            ],
          ),
        ),
        if (isExpanded) ...[
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(fontSize: 14, color: Colors.grey),
          ),
          const SizedBox(height: 12),
          ...items
              .map((item) => _buildListItem(item["label"], item["action"]))
              .toList(),
        ],
      ],
    );
  }

  Widget _buildListItem(String text, VoidCallback? action) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: GestureDetector(
        onTap: action,
        child: Row(
          children: [
            const SizedBox(width: 8),
            Text(
              text,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.blue,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _navigateToAddEducation() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddEducationPage(
              onSave: (education) {
                final section = ProfileSection(
                  title: "Education",
                  content: [
                    ProfileEntryWidget(
                      title: education.school,
                      subtitle:
                          "${education.degree} in ${education.fieldOfStudy}",
                      description:
                          "From ${education.startDate.year} to ${education.endDate ?? 'Present'}",
                    ),
                  ],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }

  void _navigateToAddExperience() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddExperiencePage(
              onSave: (experience) {
                final section = ProfileSection(
                  title: "Experience",
                  content: [
                    ProfileEntryWidget(
                      title: experience.position,
                      subtitle: experience.company,
                      description:
                          "From ${experience.startDate.year} to ${experience.endDate?.year ?? 'Present'}",
                    ),
                  ],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }

  void _navigateToAddSkill() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddSkillPage(
              onSave: (skill) {
                final section = ProfileSection(
                  title: "Skills",
                  content: [ProfileEntryWidget(title: skill.name)],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }

  void _navigateToAddCourse() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddCoursePage(
              onSave: (course) {
                final section = ProfileSection(
                  title: "Courses",
                  content: [
                    ProfileEntryWidget(
                      title: course.name,
                      subtitle: course.provider,
                      description:
                          course.completionDate != null
                              ? "Completed on ${course.completionDate!.toLocal()}"
                              : null,
                    ),
                  ],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }

  void _navigateToAddProject() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddProjectPage(
              onSave: (project) {
                final section = ProfileSection(
                  title: "Projects",
                  content: [
                    ProfileEntryWidget(
                      title: project.name,
                      description: project.description,
                    ),
                  ],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }

  void _navigateToAddInterest() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => AddInterestPage(
              onSave: (interest) {
                final section = ProfileSection(
                  title: "Interests",
                  content: [ProfileEntryWidget(title: interest.name)],
                );
                widget.onSectionAdded(section);
              },
            ),
      ),
    );
  }
}
