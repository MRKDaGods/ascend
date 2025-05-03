import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
// ignore: depend_on_referenced_packages
import 'package:path/path.dart' as path;
import 'dart:io';
import 'dart:convert';

class CreateCompany extends StatefulWidget {
  const CreateCompany({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _CreateCompanyState createState() => _CreateCompanyState();
}

class _CreateCompanyState extends State<CreateCompany> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _industryController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  final TextEditingController _domainController = TextEditingController();
  String? _profilePhotoBase64;
  String? _coverPhotoBase64;
  Map<String, String>? _profilePhotoMeta;
  Map<String, String>? _coverPhotoMeta;
  String profilePhotoMimeType = 'image/jpeg';
  String coverPhotoMimeType = 'image/jpeg';
  String profilePhotoFileName = 'profile_photo.jpg';
  String coverPhotoFileName = 'cover_photo.jpg';
  int profilefileSize = 5 * 1024 * 1024; // 5MB
  int coverfileSize = 5 * 1024 * 1024; // 5MB

  Future<void> _pickImage(bool isProfilePhoto) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final file = File(pickedFile.path);
      final fileSize = await file.length();

      if (fileSize > 5 * 1024 * 1024) {
        // Check if file size exceeds 5MB
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Image size exceeds 5MB. Please upload a smaller image.',
            ),
          ),
        );
        return;
      }

      final compressedBytes = await file.readAsBytes().then((bytes) {
        // Compress the image bytes here if needed
        // For example, using the image package or any other compression method
        return bytes; // Replace with compressed bytes if applicable
      });

      final base64Image = base64Encode(compressedBytes);
      final fileName = path.basename(file.path);
      final mimeType = "image/${path.extension(file.path).replaceAll('.', '')}";

      setState(() {
        if (isProfilePhoto) {
          _profilePhotoBase64 = base64Image;
          profilePhotoFileName = fileName;
          profilePhotoMimeType = mimeType;
          profilefileSize = fileSize;
          _profilePhotoMeta = {
            "file_name": fileName,
            "file_size": fileSize.toString(),
            "mime_type": mimeType,
          };
        } else {
          _coverPhotoBase64 = base64Image;
          coverPhotoFileName = fileName;
          coverPhotoMimeType = mimeType;
          coverfileSize = fileSize;
          _coverPhotoMeta = {
            "file_name": fileName,
            "file_size": fileSize.toString(),
            "mime_type": mimeType,
          };
        }
      });
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      final data = {
        "name": _nameController.text,
        "description": _descriptionController.text,
        "industry": _industryController.text,
        "location": _locationController.text,
        "company_domain_name": _domainController.text,
        "profile_photo": {
          "buffer": _profilePhotoBase64,
          "file_name": profilePhotoFileName,
          "file_size": profilefileSize.toString(),
          "mime_type": profilePhotoMimeType,
        },
        "cover_photo": {
          "buffer": _coverPhotoBase64,
          "file_name": coverPhotoFileName,
          "file_size": coverfileSize.toString(),
          "mime_type": coverPhotoMimeType,
        },
      };
      final String baseUrl = 'https://api.ascendx.tech';
      final String endpoint = '/company/companies';

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

        if (response.statusCode == 200) {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Company created successfully!')),
          );
          // ignore: use_build_context_synchronously
          Navigator.pop(context);
        } else {
          print('Response status: ${response.statusCode}');
          print('Response body: ${response.body}');
          throw Exception('Failed to create company');
        }
      } catch (e) {
        print('Error: $e');
        ScaffoldMessenger.of(
          // ignore: use_build_context_synchronously
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create New Company')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Company Name'),
                validator:
                    (value) => value!.isEmpty ? 'Enter company name' : null,
              ),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                validator:
                    (value) => value!.isEmpty ? 'Enter description' : null,
              ),
              TextFormField(
                controller: _industryController,
                decoration: const InputDecoration(labelText: 'Industry'),
                validator: (value) => value!.isEmpty ? 'Enter industry' : null,
              ),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(labelText: 'Location'),
                validator: (value) => value!.isEmpty ? 'Enter location' : null,
              ),
              TextFormField(
                controller: _domainController,
                decoration: const InputDecoration(labelText: 'Domain Name'),
                validator:
                    (value) => value!.isEmpty ? 'Enter domain name' : null,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => _pickImage(true),
                child: const Text('Upload Profile Photo'),
              ),
              if (_profilePhotoBase64 != null)
                const Text('Profile photo uploaded successfully!'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => _pickImage(false),
                child: const Text('Upload Cover Photo'),
              ),
              if (_coverPhotoBase64 != null)
                const Text('Cover photo uploaded successfully!'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Create Company'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
