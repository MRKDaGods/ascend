import 'package:flutter/material.dart';
import 'models/profile_section.dart';
import 'buttons.dart';
import 'withdraw_request.dart';
import 'profile_main_images.dart';
import 'Data/dummy_profile_sections.dart';
import 'section_builder.dart';
import 'profile_header.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({
    super.key,
    this.name = 'Maged Amgad',
    this.bio = "Computer engineering student at Cairo University",
    this.profileImageUrl = 'https://picsum.photos/500',
    this.coverImageUrl = 'https://picsum.photos/1500/500',
    this.location = 'Cairo, Cairo, Egypt',
    this.latestEducation = 'Cairo University',
    this.sections = const [],
    this.isconnect = false,
    this.isfollow = false,
    this.isPending = false,
    this.connections = 15,
    this.verified = true,
    this.degree = "1st",
  });

  final String name;
  final bool isconnect;
  final bool isfollow;
  final bool isPending;
  final int connections;
  final String latestEducation;
  final String bio;
  final String profileImageUrl;
  final String coverImageUrl;
  final String location;
  final List<ProfileSection> sections;
  final bool verified;
  final String degree;

  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  late bool _isConnect;
  late bool _isFollow;
  late bool _isPending;
  late String _degree;

  @override
  void initState() {
    super.initState();
    _isConnect = widget.isconnect;
    _degree = widget.degree;
    if (_isConnect) {
      _isPending = false;
      _degree = "1st";
    } else {
      _degree = "2nd";
    }
    _isFollow = widget.isfollow;
    _isPending = widget.isPending;
  }

  void _toggleConnect() {
    setState(() {
      if (!_isConnect && !_isPending) {
        _isPending = true; // Change to "Pending"
      } else if (_isPending) {
        _isPending = false;
        _isConnect = true; // Change to "Connected"
      }
    });
  }

  void _toggleFollow() {
    setState(() {
      _isFollow = !_isFollow;
    });
  }

  void _toggleisPending() {
    setState(() {
      _isPending = !_isPending;
    });
  }

  // Function to show withdraw confirmation dialog
  void _showWithdrawDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return WithdrawRequest(toggleIspending: _toggleisPending);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black87,
      appBar: AppBar(
        backgroundColor: Colors.grey[900],
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextField(
            style: TextStyle(color: Colors.black87),
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search, color: Colors.black87),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: Colors.black87),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            ProfileMainImages(
              profilePic: widget.profileImageUrl,
              coverPic: widget.coverImageUrl,
            ),
            SizedBox(height: 50),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ProfileHeader(
                    name: widget.name,
                    verified: widget.verified,
                    degree: _degree,
                    bio: widget.bio,
                    location: widget.location,
                    latestEducation: widget.latestEducation,
                    connections: widget.connections,
                    isconnect: _isConnect,
                    isPending: _isPending,
                  ),
                  SizedBox(height: 15),
                  ProfileButtons(
                    _isConnect,
                    _isPending,
                    _toggleConnect,
                    _showWithdrawDialog,
                  ),
                  SizedBox(height: 30),
                ],
              ),
            ),
            for (var section in widget.sections) buildSection(context, section),
          ],
        ),
      ),
    );
  }
}
