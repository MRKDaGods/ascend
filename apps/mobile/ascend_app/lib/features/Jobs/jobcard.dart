import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

Widget jobCard({
  required Jobsattributes job,
  required bool isDarkMode,
  required void Function(Jobsattributes) onRemove,
}) {
  return Container(
    color: isDarkMode ? const Color.fromARGB(255, 29, 34, 38) : Colors.white,
    margin: EdgeInsets.symmetric(horizontal: 16, vertical: 5),
    child: Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(4.0),
            child:
                (job.companyPhoto != null && job.companyPhoto!.isNotEmpty)
                    ? Image.asset(
                      job.companyPhoto!,
                      fit: BoxFit.cover,
                      width: 50,
                      height: 50,
                      errorBuilder: (context, error, stackTrace) {
                        return Image.asset(
                          'assets/company_placeholder.png',
                          fit: BoxFit.cover,
                          width: 50,
                          height: 50,
                        );
                      },
                    )
                    : Image.asset(
                      'assets/company_placeholder.png',
                      fit: BoxFit.cover,
                      width: 50,
                      height: 50,
                    ),
          ),
          SizedBox(width: 12),
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
                SizedBox(height: 4),
                Text(
                  job.company,
                  style: TextStyle(
                    color: isDarkMode ? Colors.white54 : Colors.black54,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  job.location,
                  style: TextStyle(
                    color: isDarkMode ? Colors.white54 : Colors.black54,
                  ),
                ),
                if (job.alumniCount > 0) ...[
                  SizedBox(height: 4),
                  Text(
                    "${job.alumniCount} school alumni work here",
                    style: TextStyle(
                      color: isDarkMode ? Colors.white54 : Colors.black54,
                    ),
                  ),
                ],
                SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      job.viewed ? "Viewed" : job.timePosted,
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                    if (job.isPromoted) ...[
                      SizedBox(width: 8),
                      Text("Promoted", style: TextStyle(color: Colors.orange)),
                    ],
                    if (job.isBookmarked) ...[
                      SizedBox(width: 8),
                      Text("saved", style: TextStyle(color: Colors.grey[600])),
                    ],
                    if (job.easyapply) ...[
                      SizedBox(width: 15),
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
                  ],
                ),
              ],
            ),
          ),
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
  );
}
