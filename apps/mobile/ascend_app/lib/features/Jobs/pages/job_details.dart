import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/easy_apply.dart';
import 'package:url_launcher/url_launcher.dart'; // Import url_launcher package

class JobDetailsPage extends StatefulWidget {
  final Jobsattributes job;

  const JobDetailsPage({Key? key, required this.job}) : super(key: key);

  @override
  _JobDetailsPageState createState() => _JobDetailsPageState();
}

class _JobDetailsPageState extends State<JobDetailsPage> {
  void applyForJob() async {
    if (widget.job.easyapply) {
      // Navigate to Easy Apply Page
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => EasyApplyPage(job: widget.job)),
      ).then((_) {
        // Refresh state after returning from Easy Apply
        setState(() {});
      });
    } else {
      // Open external link for application
      final url = widget.job.applicationForm;
      // ignore: deprecated_member_use
      if (url != null && await canLaunch(url)) {
        // ignore: deprecated_member_use
        await launch(url);
      } else {
        // Show error if the link is invalid
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Could not open the application link.")),
        );
      }
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
              child: Container(
                color:
                    widget.job.companyPhoto != null
                        ? (Theme.of(context).brightness == Brightness.dark
                            ? Colors.white
                            : Colors.black) // Contrasting background color
                        : Colors.transparent, // Transparent if no photo
                padding: const EdgeInsets.all(4.0), // Padding around the image
                child:
                    widget.job.companyPhoto != null
                        ? (Uri.tryParse(
                                  widget.job.companyPhoto!,
                                )?.hasAbsolutePath ??
                                false
                            ? Image.network(
                              widget.job.companyPhoto!,
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
                            )
                            : Image.asset(
                              widget.job.companyPhoto!,
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
                            ))
                        : Icon(
                          Icons.image_not_supported,
                          size: 40,
                          color: Colors.grey,
                        ),
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
              style: TextStyle(
                fontSize: 16,
                color:
                    Colors.grey[400], // Subtle text color for dark background
              ),
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
                  child: Text(widget.job.easyapply ? "Easy Apply" : "Apply"),
                ),
                OutlinedButton(
                  onPressed: () {
                    setState(() {
                      widget.job.isBookmarked = !widget.job.isBookmarked;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          widget.job.isBookmarked
                              ? "Job saved!"
                              : "Job unsaved!",
                        ),
                      ),
                    );
                  },
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
            Divider(
              color: Colors.grey[700],
            ), // Divider color for dark background
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
