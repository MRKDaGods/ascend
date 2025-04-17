import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class ProfileExtraMaterial extends StatelessWidget {
  final List<Map<String, String>> links; // List of {title, url}

  const ProfileExtraMaterial({super.key, required this.links});

  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children:
          links.map((link) {
            final String? title = link['title'];
            final String? url = link['url'];

            if (url == null || url.isEmpty) return const SizedBox.shrink();

            // Use the title if it's not null, not empty, and not just spaces
            final String displayText =
                (title == null || title.trim().isEmpty) ? url : title;

            return GestureDetector(
              onTap: () => _launchURL(url),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    displayText,
                    style: const TextStyle(
                      color: Colors.blue,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.open_in_new, color: Colors.blue, size: 16),
                ],
              ),
            );
          }).toList(),
    );
  }
}
