import 'package:flutter/material.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({
    super.key,
    required this.name,
    required this.verified,
    required this.bio,
    required this.location,
    required this.industry,
    required this.followers,
    required this.employeesCount,
    required this.isconnect,
    required this.isPending,
    this.mutualConnections = const [],
    this.links = const [],
    this.badges = const [],
    this.isMyProfile = false,
  });

  final String name;
  final bool verified;
  final String bio;
  final String location;
  final String industry;
  final int followers;
  final int employeesCount;
  final bool isconnect;
  final bool isPending;
  final List<String> mutualConnections;
  final List<Map<String, String>> links;
  final List<String> badges; // New - Stores profile badges
  final bool isMyProfile; // New - Indicates if the profile is the user's own

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildNameSection(),
        const SizedBox(height: 5),

        _buildBioSection(),
        const SizedBox(height: 5),

        _buildDetailsSection(),
        const SizedBox(height: 5),

        if (mutualConnections.isNotEmpty && !isMyProfile)
          _buildMutualConnections(context),
      ],
    );
  }

  // Name & Verification Section
  Widget _buildNameSection() {
    return Row(
      children: [
        Text(
          name,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        if (verified) const Icon(Icons.gpp_good_outlined, size: 20),
        const SizedBox(width: 5),
      ],
    );
  }

  // Bio Section
  Widget _buildBioSection() {
    return Text(bio, style: const TextStyle(fontSize: 16));
  }

  // Education & Location Section
  // Details Section
  Widget _buildDetailsSection() {
    return Wrap(
      spacing: 5, // Space between items
      runSpacing: 5, // Space between lines
      children: [
        Text(
          industry,
          style: const TextStyle(fontSize: 14, color: Colors.black54),
        ),
        Text(
          "• $location",
          style: const TextStyle(fontSize: 14, color: Colors.black54),
        ),
        Text(
          "• $followers followers",
          style: const TextStyle(fontSize: 14, color: Colors.black54),
        ),
        Text(
          "• $employeesCount employees",
          style: const TextStyle(fontSize: 14, color: Colors.black54),
        ),
      ],
    );
  }

  // Extra Material (Mutual Connections & Links)
  Widget _buildMutualConnections(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (mutualConnections.isNotEmpty)
          GestureDetector(
            onTap: () {
              _showMutualConnectionsDialog(context, mutualConnections);
            },
            child: Row(
              children: [
                const Icon(Icons.people, size: 16, applyTextScaling: true),
                const SizedBox(width: 5),
                Expanded(
                  child: Text(
                    mutualConnections.length > 2
                        ? "${mutualConnections.take(1).join(', ')} & ${mutualConnections.length - 1} other connections follow this page"
                        : mutualConnections.length == 2
                        ? "${mutualConnections.take(1).join(', ')} & ${mutualConnections.length - 1} other connection follow this page"
                        : "${mutualConnections.first} follows this page",
                    style: const TextStyle(
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),

        // Links Section using ProfileExtraMaterial
      ],
    );
  }

  void _showMutualConnectionsDialog(
    BuildContext context,
    List<String> mutualConnections,
  ) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Mutual Connections"),
          content: SizedBox(
            width: double.maxFinite,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: mutualConnections.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(mutualConnections[index]),
                  onTap: () {
                    // You can navigate to the profile of the selected mutual connection
                    Navigator.pop(context);
                  },
                );
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Close", style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}
