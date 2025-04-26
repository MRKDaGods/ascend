import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';
import 'package:ascend_app/features/Jobs/pages/easy_apply.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_svg/flutter_svg.dart';

class SavedPage extends StatelessWidget {
  final bool isDarkMode;
  final List<Jobsattributes> jobs; // Add jobs parameter

  const SavedPage({
    super.key,
    required this.isDarkMode,
    required this.jobs, // Initialize jobs
  });

  @override
  Widget build(BuildContext context) {
    // Get the first saved job
    final savedJobs = jobs.where((job) => job.isBookmarked).toList();
    final firstSavedJob = savedJobs.isNotEmpty ? savedJobs.first : null;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title and "Show all" button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  "Apply to your saved job",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    //color: isDarkMode ? Colors.white : Colors.black,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Handle "Show all" button press
                },
                child: Row(
                  children: [
                    Text(
                      "Show all",
                      style: TextStyle(
                        //color: isDarkMode ? Colors.white : Colors.black,
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward,
                      //color: isDarkMode ? Colors.white : Colors.black,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Display the first saved job
          if (firstSavedJob != null)
            GestureDetector(
              onTap: () {
                // Handle saved job press
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => JobDetailsPage(job: firstSavedJob),
                  ),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  // color:
                  //     isDarkMode
                  //         ? const Color.fromARGB(255, 29, 34, 38)
                  //         : Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                  boxShadow: [
                    BoxShadow(
                      // color:
                      //     isDarkMode
                      //         ? Colors.black.withOpacity(0.5)
                      //         : Colors.grey,
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.symmetric(vertical: 5),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // First row: Image and Title
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Company Logo
                        // Company Logo
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4.0),
                          child: Container(
                            // color:
                            //     firstSavedJob.companyPhoto != null
                            //         ? (Theme.of(context).brightness ==
                            //                 Brightness.dark
                            //             ? Colors.white
                            //             : Colors
                            //                 .white) // Contrasting background color
                            //         : Colors.transparent,
                            child: SizedBox(
                              width: 50,
                              height: 50,

                              child:
                                  firstSavedJob.companyPhoto != null &&
                                          firstSavedJob.companyPhoto!.isNotEmpty
                                      ? (Uri.tryParse(
                                                firstSavedJob.companyPhoto!,
                                              )?.hasAbsolutePath ??
                                              false
                                          ? (firstSavedJob.companyPhoto!
                                                  .endsWith('.svg')
                                              ? SvgPicture.network(
                                                firstSavedJob.companyPhoto!,
                                                //width: 50,
                                                //height: 50,
                                                fit:
                                                    BoxFit
                                                        .contain, // Ensure the image fits properly
                                                placeholderBuilder:
                                                    (context) => Icon(
                                                      Icons.image_not_supported,
                                                      size: 50,
                                                      //color: Colors.grey,
                                                    ),
                                              )
                                              : Image.network(
                                                firstSavedJob.companyPhoto!,
                                                headers: {
                                                  'User-Agent': 'Mozilla/5.0',
                                                },
                                                fit:
                                                    BoxFit
                                                        .cover, // Ensure the image fits properly
                                                width: 50,
                                                height: 50,
                                                errorBuilder: (
                                                  context,
                                                  error,
                                                  stackTrace,
                                                ) {
                                                  print(
                                                    "Image failed to load: ${firstSavedJob.companyPhoto}",
                                                  );
                                                  return Icon(
                                                    Icons.image_not_supported,
                                                    size: 50,
                                                    //color: Colors.grey,
                                                  );
                                                },
                                              ))
                                          : Image.asset(
                                            firstSavedJob.companyPhoto!,
                                            fit:
                                                BoxFit
                                                    .cover, // Ensure the image fits properly
                                            width: 50,
                                            height: 50,
                                            errorBuilder: (
                                              context,
                                              error,
                                              stackTrace,
                                            ) {
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
                        const SizedBox(
                          width: 12,
                        ), // Space between image and details
                        // Job Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Job Title
                              Text(
                                firstSavedJob.title,
                                style: TextStyle(
                                  // color:
                                  //     isDarkMode ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),

                              // Company Name
                              Text(
                                firstSavedJob.company,
                                style: TextStyle(
                                  // color:
                                  //     isDarkMode
                                  //         ? Colors.white54
                                  //         : Colors.black54,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),

                              // Location
                              Text(
                                firstSavedJob.location,
                                style: TextStyle(
                                  // color:
                                  //     isDarkMode
                                  //         ? Colors.white54
                                  //         : Colors.black54,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Easy Apply or Apply Button
                    GestureDetector(
                      onTap: () async {
                        // Handle Apply button press
                        if (firstSavedJob.easyapply) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder:
                                  (context) =>
                                      EasyApplyPage(job: firstSavedJob),
                            ),
                          );
                        } else if (firstSavedJob.applicationForm != null) {
                          final Uri url = Uri.parse(
                            firstSavedJob.applicationForm!,
                          );
                          if (await canLaunchUrl(url)) {
                            await launchUrl(
                              url,
                              mode: LaunchMode.externalApplication,
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  "Could not open the application link.",
                                ),
                              ),
                            );
                          }
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("No application form available."),
                            ),
                          );
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (firstSavedJob.easyapply) ...[
                              Image.asset(
                                'assets/logo/logo13.png',
                                width: 20,
                                height: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Easy Apply",
                                style: TextStyle(
                                  // color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ] else ...[
                              Text(
                                "Apply",
                                style: TextStyle(
                                  //color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 8),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
