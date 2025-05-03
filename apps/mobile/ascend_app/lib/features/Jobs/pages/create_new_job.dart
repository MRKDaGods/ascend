import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CreateNewJob extends StatefulWidget {
  final int? companyId;
  final String? title;
  final String? description;
  final String? industry;
  final String? type;
  final String? experienceLevel;
  final String? location;
  final String? workplaceType;
  final int? salaryMinRange;
  final int? salaryMaxRange;
  final bool isEditMode;
  final int? jobId;
  const CreateNewJob({
    super.key,
    this.companyId,
    this.isEditMode = false,
    this.title,
    this.description,
    this.industry,
    this.type,
    this.experienceLevel,
    this.location,
    this.workplaceType,
    this.salaryMinRange,
    this.salaryMaxRange,
    this.jobId,
  });

  @override
  // ignore: library_private_types_in_public_api
  _CreateNewJobState createState() => _CreateNewJobState();
}

class _CreateNewJobState extends State<CreateNewJob> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _industryController;
  late TextEditingController _locationController;
  late TextEditingController _salaryMinController;
  late TextEditingController _salaryMaxController;
  late String _type;
  late String _experienceLevel;
  late String _workplaceType;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.title ?? '');
    _descriptionController = TextEditingController(
      text: widget.description ?? '',
    );
    _industryController = TextEditingController(text: widget.industry ?? '');
    _locationController = TextEditingController(text: widget.location ?? '');
    _salaryMinController = TextEditingController(
      text:
          widget.salaryMinRange != null ? widget.salaryMinRange.toString() : '',
    );
    _salaryMaxController = TextEditingController(
      text:
          widget.salaryMaxRange != null ? widget.salaryMaxRange.toString() : '',
    );
    _type = widget.type ?? 'Full-time';
    _experienceLevel = widget.experienceLevel ?? 'Mid';
    _workplaceType = widget.workplaceType ?? 'Hybrid';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _industryController.dispose();
    _locationController.dispose();
    _salaryMinController.dispose();
    _salaryMaxController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      final data = {
        "title": _titleController.text,
        "description": _descriptionController.text,
        "industry": _industryController.text,
        "type": _type,
        "experience_level": _experienceLevel,
        "location": _locationController.text,
        "workplace_type": _workplaceType,
        "salary_min_range":
            _salaryMinController.text.isNotEmpty
                ? int.tryParse(_salaryMinController.text)
                : 0,
        "salary_max_range":
            _salaryMaxController.text.isNotEmpty
                ? int.tryParse(_salaryMaxController.text)
                : 200000,
        "company_id": widget.companyId,
      };

      final String baseUrl = 'https://api.ascendx.tech';
      final String endpoint = '/job';

      try {
        final token = await SecureStorageHelper.getAuthToken();
        final headers = {
          if (token != null) 'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        final url = Uri.parse('$baseUrl$endpoint');

        final response = await http.post(
          url,
          headers: headers,
          body: jsonEncode(data),
        );

        if (response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Job created successfully!')),
          );
          Navigator.pop(context);
        } else {
          print('Response status: ${response.statusCode}');
          print('Response body: ${response.body}');
          throw Exception('Failed to create job');
        }
      } catch (e) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> editForm(int jobId, Map<String, dynamic> updatedData) async {
    final String baseUrl = 'https://api.ascendx.tech';
    final String endpoint = '/job/$jobId';

    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.patch(
        url,
        headers: headers,
        body: jsonEncode(updatedData),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Job updated successfully!')),
        );
        Navigator.pop(context);
      } else {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to update job');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error updating job: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create New Job')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Job Title'),
                validator: (value) => value!.isEmpty ? 'Enter job title' : null,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                validator:
                    (value) => value!.isEmpty ? 'Enter description' : null,
              ),
              SizedBox(height: 16),

              TextFormField(
                controller: _industryController,
                decoration: const InputDecoration(labelText: 'Industry'),
                validator: (value) => value!.isEmpty ? 'Enter industry' : null,
              ),
              SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _type,
                items:
                    [
                          'Full-time',
                          'Part-time',
                          'Contract',
                          'Temporary',
                          'Volunteer',
                          'Internship',
                          'Other',
                        ]
                        .map(
                          (type) =>
                              DropdownMenuItem(value: type, child: Text(type)),
                        )
                        .toList(),
                onChanged: (value) => setState(() => _type = value!),
                decoration: const InputDecoration(labelText: 'Job Type'),
              ),
              SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _experienceLevel,
                items:
                    ['Internship', 'Entry', 'Associate', 'Mid', 'Director']
                        .map(
                          (level) => DropdownMenuItem(
                            value: level,
                            child: Text(level),
                          ),
                        )
                        .toList(),
                onChanged: (value) => setState(() => _experienceLevel = value!),
                decoration: const InputDecoration(
                  labelText: 'Experience Level',
                ),
              ),
              SizedBox(height: 16),

              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(labelText: 'Location'),
                validator: (value) => value!.isEmpty ? 'Enter location' : null,
              ),
              SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _workplaceType,
                items:
                    ['On-site', 'Hybrid', 'Remote']
                        .map(
                          (type) =>
                              DropdownMenuItem(value: type, child: Text(type)),
                        )
                        .toList(),
                onChanged: (value) => setState(() => _workplaceType = value!),
                decoration: const InputDecoration(labelText: 'Workplace Type'),
              ),
              SizedBox(height: 16),

              TextFormField(
                controller: _salaryMinController,
                decoration: const InputDecoration(
                  labelText: 'Minimum Salary (Optional)',
                ),
                keyboardType: TextInputType.number,
              ),
              SizedBox(height: 16),

              TextFormField(
                controller: _salaryMaxController,
                decoration: const InputDecoration(
                  labelText: 'Maximum Salary (Optional)',
                ),
                keyboardType: TextInputType.number,
              ),

              const SizedBox(height: 16),
              if (widget.isEditMode) ...{
                ElevatedButton(
                  onPressed: () {
                    final updatedData = {
                      "title": _titleController.text,
                      "description": _descriptionController.text,
                      "industry": _industryController.text,
                      "type": _type,
                      "experience_level": _experienceLevel,
                      "location": _locationController.text,
                      "workplace_type": _workplaceType,
                      "salary_min_range":
                          _salaryMinController.text.isNotEmpty
                              ? int.tryParse(_salaryMinController.text)
                              : 0,
                      "salary_max_range":
                          _salaryMaxController.text.isNotEmpty
                              ? int.tryParse(_salaryMaxController.text)
                              : 200000,
                    };
                    editForm(widget.jobId!, updatedData);
                  },
                  child: const Text('Edit Job'),
                ),
              },
              if (!widget.isEditMode) ...{
                ElevatedButton(
                  onPressed: _submitForm,
                  child: const Text('Create Job'),
                ),
              },
            ],
          ),
        ),
      ),
    );
  }
}
