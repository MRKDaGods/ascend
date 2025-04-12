import 'package:flutter/material.dart';
import 'models/profile_section.dart';
import 'buttons.dart';
import 'custom_alert_dialog.dart';
import 'profile_main_images.dart';
import 'section_builder.dart';
import 'profile_header.dart';

enum ProfileType { myprofile, otherUserProfile }

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({
    this.profileType = ProfileType.myprofile,
    super.key,
    this.name = 'Maged Amgad',
    this.bio = "Computer engineering student at Cairo University",
    this.profileImageUrl = 'https://picsum.photos/500',
    this.coverImageUrl = 'https://picsum.photos/1500/500',
    this.location = 'Cairo, Cairo, Egypt',
    this.latestEducation = 'Cairo University',
    this.sections = const [],
    this.isconnect = true,
    this.isfollow = false,
    this.isPending = false,
    this.connections = 15,
    this.verified = true,
    this.degree = "1st",
    this.mutualConnections = const ["Ahmed Hassan", "Sarah Ali"],
    this.links = const [
      {"title": "My Portfolio", "url": "https://dartcode.org/docs/settings/"},
      {"title": "GitHub", "url": "https://github.com/MagedWadi"},
      {"title": " ", "url": "https://example.com"}, // This will be ignored
    ],
    this.badges = const ["Open to Work", "Providing Services"],
  });
  final ProfileType profileType;
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
  final List<String> mutualConnections;
  final List<Map<String, String>> links;
  final List<String> badges;

  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  late bool _isConnect;
  late bool _isFollow;
  late bool _isPending;
  late String _degree;
  late List<ProfileSection> _sections;
  @override
  void initState() {
    super.initState();
    _isConnect = widget.isconnect;
    _sections = List.from(widget.sections);
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

  void _updateSection(ProfileSection updatedSection) {
    setState(() {
      // Find the index of the section to update
      final int index = _sections.indexWhere(
        (section) => section.title == updatedSection.title,
      );
      if (index != -1) {
        _sections[index] = updatedSection; // Update the section
      }
    });
  }

  void _toggleConnect() {
    setState(() {
      if (!_isConnect && !_isPending) {
        _isPending = true; // Change to "Pending"
      } else if (_isPending) {
        _isPending = false;
        _isConnect = true; // Change to "Connected" //inv accepted
      }
      if (_isConnect) {
        _isConnect = false; // remove connection
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
  void _showWarningDialogForRemovingConnection(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Remove connection",
          description:
              "Are you sure you want to remove ${widget.name} from your connections?",
          confirmText: "Remove",
          onConfirm: _toggleConnect,
        );
      },
    );
  }

  void _showWarningDialogForPending(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Withdraw invitation",
          description:
              "If you withdraw now, you won’t be able to resend to this person for up to 3 weeks.",
          confirmText: "Withdraw",
          onConfirm: _toggleisPending,
        );
      },
    );
  }

  // Function to handle refresh
  Future<void> _onRefresh() async {
    // Simulate a network call or data refresh
    await Future.delayed(Duration(seconds: 2));
    // Update the state or data as needed
    setState(() {
      // Example: Refresh the sections or any other data
      _sections = List.from(widget.sections);
    });
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
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: SingleChildScrollView(
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
                      mutualConnections: widget.mutualConnections,
                      links: widget.links,
                      isMyProfile:
                          widget.profileType == ProfileType.myprofile
                              ? true
                              : false,
                    ),
                    SizedBox(height: 15),
                    ProfileButtons(
                      isfollowing: _isFollow,
                      isMyProfile:
                          widget.profileType == ProfileType.myprofile
                              ? true
                              : false,
                      isConnect: _isConnect,
                      isPending: _isPending,
                      toggleConnect: _toggleConnect,
                      withdrawRequest: _showWarningDialogForPending,
                      toggleFollow: _toggleFollow,
                      removeConnection: _showWarningDialogForRemovingConnection,
                    ),
                    SizedBox(height: 30),
                  ],
                ),
              ),
              for (var section in _sections)
                SectionBuilder(
                  section: section,
                  isMyProfile:
                      widget.profileType == ProfileType.myprofile
                          ? true
                          : false,
                  onUpdateSection: _updateSection,
                ),
            ],
          ),
        ),
      ),
    );
  }
}
