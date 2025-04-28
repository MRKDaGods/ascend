import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddExperiencePage extends StatefulWidget {
  final void Function(Experience) onSave;

  const AddExperiencePage({super.key, required this.onSave});

  @override
  _AddExperiencePageState createState() => _AddExperiencePageState();
}

class _AddExperiencePageState extends State<AddExperiencePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _companyController = TextEditingController();
  final TextEditingController _positionController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Experience"),
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
              _buildTextField("Company*", _companyController, maxLength: 150),
              _buildTextField("Position*", _positionController, maxLength: 100),
              _buildDateField("Start date", _startDateController),
              _buildDateField("End date (or expected)", _endDateController),
              _buildTextField(
                "Description",
                _descriptionController,
                maxLength: 1000,
                maxLines: 5,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveExperience,
                child: const Text("Save"),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    int maxLength = 100,
    int maxLines = 1,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        maxLength: maxLength,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
        validator: (value) {
          if (label.endsWith("*") && (value == null || value.isEmpty)) {
            return "This field is required";
          }
          return null;
        },
      ),
    );
  }

  Widget _buildDateField(String label, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        readOnly: true,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
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
    );
  }

  void _saveExperience() {
    if (_formKey.currentState!.validate()) {
      final experience = Experience(
        id: 0, // Dummy ID, replace with actual logic
        userId: 0, // Dummy user ID, replace with actual logic
        company: _companyController.text,
        position: _positionController.text,
        startDate: DateTime.parse(_startDateController.text),
        endDate:
            _endDateController.text.isNotEmpty
                ? DateTime.parse(_endDateController.text)
                : null,
        description: _descriptionController.text,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      widget.onSave(experience);
      Navigator.pop(context);
    }
  }
}
