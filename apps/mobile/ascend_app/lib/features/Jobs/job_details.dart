import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/easy_apply.dart';

class JobDetailsPage extends StatefulWidget {
  final Jobsattributes job;
  final VoidCallback onBookmarkToggle;

  const JobDetailsPage({
    Key? key,
    required this.job,
    required this.onBookmarkToggle,
  }) : super(key: key);

  @override
  _JobDetailsPageState createState() => _JobDetailsPageState();
}

class _JobDetailsPageState extends State<JobDetailsPage> {
  void applyForJob() {
    if (widget.job.applied) {
      // Show notification if already applied
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Already applied for this job!")));
    } else {
      // Navigate to Easy Apply Page
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => EasyApplyPage(job: widget.job)),
      ).then((_) {
        // Refresh state after returning from Easy Apply
        setState(() {});
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.asset(
                widget.job.companyPhoto ?? 'assets/logo.png',
                width: 40,
                height: 40,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(
                    Icons.image_not_supported,
                    size: 40,
                    color: Colors.grey,
                  );
                },
              ),
            ),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                widget.job.company,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.job.title,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              widget.job.location,
              style: TextStyle(fontSize: 16, color: Colors.grey[700]),
            ),
            SizedBox(height: 16),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: applyForJob,
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  ),
                  child: Text(
                    widget.job.applied ? "Already Applied" : "Easy Apply",
                  ),
                ),
                OutlinedButton(
                  onPressed: widget.onBookmarkToggle,
                  style: OutlinedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  ),
                  child: Text(widget.job.isBookmarked ? "Unsave" : "Save Job"),
                ),
              ],
            ),

            SizedBox(height: 16),

            if (widget.job.applied) // Show Application Status if applied
              Text(
                "Application Status: ${widget.job.applicationStatus}",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
              ),

            SizedBox(height: 16),

            Text(
              "About the Job",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Divider(),
            SizedBox(height: 8),

            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  widget.job.jobDescription ?? "No job description available.",
                  style: TextStyle(fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
