import 'package:flutter/material.dart';
import 'add_education_page.dart';
import 'add_experience_page.dart';

class AddSectionPage extends StatefulWidget {
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
                {"label": "Add skills", "action": null},
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
                {"label": "Add projects", "action": null},
                {"label": "Add courses", "action": null},
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
            const Icon(Icons.add, color: Colors.blue),
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
                // Handle saving the education entry
                print("Education saved: ${education.toJson()}");
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
                // Handle saving the experience entry
                print("Experience saved: ${experience.toJson()}");
              },
            ),
      ),
    );
  }
}
