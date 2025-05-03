import 'dart:convert';
import 'dart:io';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:path/path.dart' as path;

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
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('File uploaded')));
        setState(() {
          _selectedFile = File(result.files.single.path!);
        });
      } else {
        ScaffoldMessenger.of(
          // ignore: use_build_context_synchronously
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

  Future<File> convertToPdfFile(File originalFile) async {
    // Define the path for the new PDF file
    final String newPath =
        '${originalFile.parent.path}/converted_${path.basename(originalFile.path)}';

    // Create a new file and write the binary content of the original file
    final File newPdfFile = File(newPath);
    await newPdfFile.writeAsBytes(await originalFile.readAsBytes());

    print('New PDF File Path: $newPath');
    return newPdfFile;
  }

  Future<void> _uploadFile() async {
    final String baseUrl = 'https://api.ascendx.tech';
    final String endpoint = '/job/${widget.job.jobID}/applications';

    if (_selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a PDF file.')),
      );
      return;
    }

    try {
      final token = await SecureStorageHelper.getAuthToken();
      final url = Uri.parse('$baseUrl$endpoint');
      print('Uploading file to: $url');
      var request =
          http.MultipartRequest('POST', url)
            ..fields['email'] = email
            ..fields['phone'] = phone
            ..headers.addAll({
              if (token != null) 'Authorization': 'Bearer $token',
              'Accept': 'application/json',
            })
            ..files.add(
              await http.MultipartFile.fromPath(
                'resume', // <-- The key expected by your backend
                _selectedFile!.path,
                contentType: MediaType('application', 'pdf'),
              ),
            );

      var response = await request.send();

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Applied for job successfully!')),
        );
        Navigator.pop(context);
      } else {
        final responseBody = await response.stream.bytesToString();
        print('Response status: ${response.statusCode}');
        print('Response body: $responseBody');
        throw Exception('Failed to apply');
      }
    } catch (e) {
      print('Error: $e');
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

            _uploadFile();
          },
          child: const Text("Submit Application"),
        ),
      ],
    );
  }
}
