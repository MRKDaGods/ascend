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
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart'; // Add this import for PDF rendering

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

  Future<void> _pickFile() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.any, // Allow any file type temporarily for testing
      );

      if (result != null && result.files.single.path != null) {
        final filePath = result.files.single.path!;
        if (filePath.endsWith('.pdf')) {
          // Validate the file extension manually

          setState(() {
            _selectedFile = File(filePath);
            _selectedFileBytes = File(filePath).readAsBytesSync();
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Please select a valid PDF file.')),
          );
        }
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('No file selected.')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking file: $e')));
    }
  }

  Future<http.Response> uploadFile(
    String endpoint,
    File file,
    String context, {
    Map<String, String>? body,
  }) async {
    final String baseUrl = 'https://api.ascendx.tech';
    final url = Uri.parse('$baseUrl$endpoint');
    final token = await SecureStorageHelper.getAuthToken();
    final request = http.MultipartRequest('POST', url);
    request.headers.addAll({
      if (token != null) 'Authorization': 'Bearer $token',
      'x-no-parse-body': '1',
    });
    final fileExtension = path.extension(file.path).toLowerCase();
    MediaType? mediaType;
    if (fileExtension == '.jpg' || fileExtension == '.jpeg') {
      mediaType = MediaType('image', 'jpeg');
    } else if (fileExtension == '.png') {
      mediaType = MediaType('image', 'png');
    } else if (fileExtension == '.pdf') {
      mediaType = MediaType('application', 'pdf');
    } else if (fileExtension == '.doc' || fileExtension == '.docx') {
      mediaType = MediaType('application', 'msword');
    } else if (fileExtension == ".mp4") {
      mediaType = MediaType("video", "mp4");
    } else if (fileExtension == ".mp3") {
      mediaType = MediaType("audio", "mp3");
    } else if (fileExtension == ".txt") {
      mediaType = MediaType("text", "plain");
    } else {
      mediaType = MediaType('application', 'octet-stream');
    }
    if (body != null) {
      body.forEach((key, value) {
        request.fields[key] = value;
      });
    }
    request.files.add(
      http.MultipartFile(
        'resume',
        file.readAsBytes().asStream(),
        file.lengthSync(),
        filename: path.basename(file.path),
        contentType: mediaType,
      ),
    );
    request.fields['context'] = context;
    try {
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      if (response.statusCode < 200 || response.statusCode >= 300) {
        print('Error: ${response.statusCode}, ${response.body}');
        throw Exception(
          'Error: [200b][200b][200b]${response.statusCode}, ${response.body}',
        );
      }
      return response;
    } catch (e) {
      throw Exception('Error uploading file: $e');
    }
  }

  Future<void> _uploadFile() async {
    final String endpoint = '/job/${widget.job.jobID}/applications';
    uploadFile(
          endpoint,
          _selectedFile!,
          'job_application',
          body: {'email': email, 'phone': phone},
        )
        .then((response) {
          print("Response: ${response.body}");
          print("Status Code: ${response.statusCode}");
          if (response.statusCode == 201) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Application submitted successfully!'),
              ),
            );
            Navigator.pop(context);
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error submitting application: ${response.body}'),
              ),
            );
          }
        })
        .catchError((error) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error uploading file: $error')),
          );
        });
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
          Expanded(child: SfPdfViewer.memory(_selectedFileBytes!)),
        ElevatedButton.icon(
          onPressed: _pickFile,
          icon: const Icon(Icons.upload_file),
          label: const Text("Pick File"),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () async {
            await _uploadFile();
          },
          child: const Text("Submit Application"),
        ),
      ],
    );
  }
}
