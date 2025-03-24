import 'package:flutter/material.dart';
import 'models/profile_section.dart';

var sectionNameswithLimitTwo = [
  "Education",
  "Volunteering",
  "Licenses & Certifications",
  "Skills",
  "Accomplishments",
  "Organizations",
];

Widget buildSection(BuildContext context, ProfileSection section) {
  final int contentCount = section.content.length;
  int limit = 5;
  if (sectionNameswithLimitTwo.contains(section.title)) {
    limit = 2;
  }
  final bool hasMoreThanLimit = contentCount > limit;
  final List<Widget> displayedContent =
      hasMoreThanLimit ? section.content.sublist(0, limit) : section.content;

  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // Full-width Black Divider
      Container(height: 6, width: double.infinity, color: Colors.black),

      // Section Content with Padding
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 12),

            // Section Title
            Text(
              section.title,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 5),

            // Section Content with Dividers
            for (var item in displayedContent) ...[
              SizedBox(height: 5),
              item,
              if (item != displayedContent.last)
                Divider(color: Colors.white38), // Grey divider between items
            ],

            // "Show All" Button if more content exists
            if (hasMoreThanLimit)
              GestureDetector(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        backgroundColor: Colors.black87,
                        title: Text(
                          'All ${section.title}',
                          style: TextStyle(color: Colors.white),
                        ),
                        content: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children:
                                section.content
                                    .map(
                                      (item) => Padding(
                                        padding: EdgeInsets.symmetric(
                                          vertical: 5,
                                        ),
                                        child: item,
                                      ),
                                    )
                                    .toList(),
                          ),
                        ),
                        actions: [
                          TextButton(
                            child: Text(
                              'Close',
                              style: TextStyle(color: Colors.white),
                            ),
                            onPressed: () => Navigator.of(context).pop(),
                          ),
                        ],
                      );
                    },
                  );
                },
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Show all $contentCount ${section.title}',
                        style: TextStyle(color: Colors.blue),
                      ),
                      Icon(Icons.arrow_forward, color: Colors.blue),
                    ],
                  ),
                ),
              ),

            SizedBox(height: 12), // Keep spacing consistent
          ],
        ),
      ),
    ],
  );
}
