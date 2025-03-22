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

        if (connections > 0) _buildConnectionsSection(),

        if (mutualConnections.isNotEmpty || links.isNotEmpty)
          _buildExtraMaterial(),
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

  // Extra Material (Mutual Connections & Links)
  Widget _buildExtraMaterial() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),

        // Mutual Connections
        if (mutualConnections.isNotEmpty)
          Row(
            children: [
              const Icon(Icons.people, color: Colors.white70, size: 16),
              const SizedBox(width: 5),
              Expanded(
                child: Text(
                  "Mutual connections: ${mutualConnections.join(', ')}",
                  style: const TextStyle(color: Colors.white70),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),

        // Links Section using ProfileExtraMaterial
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
}
