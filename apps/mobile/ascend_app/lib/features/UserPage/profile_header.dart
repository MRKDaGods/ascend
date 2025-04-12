import 'package:flutter/material.dart';
import 'profile_header_links.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({
    super.key,
    required this.name,
    required this.verified,
    required this.degree,
    required this.bio,
    required this.location,
    required this.latestEducation,
    required this.connections,
    required this.isconnect,
    required this.isPending,
    this.mutualConnections = const [],
    this.links = const [],
    this.badges = const [],
    this.isMyProfile = false,
  });

  final String name;
  final String degree;
  final bool verified;
  final String bio;
  final String location;
  final String latestEducation;
  final int connections;
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

        _buildBadgesSection(), // New badges section
        const SizedBox(height: 5),

        _buildBioSection(),
        const SizedBox(height: 5),

        _buildEducationLocationSection(),
        const SizedBox(height: 5),
        if (links.isNotEmpty) _buildLinks(context),
        const SizedBox(height: 5),
        if (connections > 0) _buildConnectionsSection(),
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
          style: const TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        if (verified) const Icon(Icons.verified, color: Colors.blue, size: 20),
        const SizedBox(width: 5),
        Text(degree, style: const TextStyle(color: Colors.white70)),
      ],
    );
  }

  // 🔹 New: Badges Section
  Widget _buildBadgesSection() {
    if (badges.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      children:
          badges.map((badge) {
            Color badgeColor = _getBadgeColor(badge);
            return Chip(
              label: Text(
                badge,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
              backgroundColor: badgeColor,
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            );
          }).toList(),
    );
  }

  // 🔹 Function to get badge color
  Color _getBadgeColor(String badge) {
    switch (badge) {
      case "Open to Work":
        return Colors.green;
      case "Hiring":
        return Colors.purple;
      case "Providing Services":
        return Colors.orange;
      case "Premium":
        return Colors.amber;
      default:
        return Colors.grey;
    }
  }

  // Bio Section
  Widget _buildBioSection() {
    return Text(bio, style: const TextStyle(color: Colors.white70));
  }

  // Education & Location Section
  Widget _buildEducationLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(latestEducation, style: const TextStyle(color: Colors.white70)),
        Text(location, style: const TextStyle(color: Colors.white70)),
      ],
    );
  }

  // Connections Section
  Widget _buildConnectionsSection() {
    return Text(
      connections < 500 ? '$connections connections' : '500+ connections',
      style: TextStyle(color: !isconnect ? Colors.white70 : Colors.blue),
    );
  }

  Widget _buildLinks(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),
        if (links.isNotEmpty)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 5),
              ProfileExtraMaterial(links: links),
            ],
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
                const Icon(
                  Icons.people,
                  color: Colors.white70,
                  size: 16,
                  applyTextScaling: true,
                ),
                const SizedBox(width: 5),
                Expanded(
                  child: Text(
                    mutualConnections.length > 2
                        ? "${mutualConnections.take(2).join(', ')} , and ${mutualConnections.length - 2} other mutual connections"
                        : "${mutualConnections.join(', and ')} are mutual connections",
                    style: const TextStyle(
                      color: Colors.white70,
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
          backgroundColor: Colors.black,
          title: const Text(
            "Mutual Connections",
            style: TextStyle(color: Colors.white),
          ),
          content: SizedBox(
            width: double.maxFinite,
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: mutualConnections.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(
                    mutualConnections[index],
                    style: const TextStyle(color: Colors.white70),
                  ),
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
