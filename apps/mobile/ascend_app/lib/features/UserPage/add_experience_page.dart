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
  bool _notifyNetwork = false;

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
              const Text(
                "* Indicates required",
                style: TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              _buildNotifyNetworkToggle(),
              const SizedBox(height: 16),
              _buildLabeledTextField(
                label: "Title*",
                controller: _positionController,
                placeholder: "Ex: Software Engineer",
              ),
              _buildLabeledTextField(
                label: "Company or organization*",
                controller: _companyController,
                placeholder: "Ex: Google",
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
                label: "Description",
                controller: _descriptionController,
                placeholder: "Describe your role and responsibilities",
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
                "Turn on to notify your network of key profile changes (such as new experience) and work anniversaries.",
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
              fillColor: Colors.white,
              hintText: "Date",
              border: const OutlineInputBorder(),
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
