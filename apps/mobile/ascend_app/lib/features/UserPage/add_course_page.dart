import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddCoursePage extends StatefulWidget {
  final void Function(Course) onSave;

  const AddCoursePage({super.key, required this.onSave});

  @override
  _AddCoursePageState createState() => _AddCoursePageState();
}

class _AddCoursePageState extends State<AddCoursePage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _providerController = TextEditingController();
  final TextEditingController _completionDateController =
      TextEditingController();
  bool _notifyNetwork = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Course"),
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
              _buildLabeledTextField(
                label: "Course Name*",
                controller: _nameController,
                placeholder: "Ex: Data Structures",
              ),
              _buildLabeledTextField(
                label: "Provider",
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
              hintText: "Date",
              fillColor: Colors.white,
              border: const OutlineInputBorder(),
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
          ),
        ],
      ),
    );
  }

  void _saveCourse() {
    if (_formKey.currentState!.validate()) {
      final course = Course(
        id: 0, // Dummy ID, replace with actual logic
        userId: 0, // Dummy user ID, replace with actual logic
        name: _nameController.text,
        provider: _providerController.text,
        completionDate:
            _completionDateController.text.isNotEmpty
                ? DateTime.parse(_completionDateController.text)
                : null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      widget.onSave(course);
      Navigator.pop(context);
    }
  }
}
