import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

class EasyApplyPage extends StatefulWidget {
  final Jobsattributes job;

  const EasyApplyPage({Key? key, required this.job}) : super(key: key);

  @override
  _EasyApplyPageState createState() => _EasyApplyPageState();
}

class _EasyApplyPageState extends State<EasyApplyPage> {
  final _formKey = GlobalKey<FormState>();
  String name = '';
  String email = '';
  String phone = '';

  void applyForJob() {
    if (widget.job.applied) {
      // Show a notification if the user has already applied
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Already applied for this job!")));
    } else {
      // Mark job as applied
      setState(() {
        widget.job.applied = true;
        widget.job.applicationStatus = "Pending"; // Set initial status
      });

      // Show confirmation
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Application Submitted Successfully!")),
      );

      Navigator.pop(context); // Close Easy Apply page
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
            Navigator.pop(context); // Close the page
          },
        ),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                decoration: InputDecoration(labelText: "Full Name"),
                validator: (value) => value!.isEmpty ? "Enter your name" : null,
                onChanged: (value) => name = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: "Email"),
                keyboardType: TextInputType.emailAddress,
                validator:
                    (value) =>
                        value!.contains("@") ? null : "Enter a valid email",
                onChanged: (value) => email = value,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: "Phone Number"),
                keyboardType: TextInputType.phone,
                validator:
                    (value) =>
                        value!.length >= 10
                            ? null
                            : "Enter a valid phone number",
                onChanged: (value) => phone = value,
              ),
              SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  // TODO: Implement file picker for resume upload
                },
                icon: Icon(Icons.upload_file),
                label: Text("Upload Resume"),
              ),
              SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: applyForJob,
                  child: Text("Submit Application"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
