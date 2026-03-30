import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class AddInterestPage extends StatefulWidget {
  final void Function(Interest) onSave;
  final Interest? interest; // Add this parameter for editing

  const AddInterestPage({
    super.key,
    required this.onSave,
    this.interest, // Optional parameter for editing
  });

  @override
  State<AddInterestPage> createState() => _AddInterestPageState();
}

class _AddInterestPageState extends State<AddInterestPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _interestController;
  late bool _isEditing;

  @override
  void initState() {
    super.initState();
    _isEditing = widget.interest != null;
    _interestController = TextEditingController(
      text: _isEditing ? widget.interest!.name : '',
    );
  }

  @override
  void dispose() {
    _interestController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? "Edit Interest" : "Add Interest"),
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
                label: "Interest*",
                controller: _interestController,
                placeholder: "Ex: Artificial Intelligence",
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveInterest,
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

  void _saveInterest() {
    if (_formKey.currentState!.validate()) {
      final interest = Interest(
        id: _isEditing ? widget.interest!.id : 0, // Use existing ID if editing
        name: _interestController.text,
      );
      widget.onSave(interest);
      Navigator.pop(context);
    }
  }
}
