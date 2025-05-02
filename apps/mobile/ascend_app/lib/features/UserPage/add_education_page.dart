import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:ascend_app/features/UserPage/degree_selection_page.dart';

class AddEducationPage extends StatefulWidget {
  final void Function(Education) onSave;

  const AddEducationPage({super.key, required this.onSave});

  @override
  State<AddEducationPage> createState() => _AddEducationPageState();
}

class _AddEducationPageState extends State<AddEducationPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _schoolController = TextEditingController();
  final TextEditingController _degreeController = TextEditingController();
  final TextEditingController _fieldOfStudyController = TextEditingController();
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  final TextEditingController _gradeController = TextEditingController();
  bool _notifyNetwork = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Education"),
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
              _buildNotifyNetworkToggle(),
              const SizedBox(height: 16),
              _buildLabeledTextField(
                label: "School*",
                controller: _schoolController,
                placeholder: "Ex: Boston University",
              ),
              _buildLabeledTextField(
                label: "Degree",
                controller: _degreeController,
                placeholder: "Ex: Bachelor's",
                isReadOnly: true,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) => DegreeSelectionPage(
                            selectedDegree: _degreeController.text,
                            onDegreeSelected: (selectedDegree) {
                              _degreeController.text = selectedDegree;
                            },
                          ),
                    ),
                  );
                },
              ),
              _buildLabeledTextField(
                label: "Field of Study",
                controller: _fieldOfStudyController,
                placeholder: "Ex: Business",
              ),
              _buildLabeledDateField(
                label: "Start Date",
                controller: _startDateController,
              ),
              _buildLabeledDateField(
                label: "End Date (or expected)",
                controller: _endDateController,
              ),
              _buildLabeledTextField(
                label: "Grade",
                controller: _gradeController,
                placeholder: "Ex: A+",
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveEducation,

                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 3),
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
                "Turn on to notify your network of key profile changes (such as new education) and work anniversaries.",
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
    bool isReadOnly = false,
    VoidCallback? onTap,
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
            readOnly: isReadOnly,
            onTap: onTap,
            decoration: InputDecoration(
              hintText: placeholder,
              border: const OutlineInputBorder(),
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(
                vertical: 8, // Adjust vertical padding to reduce height
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
                vertical: 8, // Adjust vertical padding to reduce height
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
          ),
        ],
      ),
    );
  }

  void _saveEducation() {
    if (_formKey.currentState!.validate()) {
      final education = Education(
        id: 0, // Dummy ID, replace with actual logic
        userId: 0, // Dummy user ID, replace with actual logic
        school: _schoolController.text,
        degree: _degreeController.text,
        fieldOfStudy: _fieldOfStudyController.text,
        startDate: DateTime.parse(_startDateController.text),
        endDate:
            _endDateController.text.isNotEmpty ? _endDateController.text : null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      widget.onSave(education);
      Navigator.pop(context);
    }
  }
}
