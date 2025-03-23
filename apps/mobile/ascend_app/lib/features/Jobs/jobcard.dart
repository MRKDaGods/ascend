import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

Widget jobCard(Jobsattributes job, {required bool isDarkMode}) {
  return Card(
    color: isDarkMode ? Colors.black : Colors.white,
    elevation: 2,
    margin: EdgeInsets.symmetric(horizontal: 16, vertical: 5),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
    child: ListTile(
      leading: ClipRRect(
        borderRadius: BorderRadius.circular(4.0),
        child: Container(
          width: 40,
          height: 40,
          color: isDarkMode ? Colors.white : Colors.black,
          child:
              (job.companyPhoto != null && job.companyPhoto!.isNotEmpty)
                  ? Image.asset(
                    job.companyPhoto!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Image.asset(
                        'assets/company_placeholder.png', // ✅ Correct placeholder
                        fit: BoxFit.cover,
                      );
                    },
                  )
                  : Image.asset(
                    'assets/company_placeholder.png',
                    fit: BoxFit.cover,
                  ),
        ),
      ),
      title: Text(
        job.title,
        style: TextStyle(
          color: isDarkMode ? Colors.white : Colors.black,
          fontWeight: FontWeight.bold,
        ),
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
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
          Text(
            job.timePosted,
            style: TextStyle(
              color:
                  job.isPromoted
                      ? Colors.orange
                      : (isDarkMode ? Colors.white54 : Colors.black54),
            ),
          ),
        ],
      ),
      trailing: Icon(
        Icons.close,
        color: isDarkMode ? Colors.white54 : Colors.black54,
      ),
    ),
  );
}
