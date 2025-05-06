import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddSkillPage extends StatefulWidget {
  final void Function(Skill) onSave;
  final Skill? skill; // Add this parameter for editing

  const AddSkillPage({
    super.key,
    required this.onSave,
    this.skill, // Optional parameter for editing
  });

  @override
  State<AddSkillPage> createState() => _AddSkillPageState();
}

class _AddSkillPageState extends State<AddSkillPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late bool _isEditing;

  @override
  void initState() {
    super.initState();
    _isEditing = widget.skill != null;
    _nameController = TextEditingController(
      text: _isEditing ? widget.skill!.name : '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? "Edit Skill" : "Add Skill"),
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
                controller: _nameController,
                placeholder: "Ex: JavaScript",
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveSkill,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  foregroundColor: Colors.white,
                  backgroundColor: const Color.fromARGB(255, 0, 123, 255),
                ),
                child: Text(_isEditing ? "Update" : "Save"),
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
            ),
            validator: (value) {
              if (label.endsWith("*") && (value == null || value.isEmpty)) {
                return "This field is required";
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  void _saveSkill() {
    if (_formKey.currentState!.validate()) {
      final skill = Skill(
        id: _isEditing ? widget.skill!.id : 0,
        name: _nameController.text,
      );
      widget.onSave(skill);
      Navigator.pop(context);
    }
  }
}
