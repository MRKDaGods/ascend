import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddCoursePage extends StatefulWidget {
  final void Function(Course) onSave;
  final Course? course; // Add this parameter for editing

  const AddCoursePage({
    super.key,
    required this.onSave,
    this.course, // Optional parameter for editing
  });

  @override
  State<AddCoursePage> createState() => _AddCoursePageState();
}

class _AddCoursePageState extends State<AddCoursePage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _providerController;
  late TextEditingController _completionDateController;
  late bool _isEditing;

  @override
  void initState() {
    super.initState();
    _isEditing = widget.course != null;

    _nameController = TextEditingController(
      text: _isEditing ? widget.course!.name : '',
    );
    _providerController = TextEditingController(
      text: _isEditing ? widget.course!.provider : '',
    );
    _completionDateController = TextEditingController(
      text:
          _isEditing && widget.course!.completionDate != null
              ? widget.course!.completionDate.toString().split(' ')[0]
              : '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _providerController.dispose();
    _completionDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? "Edit Course" : "Add Course"),
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
                label: "Course Name*",
                controller: _nameController,
                placeholder: "Ex: Machine Learning",
              ),
              _buildLabeledTextField(
                label: "Provider*",
                controller: _providerController,
                placeholder: "Ex: Coursera",
              ),
              _buildLabeledDateField(
                label: "Completion Date",
                controller: _completionDateController,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveCourse,
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

  Widget _buildLabeledDateField({
    required String label,
    required TextEditingController controller,
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
            readOnly: true,
            decoration: InputDecoration(
              border: const OutlineInputBorder(),
              fillColor: Colors.white,
              hintText: "Date",
              suffixIcon: const Icon(Icons.calendar_today),
            ),
            onTap: () async {
              final DateTime? pickedDate = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime(1900),
                lastDate: DateTime(2100),
              );
              if (pickedDate != null) {
                controller.text = pickedDate.toIso8601String().split('T').first;
              }
            },
          ),
        ],
      ),
    );
  }

  void _saveCourse() {
    if (_formKey.currentState!.validate()) {
      DateTime? completionDate;
      if (_completionDateController.text.isNotEmpty) {
        completionDate = DateTime.parse(_completionDateController.text);
      }

      final course = Course(
        id: _isEditing ? widget.course!.id : 0,
        userId: _isEditing ? widget.course!.userId : 0,
        name: _nameController.text,
        provider: _providerController.text,
        completionDate: completionDate,
        createdAt: _isEditing ? widget.course!.createdAt : DateTime.now(),
        updatedAt: DateTime.now(),
      );

      widget.onSave(course);
      Navigator.pop(context);
    }
  }
}
