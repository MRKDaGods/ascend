import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddExperiencePage extends StatefulWidget {
  final void Function(Experience) onSave;
  final Experience? experience; // Add this parameter for editing

  const AddExperiencePage({
    super.key,
    required this.onSave,
    this.experience, // Optional parameter for editing
  });

  @override
  State<AddExperiencePage> createState() => _AddExperiencePageState();
}

class _AddExperiencePageState extends State<AddExperiencePage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _companyController;
  late TextEditingController _positionController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  late TextEditingController _descriptionController;
  bool _notifyNetwork = false;
  bool _currentlyWorking = false;
  late bool _isEditing;

  @override
  void initState() {
    super.initState();
    _isEditing = widget.experience != null;

    // Initialize controllers with existing data if in edit mode
    _companyController = TextEditingController(
      text: _isEditing ? widget.experience!.company : '',
    );
    _positionController = TextEditingController(
      text: _isEditing ? widget.experience!.position : '',
    );
    _startDateController = TextEditingController(
      text:
          _isEditing
              ? widget.experience!.startDate.toString().split(' ')[0]
              : '',
    );
    _endDateController = TextEditingController(
      text:
          _isEditing && widget.experience!.endDate != null
              ? widget.experience!.endDate.toString().split(' ')[0]
              : '',
    );
    _descriptionController = TextEditingController(
      text: _isEditing ? widget.experience!.description ?? '' : '',
    );

    // Set current working status based on end date
    _currentlyWorking = _isEditing && widget.experience!.endDate == null;
  }

  @override
  void dispose() {
    _companyController.dispose();
    _positionController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? "Edit Experience" : "Add Experience"),
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
              if (!_isEditing) _buildNotifyNetworkToggle(),
              if (!_isEditing) const SizedBox(height: 16),
              _buildLabeledTextField(
                label: "Company*",
                controller: _companyController,
                placeholder: "Ex: Google",
              ),
              _buildLabeledTextField(
                label: "Position*",
                controller: _positionController,
                placeholder: "Ex: Software Engineer",
              ),
              Row(
                children: [
                  Checkbox(
                    value: _currentlyWorking,
                    onChanged: (value) {
                      setState(() {
                        _currentlyWorking = value!;
                        if (_currentlyWorking) {
                          _endDateController.clear();
                        }
                      });
                    },
                  ),
                  const Text("I currently work here"),
                ],
              ),
              _buildLabeledDateField(
                label: "Start Date*",
                controller: _startDateController,
              ),
              if (!_currentlyWorking)
                _buildLabeledDateField(
                  label: "End Date",
                  controller: _endDateController,
                ),
              _buildLabeledTextField(
                label: "Description",
                controller: _descriptionController,
                placeholder: "Describe your responsibilities",
                maxLines: 5,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveExperience,
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

  Widget _buildNotifyNetworkToggle() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                "Notify network",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              Text(
                "Turn on to notify your network of this career change",
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          ),
        ),
        Switch(
          value: _notifyNetwork,
          onChanged: (value) {
            setState(() {
              _notifyNetwork = value;
            });
          },
        ),
      ],
    );
  }

  Widget _buildLabeledTextField({
    required String label,
    required TextEditingController controller,
    String? placeholder,
    int maxLines = 1,
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
            maxLines: maxLines,
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
              contentPadding: const EdgeInsets.symmetric(
                vertical: 8,
                horizontal: 12,
              ),
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

  void _saveExperience() {
    if (_formKey.currentState!.validate()) {
      final DateTime startDate = DateTime.parse(_startDateController.text);
      final DateTime? endDate =
          _currentlyWorking
              ? null
              : _endDateController.text.isNotEmpty
              ? DateTime.parse(_endDateController.text)
              : null;

      final experience = Experience(
        id: _isEditing ? widget.experience!.id : 0,
        userId: _isEditing ? widget.experience!.userId : 0,
        company: _companyController.text,
        position: _positionController.text,
        startDate: startDate,
        endDate: endDate,
        description:
            _descriptionController.text.isNotEmpty
                ? _descriptionController.text
                : null,
        createdAt: _isEditing ? widget.experience!.createdAt : DateTime.now(),
        updatedAt: DateTime.now(),
      );

      widget.onSave(experience);
      Navigator.pop(context);
    }
  }
}
