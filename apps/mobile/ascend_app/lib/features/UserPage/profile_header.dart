import 'package:flutter/material.dart';

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

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Name & Verification
        _buildNameSection(),
        SizedBox(height: 5),

        // Bio
        _buildBioSection(),
        SizedBox(height: 5),

        // Education & Location
        _buildEducationLocationSection(),
        SizedBox(height: 5),

        // Connections
        if (connections > 0) _buildConnectionsSection(),
      ],
    );
  }

  // Name & Verification Section
  Widget _buildNameSection() {
    return Row(
      children: [
        Text(
          name,
          style: TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        if (verified) Icon(Icons.verified, color: Colors.blue, size: 20),
        SizedBox(width: 5),
        Text(degree, style: TextStyle(color: Colors.white70)),
      ],
    );
  }

  // Bio Section
  Widget _buildBioSection() {
    return Text(bio, style: TextStyle(color: Colors.white70));
  }

  // Education & Location Section
  Widget _buildEducationLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(latestEducation, style: TextStyle(color: Colors.white70)),
        Text(location, style: TextStyle(color: Colors.white70)),
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
}
