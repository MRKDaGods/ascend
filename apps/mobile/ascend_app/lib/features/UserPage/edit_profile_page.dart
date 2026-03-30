import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class EditProfilePage extends StatefulWidget {
  final Profile profile;
  final void Function(Profile) onSave;

  const EditProfilePage({
    super.key,
    required this.profile,
    required this.onSave,
  });

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _bioController;
  late TextEditingController _locationController;
  late TextEditingController _currentPositionController;
  late TextEditingController _currentEducationController;
  late TextEditingController _websiteController;
  late TextEditingController _additionalNmae;
  late TextEditingController _industryController;
  late TextEditingController _fullBioController;
  late TextEditingController _namePronunciationController;
  bool _showSchool = false;
  bool _showCurrentCompany = false;

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController(
      text: widget.profile.firstName,
    );
    _lastNameController = TextEditingController(text: widget.profile.lastName);
    _additionalNmae = TextEditingController(
      text: widget.profile.additionalName ?? '',
    );
    _bioController = TextEditingController(text: widget.profile.headline ?? '');
    _locationController = TextEditingController(
      text: widget.profile.location ?? '',
    );
    _currentEducationController = TextEditingController(
      text:
          widget.profile.education?.isNotEmpty == true
              ? widget.profile.education!.first.school
              : '',
    );
    _currentPositionController = TextEditingController(
      text:
          widget.profile.experience?.isNotEmpty == true
              ? widget.profile.experience!.first.position
              : '',
    );
    _websiteController = TextEditingController(
      text: widget.profile.website ?? '',
    );
    _industryController = TextEditingController(
      text: widget.profile.industry ?? '',
    );
    _fullBioController = TextEditingController(text: widget.profile.bio ?? '');
    _namePronunciationController = TextEditingController(
      text: widget.profile.namePronunciation ?? '',
    );
    _showSchool = widget.profile.showSchool ?? false;
    _showCurrentCompany = widget.profile.showCurrentCompany ?? false;
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _bioController.dispose();
    _locationController.dispose();
    _currentPositionController.dispose();
    _currentEducationController.dispose();
    _additionalNmae.dispose();
    _websiteController.dispose();
    _industryController.dispose();
    _fullBioController.dispose();
    _namePronunciationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Edit intro"),
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
                label: "First Name*",
                controller: _firstNameController,
                placeholder: "Enter your first name",
              ),
              _buildLabeledTextField(
                label: "Last Name*",
                controller: _lastNameController,
                placeholder: "Enter your last name",
              ),
              _buildLabeledTextField(
                label: "Additional Name",
                controller: _additionalNmae,
                placeholder: "Enter your additional name",
              ),
              _buildLabeledTextField(
                label: "Name Pronunciation",
                controller: _namePronunciationController,
                placeholder: "How to pronounce your name",
              ),
              _buildLabeledTextField(
                label: "Headline*",
                controller: _bioController,
                placeholder: "Write a short bio about yourself",
                maxLines: 3,
              ),
              _buildLabeledTextField(
                label: "Industry",
                controller: _industryController,
                placeholder: "Enter your industry",
              ),
              _buildLabeledTextField(
                label: "Bio",
                controller: _fullBioController,
                placeholder: "Tell more about yourself",
                maxLines: 5,
              ),
              // _buildLabeledTextField(
              //   label: "Current Position",
              //   controller: _currentPositionController,
              //   placeholder: "Enter your current position",
              // ),
              _buildCheckbox(
                label: "Show Current Company",
                value: _showCurrentCompany,
                onChanged: (value) {
                  setState(() {
                    _showCurrentCompany = value!;
                  });
                },
              ),
              _buildLabeledTextField(
                label: "Education",
                controller: _currentEducationController,
                placeholder: "Enter your current position",
              ),
              _buildCheckbox(
                label: "Show School",
                value: _showSchool,
                onChanged: (value) {
                  setState(() {
                    _showSchool = value!;
                  });
                },
              ),
              _buildLabeledTextField(
                label: "Location",
                controller: _locationController,
                placeholder: "Enter your location",
              ),
              _buildLabeledTextField(
                label: "Website",
                controller: _websiteController,
                placeholder: "Enter your website URL",
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _saveProfile,
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

  Widget _buildCheckbox({
    required String label,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return Row(
      children: [
        Checkbox(value: value, onChanged: onChanged),
        Text(label, style: const TextStyle(fontSize: 16)),
      ],
    );
  }

  void _saveProfile() {
    if (_formKey.currentState!.validate()) {
      final updatedProfile = Profile(
        userId: widget.profile.userId,
        firstName: _firstNameController.text,
        lastName: _lastNameController.text,
        additionalName:
            _additionalNmae.text.isEmpty ? null : _additionalNmae.text,
        headline: _bioController.text,
        location: _locationController.text,
        profilePictureUrl: widget.profile.profilePictureUrl,
        coverPhotoUrl: widget.profile.coverPhotoUrl,
        industry: _industryController.text,
        bio: _fullBioController.text,
        namePronunciation:
            _namePronunciationController.text.isEmpty
                ? null
                : _namePronunciationController.text,
        createdAt: widget.profile.createdAt,
        updatedAt: DateTime.now(),
        website: _websiteController.text,
        showSchool: _showSchool,
        showCurrentCompany: _showCurrentCompany,
        experience: null,
        education: null,
        interests: null,
        projects: null,
        courses: null,
        contactInfo: null,
      );

      widget.onSave(updatedProfile);
      Navigator.pop(context);
    }
  }
}
