import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/easy_apply.dart';
import 'package:url_launcher/url_launcher.dart'; // Import url_launcher package
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart' as http; // Import http package
import 'package:ascend_app/features/Jobs/pages/report_page.dart'; // Import the new ReportPage

class JobDetailsPage extends StatefulWidget {
  final Jobsattributes job;
  const JobDetailsPage({super.key, required this.job});

  @override
  // ignore: library_private_types_in_public_api
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
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Could not open the application link.")),
        );
      }
    }
  }

  Future<void> saveJob(int jobId) async {
    final String baseUrl = 'https://api.ascendx.tech';
    final String endpoint = '/job/saved';

    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      final url = Uri.parse('$baseUrl$endpoint/$jobId');

      final response = await http.post(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        widget.job.isBookmarked = true; // Update the job's bookmark status
        setState(() {
          widget.job.isBookmarked = true;
        });
        ScaffoldMessenger.of(
          // ignore: use_build_context_synchronously
          context,
        ).showSnackBar(SnackBar(content: Text('Job saved successfully!')));
      } else {
        if (response.body == '{"error":"Job already saved"}') {
          setState(() {
            widget.job.isBookmarked = true;
          });
          ScaffoldMessenger.of(
            // ignore: use_build_context_synchronously
            context,
          ).showSnackBar(SnackBar(content: Text('Job already saved!')));
        } else {
          // ignore: use_build_context_synchronously
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to save the job: ${response.body}')),
          );
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(
        // ignore: use_build_context_synchronously
        context,
      ).showSnackBar(SnackBar(content: Text('An error occurred: $e')));
    }
  }

  Future<void> deleteJob(int jobId) async {
    final String baseUrl = 'https://api.ascendx.tech';
    final String endpoint = '/job/saved';

    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      final url = Uri.parse('$baseUrl$endpoint/$jobId');

      final response = await http.delete(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        widget.job.isBookmarked = false; // Update the job's bookmark status
        setState(() {}); // Refresh the UI
        ScaffoldMessenger.of(
          // ignore: use_build_context_synchronously
          context,
        ).showSnackBar(SnackBar(content: Text('Job unsaved successfully!')));
      } else {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to unsave the job: ${response.body}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        // ignore: use_build_context_synchronously
        context,
      ).showSnackBar(SnackBar(content: Text('An error occurred: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    widget.job.viewed = true; // Mark the job as viewed
    setState(() {
      widget.job.viewed = true;
    });
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.all(4.0), // Padding around the image
                child:
                    widget.job.companyPhoto != null
                        ? (Uri.tryParse(
                                  widget.job.companyPhoto!,
                                )?.hasAbsolutePath ??
                                false
                            ? (widget.job.companyPhoto!.endsWith('.svg')
                                ? SvgPicture.network(
                                  widget.job.companyPhoto!,
                                  width: 40,
                                  height: 40,
                                  fit:
                                      BoxFit
                                          .contain, // Shrink and resize the image
                                  placeholderBuilder:
                                      (context) => Icon(
                                        Icons.image_not_supported,
                                        size: 40,
                                        color: Colors.grey,
                                      ),
                                )
                                : Image.network(
                                  widget.job.companyPhoto!,
                                  headers: {'User-Agent': 'Mozilla/5.0'},
                                  fit:
                                      BoxFit
                                          .contain, // Shrink and resize the image
                                  width: 40,
                                  height: 40,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Icon(
                                      Icons.image_not_supported,
                                      size: 40,
                                      color: Colors.grey,
                                    );
                                  },
                                ))
                            : Image.asset(
                              widget.job.companyPhoto!,
                              fit:
                                  BoxFit.contain, // Shrink and resize the image
                              width: 40,
                              height: 40,
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
        // Add a report icon at the top right of the job details page
        actions: [
          IconButton(
            icon: Icon(Icons.report, color: Colors.red),
            onPressed: () {
              if (widget.job.jobID != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ReportPage(jobId: widget.job.jobID!),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Job ID is not available.')),
                );
              }
            },
          ),
        ],
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
                // color:
                //     Colors.grey[400], // Subtle text color for dark background
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
                      if (!widget.job.isBookmarked) {
                        saveJob(widget.job.jobID!);
                      } else {
                        deleteJob(widget.job.jobID!);
                      }
                    });
                  },
                  style: OutlinedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  ),
                  child: Text(
                    widget.job.isBookmarked ? "Unsave Job" : "Save Job",
                  ),
                ),
              ],
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
