import 'dart:convert';
import 'dart:io';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';

class EasyApplyPage extends StatefulWidget {
  final Jobsattributes job;

  const EasyApplyPage({super.key, required this.job});

  @override
  // ignore: library_private_types_in_public_api
  _EasyApplyPageState createState() => _EasyApplyPageState();
}

class _EasyApplyPageState extends State<EasyApplyPage> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String email = '';
  String phone = '';
  int _currentStep = 1;
  File? _selectedFile;
  Uint8List? _selectedFileBytes;

  void applyForJob() {
    // if (widget.job.applied) {
    //   ScaffoldMessenger.of(
    //     context,
    //   ).showSnackBar(SnackBar(content: Text("Already applied for this job!")));
    // } else {
    //   setState(() {
    //     widget.job.applied = true;
    //     widget.job.applicationStatus = "Pending";
    //   });

    //   ScaffoldMessenger.of(context).showSnackBar(
    //     SnackBar(content: Text("Application Submitted Successfully!")),
    //   );

    //   Navigator.pop(context);
    // }
  }

  Future<void> _pickFile() async {
    print("Picking file...");
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );

      if (result != null && result.files.single.path != null) {
        setState(() {
          _selectedFile = File(result.files.single.path!);
        });
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('No file selected')));
      }
    } catch (e) {
      print("Error picking file: $e");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking file: $e')));
    }
  }

  Future<void> _uploadFile() async {
    final String baseUrl = 'https://api.ascendx.tech';
    final String endpoint = '/job/${widget.job.jobID}/applications';
    final String? mimeType = _selectedFile?.path.split('.').last;
    Map<String, dynamic> resumeData = {};
    if (_selectedFile != null) {
      final bytes = await _selectedFile!.readAsBytes();
      resumeData = {
        "buffer": base64Encode(bytes),
        "file_name": _selectedFile!.path.split('/').last,
        "file_size": bytes.length.toString(),
        "mime_type": mimeType,
      };
    }

    final data = {"email": email, "phone": phone, "resume": resumeData};

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
          const SnackBar(content: Text('Applied for job successfully!')),
        );
        Navigator.pop(context);
      } else {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to apply');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true, // Prevent overflow when keyboard appears

      appBar: AppBar(
        title: Text("Easy Apply"),
        leading: IconButton(
          icon: Icon(Icons.close),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            StepProgressIndicator(
              totalSteps: 2,
              currentStep: _currentStep,
              selectedColor: Colors.blue,
              unselectedColor: Colors.grey,
            ),
            SizedBox(height: 20),
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.7,
              child: _currentStep == 1 ? _buildStepOne() : _buildStepTwo(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepOne() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextFormField(
            decoration: InputDecoration(labelText: "Full Name"),
            validator: (value) => value!.isEmpty ? "Enter your name" : null,
            onChanged: (value) => name = value,
          ),
          SizedBox(height: 50),
          TextFormField(
            decoration: InputDecoration(labelText: "Email"),
            keyboardType: TextInputType.emailAddress,
            validator:
                (value) => value!.contains("@") ? null : "Enter a valid email",
            onChanged: (value) => email = value,
          ),
          SizedBox(height: 50),

          TextFormField(
            decoration: InputDecoration(labelText: "Phone Number"),
            keyboardType: TextInputType.phone,
            validator:
                (value) =>
                    value!.length >= 10 ? null : "Enter a valid phone number",
            onChanged: (value) => phone = value,
          ),
          SizedBox(height: 50),
          Center(
            child: ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  setState(() {
                    _currentStep = 2;
                  });
                }
              },
              child: Text("Next"),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepTwo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        if (_selectedFileBytes != null)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'Selected File: resume.pdf',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ElevatedButton.icon(
          onPressed: _pickFile,
          icon: const Icon(Icons.upload_file),
          label: const Text("Pick File"),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () async {
            // if (_selectedFileBytes == null) {
            //   ScaffoldMessenger.of(context).showSnackBar(
            //     const SnackBar(content: Text('Please upload a PDF file.')),
            //   );
            //   return;
            // }

            await _uploadFile();
            applyForJob();
          },
          child: const Text("Submit Application"),
        ),
      ],
    );
  }
}
