import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

Widget jobCard({
  required Jobsattributes job,
  required bool isDarkMode,
  required void Function(Jobsattributes) onRemove,
  required VoidCallback onTap, // Callback for the card tap
}) {
  return Container(
    decoration: BoxDecoration(
      color: isDarkMode ? const Color.fromARGB(255, 29, 34, 38) : Colors.white,
      borderRadius: BorderRadius.circular(10.0),
      boxShadow: [
        BoxShadow(
          color: isDarkMode ? Colors.black : Colors.grey,
          blurRadius: 10,
          offset: const Offset(0, 3),
        ),
      ],
    ),
    child: GestureDetector(
      onTap: onTap, // Trigger the callback when the card is tapped
      child: Container(
        color:
            isDarkMode ? const Color.fromARGB(255, 29, 34, 38) : Colors.white,
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 5),
        child: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Company Logo
              ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child:
                    job.companyPhoto != null && job.companyPhoto!.isNotEmpty
                        ? (Uri.tryParse(job.companyPhoto!)?.hasAbsolutePath ??
                                false
                            ? Image.network(
                              job.companyPhoto!,
                              fit: BoxFit.cover,
                              width: 50,
                              height: 50,
                              errorBuilder: (context, error, stackTrace) {
                                return Icon(
                                  Icons.image_not_supported,
                                  size: 50,
                                  color: Colors.grey,
                                );
                              },
                            )
                            : Image.asset(
                              job.companyPhoto!,
                              fit: BoxFit.cover,
                              width: 50,
                              height: 50,
                              errorBuilder: (context, error, stackTrace) {
                                return Icon(
                                  Icons.image_not_supported,
                                  size: 50,
                                  color: Colors.grey,
                                );
                              },
                            ))
                        : Icon(
                          Icons.image_not_supported,
                          size: 50,
                          color: Colors.grey,
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
                      style: TextStyle(
                        color: isDarkMode ? Colors.white : Colors.black,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      job.company,
                      style: TextStyle(
                        color: isDarkMode ? Colors.white54 : Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      job.location,
                      style: TextStyle(
                        color: isDarkMode ? Colors.white54 : Colors.black54,
                      ),
                    ),
                    if (job.alumniCount > 0) ...[
                      const SizedBox(height: 4),
                      Text(
                        "${job.alumniCount} school alumni work here",
                        style: TextStyle(
                          color: isDarkMode ? Colors.white54 : Colors.black54,
                        ),
                      ),
                    ],
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 8, // Space between elements
                      runSpacing: 4, // Space between lines when wrapping occurs
                      children: [
                        Text(
                          job.viewed ? "Viewed" : job.timePosted,
                          style: TextStyle(color: Colors.grey[600]),
                        ),
                        if (job.isPromoted)
                          Text(
                            "Promoted",
                            style: TextStyle(color: Colors.orange),
                          ),
                        if (job.isBookmarked)
                          Text(
                            "Saved",
                            style: TextStyle(color: Colors.grey[600]),
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
                                padding: EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.transparent,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  "Easy Apply",
                                  style: TextStyle(
                                    color: Colors.grey,
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

              // Close Button
              GestureDetector(
                onTap:
                    () => onRemove(
                      job,
                    ), // Trigger the callback when the "x" button is pressed
                child: Icon(
                  Icons.close,
                  color: isDarkMode ? Colors.white54 : Colors.black54,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
