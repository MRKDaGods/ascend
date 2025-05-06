import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactInfoSection extends StatelessWidget {
  final Profile profile;
  final bool isMyProfile;

  const ContactInfoSection({
    Key? key,
    required this.profile,
    required this.isMyProfile,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListView(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Contact Info",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                if (isMyProfile)
                  IconButton(
                    icon: const Icon(Icons.edit_outlined),
                    onPressed: () {
                      // Handle edit contact info
                    },
                  ),
              ],
            ),
          ),

          // Profile link (LinkedIn style)
          _buildContactItem(
            icon: Icons.link,
            title: "Profile",
            value:
                "ascend.app/${profile.firstName.toLowerCase()}${profile.lastName.toLowerCase()}",
            onTap: () {
              // Launch profile URL
            },
          ),

          // Email
          if (profile.contactInfo?.email != null)
            _buildContactItem(
              icon: Icons.email_outlined,
              title: "Email",
              value: profile.contactInfo!.email,
              onTap: () async {
                final Uri emailUri = Uri(
                  scheme: 'mailto',
                  path: profile.contactInfo!.email,
                );
                if (await canLaunchUrl(emailUri)) {
                  await launchUrl(emailUri);
                }
              },
            ),

          // Phone
          if (profile.contactInfo?.phone != null)
            _buildContactItem(
              icon: Icons.phone_outlined,
              title: profile.contactInfo?.phoneType?.value ?? "Phone",
              value: profile.contactInfo!.phone!,
              onTap: () async {
                final Uri phoneUri = Uri(
                  scheme: 'tel',
                  path: profile.contactInfo!.phone,
                );
                if (await canLaunchUrl(phoneUri)) {
                  await launchUrl(phoneUri);
                }
              },
            ),

          // Website
          if (profile.website != null)
            _buildContactItem(
              icon: Icons.language_outlined,
              title: "Website",
              value: profile.website!,
              onTap: () async {
                final Uri websiteUri = Uri.parse(profile.website!);
                if (await canLaunchUrl(websiteUri)) {
                  await launchUrl(
                    websiteUri,
                    mode: LaunchMode.externalApplication,
                  );
                }
              },
            ),

          // Birthday
          if (profile.contactInfo?.birthday != null)
            _buildContactItem(
              icon: Icons.cake_outlined,
              title: "Birthday",
              value:
                  "${profile.contactInfo!.birthday!.month}/${profile.contactInfo!.birthday!.day}",
              onTap: null,
            ),

          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildContactItem({
    required IconData icon,
    required String title,
    required String value,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 24, color: Colors.grey.shade700),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: const TextStyle(fontSize: 16, color: Colors.blue),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
