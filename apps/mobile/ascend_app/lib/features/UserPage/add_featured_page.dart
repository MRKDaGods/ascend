import 'package:flutter/material.dart';

class AddFeaturedPage extends StatefulWidget {
  final void Function(String) onSave;

  const AddFeaturedPage({super.key, required this.onSave});

  @override
  _AddFeaturedPageState createState() => _AddFeaturedPageState();
}

class _AddFeaturedPageState extends State<AddFeaturedPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _linkController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add Featured Link"),
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
                label: "Link*",
                controller: _linkController,
                placeholder: "Enter a valid URL",
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveFeaturedLink,
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
              final Uri? uri = Uri.tryParse(value);
              if (uri == null || !uri.hasAbsolutePath) {
                return "Please enter a valid URL";
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  void _saveFeaturedLink() {
    if (_formKey.currentState!.validate()) {
      widget.onSave(_linkController.text);
      print(widget.onSave);
      print("Url saved: ${_linkController.text}");
      Navigator.pop(context);
    }
  }
}
