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

        if (bio.isNotEmpty) _buildBioSection(),
        const SizedBox(height: 10),

        if (latestEducation.isNotEmpty || location.isNotEmpty)
          _buildEducationLocationSection(),

        if (links.isNotEmpty) _buildLinks(context),

        if (connections > 0) _buildConnectionsSection(),

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
          children: [
            Text(
              name,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            if (verified) const Icon(Icons.gpp_good_outlined, size: 20),
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
    return Column(children: [Text(bio, style: const TextStyle(fontSize: 16))]);
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
          children: [
            if (showCurrentCompany && currentPosition.isNotEmpty)
              Text(currentPosition, style: const TextStyle(fontSize: 14)),
            if (showCurrentCompany &&
                currentPosition.isNotEmpty &&
                showSchool &&
                latestEducation.isNotEmpty)
              const Text("•", style: TextStyle(fontSize: 14)),
            if (showSchool && latestEducation.isNotEmpty)
              Text(latestEducation, style: const TextStyle(fontSize: 14)),
          ],
        ),
        Text(location),
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
