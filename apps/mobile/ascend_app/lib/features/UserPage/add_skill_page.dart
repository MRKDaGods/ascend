import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddSkillPage extends StatefulWidget {
  final void Function(Skill) onSave;

  const AddSkillPage({super.key, required this.onSave});

  @override
  _AddSkillPageState createState() => _AddSkillPageState();
}

class _AddSkillPageState extends State<AddSkillPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _skillController = TextEditingController();
  final List<String> _suggestedSkills = [
    "C (Programming Language)",
    "AngularJS",
    "Node.js",
    "Redux.js",
    "Incident Management",
    "C#",
    "React Native",
    "Software Development",
    "IT Service Management",
    "Embedded Systems",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add skill"),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "* Indicates required",
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              _buildLabeledTextField(
                label: "Skill*",
                controller: _skillController,
                placeholder: "Skill (ex: Project Management)",
              ),
              const SizedBox(height: 16),
              _buildSuggestedSkills(),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveSkill,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  foregroundColor: Colors.white,
                  backgroundColor: const Color.fromARGB(255, 0, 123, 255),
                ),
                child: const Text("Save"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabeledTextField({
    required String label,
    required TextEditingController controller,
    String? placeholder,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            decoration: InputDecoration(
              hintText: placeholder,
              border: const OutlineInputBorder(),
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(
                vertical: 8,
                horizontal: 12,
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return "This field is required";
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestedSkills() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "Suggested based on your profile",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                setState(() {
                  _suggestedSkills.clear();
                });
              },
            ),
          ],
        ),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children:
              _suggestedSkills.map((skill) {
                return GestureDetector(
                  onTap: () {
                    _skillController.text = skill;
                  },
                  child: Chip(
                    label: Text(skill),
                    backgroundColor: Colors.grey[200],
                  ),
                );
              }).toList(),
        ),
      ],
    );
  }

  void _saveSkill() {
    if (_formKey.currentState!.validate()) {
      final skill = Skill(
        id: 0, // Dummy ID, replace with actual logic
        name: _skillController.text,
      );
      widget.onSave(skill);
      Navigator.pop(context);
    }
  }
}
