import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';
// import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:io';

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
    if (widget.job.applied) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Already applied for this job!")));
    } else {
      setState(() {
        widget.job.applied = true;
        widget.job.applicationStatus = "Pending";
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Application Submitted Successfully!")),
      );

      Navigator.pop(context);
    }
  }

  // Future<void> _pickFile() async {
  //   FilePickerResult? result = await FilePicker.platform.pickFiles(
  //     type: FileType.custom,
  //     allowedExtensions: ['pdf'],
  //   );

  //   if (result != null) {
  //     if (kIsWeb) {
  //       setState(() {
  //         _selectedFileBytes = result.files.single.bytes;
  //       });
  //     } else {
  //       String filePath = result.files.single.path!;
  //       if (filePath.endsWith('.pdf')) {
  //         setState(() {
  //           _selectedFile = File(filePath);
  //         });
  //       } else {
  //         ScaffoldMessenger.of(context).showSnackBar(
  //           SnackBar(content: Text('Please select a valid PDF file.')),
  //         );
  //       }
  //     }
  //   } else {
  //     ScaffoldMessenger.of(
  //       context,
  //     ).showSnackBar(SnackBar(content: Text('No file selected')));
  //   }
  // }

  Future<void> _uploadFile() async {
    if (_selectedFile == null) return;

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('https://api.ascendx.tech/job/User'),
    );

    request.headers['Authorization'] = 'Bearer YOUR_AUTHORIZATION_KEY';
    request.files.add(
      await http.MultipartFile.fromPath('resume', _selectedFile!.path),
    );
    request.fields['email'] = email;
    request.fields['phone'] = phone;

    var response = await request.send();
    print('Response status: ${response.statusCode}');
    print('Response body: ${await response.stream.bytesToString()}');
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('File uploaded successfully')));
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('File upload failed')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Easy Apply"),
        leading: IconButton(
          icon: Icon(Icons.close),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
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
            Expanded(
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
            // validator: (value) => value!.isEmpty ? "Enter your name" : null,
            onChanged: (value) => name = value,
          ),
          SizedBox(height: 50),
          TextFormField(
            decoration: InputDecoration(labelText: "Email"),
            keyboardType: TextInputType.emailAddress,
            // validator:
            //     (value) => value!.contains("@") ? null : "Enter a valid email",
            onChanged: (value) => email = value,
          ),
          SizedBox(height: 50),

          TextFormField(
            decoration: InputDecoration(labelText: "Phone Number"),
            keyboardType: TextInputType.phone,
            // validator:
            //     (value) =>
            //         value!.length >= 10 ? null : "Enter a valid phone number",
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
        if (_selectedFile != null)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'Selected File: ${_selectedFile!.path.split('/').last}',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ElevatedButton.icon(
          // onPressed: _pickFile,
          onPressed: () {},
          icon: Icon(Icons.upload_file),
          label: Text("Pick File"),
        ),
        SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {
            _uploadFile();
            applyForJob();
          },
          child: Text("Submit Application"),
        ),
      ],
    );
  }
}
