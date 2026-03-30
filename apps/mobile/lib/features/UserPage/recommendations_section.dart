import 'package:flutter/material.dart';
import 'package:ascend_app/shared/models/profile.dart';

class RecommendationsSection extends StatelessWidget {
  final bool isMyProfile;
  final Profile profile;

  const RecommendationsSection({
    Key? key,
    required this.isMyProfile,
    required this.profile,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Recommendations",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                if (isMyProfile)
                  TextButton.icon(
                    onPressed: () {
                      // Handle add recommendation
                    },
                    icon: const Icon(Icons.add),
                    label: const Text("Ask for recommendation"),
                    style: TextButton.styleFrom(foregroundColor: Colors.blue),
                  ),
              ],
            ),
          ),

          // Placeholder for no recommendations
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: 30.0,
                horizontal: 20.0,
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.rate_review_outlined,
                    size: 48,
                    color: Colors.grey.shade400,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    isMyProfile
                        ? "Recommendations you receive will appear here"
                        : "${profile.firstName} hasn't received any recommendations yet",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
                  ),
                  if (isMyProfile) const SizedBox(height: 16),
                  if (isMyProfile)
                    ElevatedButton(
                      onPressed: () {
                        // Handle ask for recommendation
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.blue,
                        elevation: 0,
                        side: BorderSide(color: Colors.blue.shade700),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 12,
                        ),
                      ),
                      child: const Text("Ask for a recommendation"),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
