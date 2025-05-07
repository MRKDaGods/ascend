import 'package:ascend_app/features/Jobs/pages/create_new_job.dart';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';

import 'package:ascend_app/features/Jobs/pages/report_page.dart';
import 'package:http/http.dart' as http;

Widget jobCard({
  required BuildContext context, // Added BuildContext parameter
  required Jobsattributes job,
  required bool isDarkMode,
  required void Function(Jobsattributes) onRemove,
  required VoidCallback onTap, // Callback for the card tap
  bool isFromCompanyDetails = false, // Flag to indicate if from CompanyDetails
  String? title,
  String? description,
  String? industry,
  String? type,
  String? experienceLevel,
  String? location,
  String? workplaceType,
  int? salaryMinRange,
  int? salaryMaxRange,
}) {
  return GestureDetector(
    onTap: () {
      if (isFromCompanyDetails) {
        onTap(); // Call the onTap callback if provided
      } else {
        // Default action if no callback is provided
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => JobDetailsPage(job: job)),
        );
      }
    },
    child: Container(
      decoration: BoxDecoration(
        color: null,
        borderRadius: BorderRadius.circular(10.0),
        boxShadow: [
          BoxShadow(
            color: Colors.transparent,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
      child: Padding(
        padding: const EdgeInsets.only(top: 8.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Company Logo
            ClipRRect(
              borderRadius: BorderRadius.circular(4.0),
              child: Container(
                color: Colors.white,
                child: SizedBox(
                  width: 50,
                  height: 50,
                  child:
                      job.companyPhoto != null && job.companyPhoto!.isNotEmpty
                          ? (Uri.tryParse(job.companyPhoto!)?.hasAbsolutePath ??
                                  false
                              ? (job.companyPhoto!.endsWith('.svg')
                                  ? SvgPicture.network(
                                    job.companyPhoto!,
                                    //width: 50,
                                    //height: 50,
                                    fit:
                                        BoxFit
                                            .contain, // Ensure the image fits properly
                                    placeholderBuilder:
                                        (context) => Icon(
                                          Icons.image_not_supported,
                                          size: 50,
                                          //: Colors.grey,
                                        ),
                                  )
                                  : Image.network(
                                    job.companyPhoto!,
                                    headers: {
                                      'User-Agent': 'Mozilla/5.0',
                                      'Authorization': 'Bearer YOUR_TOKEN_HERE',
                                    },
                                    fit:
                                        BoxFit
                                            .cover, // Ensure the image fits properly
                                    width: 50,
                                    height: 50,
                                    errorBuilder: (context, error, stackTrace) {
                                      debugPrint(
                                        "Image failed to load: ${job.companyPhoto}",
                                      );
                                      return Icon(
                                        Icons.image_not_supported,
                                        size: 50,
                                        //color: Colors.grey,
                                      );
                                    },
                                  ))
                              : Image.asset(
                                job.companyPhoto!,
                                fit:
                                    BoxFit
                                        .cover, // Ensure the image fits properly
                                width: 50,
                                height: 50,
                                errorBuilder: (context, error, stackTrace) {
                                  return Icon(
                                    Icons.image_not_supported,
                                    size: 50,
                                    //color: Colors.grey,
                                  );
                                },
                              ))
                          : Icon(
                            Icons.image_not_supported,
                            size: 50,
                            //color: Colors.grey,
                          ),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Job Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    job.title,
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(job.company, style: TextStyle()),
                  const SizedBox(height: 4),
                  Text(job.location, style: TextStyle()),
                  if (job.alumniCount > 0) ...[
                    const SizedBox(height: 4),
                    Text(
                      "${job.alumniCount} school alumni work here",
                      style: TextStyle(),
                    ),
                  ],
                  const SizedBox(height: 4),
                  Text(
                    () {
                      final now = DateTime.now();
                      final difference = now.difference(job.createdAt);
                      if (difference.inMinutes < 60) {
                        return 'Posted less than an hour ago';
                      } else if (difference.inHours < 24) {
                        return 'Posted ${difference.inHours} hours ago';
                      } else {
                        return 'Posted ${difference.inDays} day(s) ago';
                      }
                    }(),
                    style: TextStyle(
                      color:
                          DateTime.now().difference(job.createdAt).inHours < 24
                              ? Colors.green
                              : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 8, // Space between elements
                    runSpacing: 4, // Space between lines when wrapping occurs
                    children: [
                      Text(
                        job.viewed ? "Viewed" : "Not Viewed",
                        //style: TextStyle(color: Colors.grey[600]),
                      ),
                      if (job.isPromoted)
                        Text(
                          "Promoted",
                          //style: TextStyle(color: Colors.orange),
                        ),
                      if (job.isBookmarked)
                        Text(
                          "Saved",
                          //style: TextStyle(color: Colors.grey[600]),
                        ),
                      if (job.easyapply) ...[
                        Wrap(
                          crossAxisAlignment: WrapCrossAlignment.center,
                          spacing: 4, // Space between the logo and text
                          children: [
                            Image.asset(
                              'assets/logo/logo13.png',
                              width: 16,
                              height: 16,
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                //color: Colors.transparent,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                "Easy Apply",
                                style: TextStyle(
                                  //color: Colors.grey,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            if (!isFromCompanyDetails) ...[
              GestureDetector(
                onTap: () {
                  if (job.jobID != null) {
                    final jobId = int.tryParse(
                      job.jobID.toString(),
                    ); // Ensure jobID is parsed as an integer
                    if (jobId != null) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ReportPage(jobId: jobId),
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Invalid Job ID.')),
                      );
                    }
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Job ID is not available.')),
                    );
                  }
                },
                child: Icon(Icons.report),
              ),
            ],
            if (isFromCompanyDetails) ...[
              PopupMenuButton(
                icon: const Icon(Icons.more_vert),
                onSelected: (value) async {
                  if (value == 'edit') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => CreateNewJob(
                              title: title,
                              description: description,
                              industry: industry,
                              type: type,
                              experienceLevel: experienceLevel,
                              location: location,
                              workplaceType: workplaceType,
                              salaryMinRange: salaryMinRange,
                              salaryMaxRange: salaryMaxRange,
                              isEditMode: true,
                              jobId: job.jobID,
                            ),
                      ),
                    );
                  } else if (value == 'delete') {
                    // DELETE request
                    try {
                      final token = await SecureStorageHelper.getAuthToken();
                      final String baseUrl = 'https://api.ascendx.tech';
                      final String endpoint =
                          '/job/${job.jobID}'; // Adjust the endpoint as needed
                      final headers = {
                        if (token != null) 'Authorization': 'Bearer $token',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      };
                      final url = Uri.parse('$baseUrl$endpoint');
                      final response = await http.delete(url, headers: headers);
                      print("Response status: ${response.statusCode}");
                      print("Response body: ${response.body}");
                      if (response.statusCode == 204) {
                        // Handle successful deletion
                        // ignore: use_build_context_synchronously
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Job deleted successfully!'),
                          ),
                        );
                      } else {
                        // Handle error
                        // ignore: use_build_context_synchronously
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Failed to delete job.'),
                          ),
                        );
                      }
                    } catch (e) {
                      // Handle network or other errors
                      // ignore: use_build_context_synchronously
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Error deleting job: $e')),
                      );
                    }
                  }
                },
                itemBuilder:
                    (context) => [
                      PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: const [
                            Icon(Icons.edit, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Edit Job'),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: const [
                            Icon(Icons.delete, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete Job'),
                          ],
                        ),
                      ),
                    ],
              ),
            ],
          ],
        ),
      ),
    ),
  );
}
