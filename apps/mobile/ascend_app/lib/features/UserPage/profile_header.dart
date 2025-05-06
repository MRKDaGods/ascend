import 'package:flutter/material.dart';
import 'profile_header_links.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({
    super.key,
    required this.name,
    required this.bio,
    required this.location,
    required this.latestEducation,
    required this.connections,
    required this.isconnect,
    required this.isPending,
    this.mutualConnections = const [],
    this.links = const [],
    this.verified = false,
    this.degree = '1st',
    this.isMyProfile = false,
    this.namePronunciation = false,
    this.showSchool = true,
    this.showCurrentCompany = true,
    this.currentPosition = '',
  });

  final String name;
  final bool namePronunciation;
  final String bio;
  final String location;
  final String latestEducation;
  final int connections;
  final bool isconnect;
  final bool isPending;
  final List<String> mutualConnections;
  final List<Map<String, String>> links;
  final bool showSchool;
  final bool showCurrentCompany;
  final String currentPosition;
  final bool verified;
  final String degree;
  final bool isMyProfile;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (name.isNotEmpty) _buildNameSection(),
        const SizedBox(height: 12),

        if (bio.isNotEmpty) _buildBioSection(),
        const SizedBox(height: 16),

        if (latestEducation.isNotEmpty || location.isNotEmpty)
          _buildEducationLocationSection(),
        const SizedBox(height: 12),

        if (links.isNotEmpty) _buildLinks(context),

        if (connections > 0) _buildConnectionsSection(),
        const SizedBox(height: 8),

        if (mutualConnections.isNotEmpty && !isMyProfile)
          _buildMutualConnections(context),
      ],
    );
  }

  Widget _buildNameSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            Text(
              name,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(width: 8),
            if (verified)
              const Icon(Icons.gpp_good_outlined, size: 20, color: Colors.blue),
            const SizedBox(width: 5),
            if (namePronunciation)
              const Icon(Icons.volume_up_outlined, size: 20),
            const SizedBox(width: 5),
            Text(degree, style: const TextStyle(color: Colors.white70)),
          ],
        ),
      ],
    );
  }

  Widget _buildBioSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          bio,
          style: const TextStyle(fontSize: 16, height: 1.4),
          textAlign: TextAlign.left,
        ),
      ],
    );
  }

  // Education & Location Section
  Widget _buildEducationLocationSection() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 5, // Space between items
          runSpacing: 5, // Space between lines
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            if (showCurrentCompany && currentPosition.isNotEmpty)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.work_outline, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    currentPosition,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            if (showCurrentCompany &&
                currentPosition.isNotEmpty &&
                showSchool &&
                latestEducation.isNotEmpty)
              const Text("•", style: TextStyle(fontSize: 14)),
            if (showSchool && latestEducation.isNotEmpty)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.school_outlined, size: 16),
                  const SizedBox(width: 4),
                  Text(
                    latestEducation,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            const Icon(Icons.location_on_outlined, size: 16),
            const SizedBox(width: 4),
            Text(
              location,
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
          ],
        ),
      ],
    );
  }

  // Connections Section
  Widget _buildConnectionsSection() {
    return Column(
      children: [
        Text(
          connections < 500 ? '$connections connections' : '500+ connections',
          style: TextStyle(color: !isconnect ? Colors.grey[900] : Colors.blue),
        ),
        const SizedBox(height: 5),
      ],
    );
  }

  Widget _buildLinks(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (links.isNotEmpty)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 5),
              ProfileExtraMaterial(links: links),
            ],
          ),
        const SizedBox(height: 5),
      ],
    );
  }

  Widget _buildMutualConnections(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _showMutualConnectionsDialog(context, mutualConnections);
      },
      child: Row(
        children: [
          const Icon(Icons.people, size: 16),
          const SizedBox(width: 5),
          Expanded(
            child: Text(
              mutualConnections.length > 2
                  ? "${mutualConnections.take(2).join(', ')} , and ${mutualConnections.length - 2} other mutual connections"
                  : "${mutualConnections.join(', and ')} are mutual connections",
              style: const TextStyle(decoration: TextDecoration.underline),
            ),
          ),
        ],
      ),
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
