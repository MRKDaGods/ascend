import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';
import 'package:ascend_app/features/Jobs/easy_apply.dart';

class SavedPage extends StatelessWidget {
  final bool isDarkMode;

  const SavedPage({super.key, required this.isDarkMode});

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
                    color: isDarkMode ? Colors.white : Colors.black,
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
                        color: isDarkMode ? Colors.white : Colors.black,
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward,
                      color: isDarkMode ? Colors.white : Colors.black,
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
                  color:
                      isDarkMode
                          ? const Color.fromARGB(255, 29, 34, 38)
                          : Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                  boxShadow: [
                    BoxShadow(
                      color:
                          isDarkMode
                              ? Colors.black.withOpacity(0.5)
                              : Colors.grey,
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
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4.0),
                          child:
                              (firstSavedJob.companyPhoto != null &&
                                      firstSavedJob.companyPhoto!.isNotEmpty)
                                  ? Image.asset(
                                    firstSavedJob.companyPhoto!,
                                    width: 50,
                                    height: 50,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Image.asset(
                                        'assets/company_placeholder.png',
                                        width: 50,
                                        height: 50,
                                        fit: BoxFit.cover,
                                      );
                                    },
                                  )
                                  : Image.asset(
                                    'assets/company_placeholder.png',
                                    width: 50,
                                    height: 50,
                                    fit: BoxFit.cover,
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
                                  color:
                                      isDarkMode ? Colors.white : Colors.black,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),

                              // Company Name
                              Text(
                                firstSavedJob.company,
                                style: TextStyle(
                                  color:
                                      isDarkMode
                                          ? Colors.white54
                                          : Colors.black54,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),

                              // Location
                              Text(
                                firstSavedJob.location,
                                style: TextStyle(
                                  color:
                                      isDarkMode
                                          ? Colors.white54
                                          : Colors.black54,
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
                      onTap: () {
                        // Handle Apply button press
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => EasyApplyPage(job: firstSavedJob),
                          ),
                        );
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
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ] else ...[
                              Text(
                                "Apply",
                                style: TextStyle(
                                  color: Colors.white,
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
