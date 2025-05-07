import 'package:flutter/material.dart';

class ReporterInfoCard extends StatelessWidget {
  final int userId;
  final String firstName;
  final String lastName;
  final String? profilePictureUrl;
  final String reason; // Report reason parameter

  const ReporterInfoCard({
    super.key,
    required this.userId,
    required this.firstName,
    required this.lastName,
    this.profilePictureUrl,
    required this.reason,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(top: 8, bottom: 8),
      color: Colors.grey[100],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Reporter profile picture
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: SizedBox(
                width: 40,
                height: 40,
                child:
                    profilePictureUrl != null
                        ? Image.network(
                          profilePictureUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: Colors.grey[300],
                              child: const Icon(
                                Icons.person,
                                color: Colors.grey,
                              ),
                            );
                          },
                        )
                        : Container(
                          color: Colors.grey[300],
                          child: const Icon(Icons.person, color: Colors.grey),
                        ),
              ),
            ),
            const SizedBox(width: 12),
            // Reporter details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Reported by:',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$firstName $lastName',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'User ID: $userId',
                    style: TextStyle(color: Colors.grey[800], fontSize: 12),
                  ),
                  const SizedBox(height: 4),
                  // Report reason display - simple text with red color
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: 'Reason: ',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[800],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextSpan(
                          text: reason,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.red[700],
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
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
