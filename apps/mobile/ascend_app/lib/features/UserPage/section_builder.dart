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
      Text(
        section.title,
        style: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      for (var item in displayedContent) ...[
        SizedBox(height: 5),
        item,
        Divider(color: Colors.white38),
      ],
      if (hasMoreThanLimit)
        GestureDetector(
          onTap: () {
            // Show all items logic
            showDialog(
              context: context,
              builder: (BuildContext context) {
                return AlertDialog(
                  backgroundColor: Colors.black87,
                  title: Text(
                    'All ${section.title}s',
                    style: TextStyle(color: Colors.white),
                  ),
                  content: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children:
                          section.content.map((item) {
                            return Column(
                              children: [item, Divider(color: Colors.white38)],
                            );
                          }).toList(),
                    ),
                  ),
                  actions: [
                    TextButton(
                      child: Text(
                        'Close',
                        style: TextStyle(color: Colors.white),
                      ),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                );
              },
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Show all $contentCount ${section.title}',
                  style: TextStyle(
                    color: Colors.blue,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Icon(Icons.arrow_forward, color: Colors.blue),
              ],
            ),
          ),
        ),
      SizedBox(height: 20),
    ],
  );
}
