import 'package:flutter/material.dart';
import 'Models/profile_section.dart';
import 'buttons.dart';
import 'custom_alert_dialog.dart';
import 'page_main_images.dart';
import 'section_builder.dart';
import 'page_header.dart';
import 'company_tabs.dart';

enum ProfileType { myprofile, otherUserProfile }

class CompanyPage extends StatefulWidget {
  const CompanyPage({
    this.profileType = ProfileType.otherUserProfile,
    super.key,
    this.name = 'Maged Amgad',
    this.bio = "Computer engineering student at Cairo University",
    this.profileImageUrl = 'https://picsum.photos/500',
    this.coverImageUrl = 'https://picsum.photos/1500/500',
    this.location = 'Cairo, Egypt',
    this.industry = 'Software',
    this.sections = const [],
    this.isconnect = false,
    this.isfollow = false,
    this.isPending = true,
    this.connections = 15,
    this.verified = true,
    this.degree = "1st",
    this.mutualConnections = const ["Ahmed Hassan", "Sarah Ali"],
    this.webSiteExists = true,
    this.links = const [
      {"title": "My Portfolio", "url": "https://dartcode.org/docs/settings/"},
      {"title": "GitHub", "url": "https://github.com/MagedWadi"},
      {"title": " ", "url": "https://example.com"}, // This will be ignored
    ],
    this.badges = const ["Open to Work", "Providing Services"],
  });
  final ProfileType profileType;
  final String name;
  final bool webSiteExists;
  final bool isconnect;
  final bool isfollow;
  final bool isPending;
  final int connections;
  final String industry;
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
  _CompanyPageState createState() => _CompanyPageState();
}

class _CompanyPageState extends State<CompanyPage> {
  late bool _isConnect;
  late bool _isFollow;
  late bool _isPending;
  late List<ProfileSection> _sections;

  @override
  void initState() {
    super.initState();
    _isConnect = widget.isconnect;
    _sections = List.from(widget.sections);
    if (_isConnect) {
      _isPending = false;
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
  void _showWarningDialogForUnfollowingPage(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Unfollow page",
          description: "You are about to unfollow ${widget.name}.",
          confirmText: "Unfollow",
          onConfirm: _toggleFollow,
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
      appBar: AppBar(
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: Container(
          height: 40,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
          child: TextField(
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search),
              border: InputBorder.none,
              hintText: 'Search',
            ),
          ),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ProfileMainImages(
                profilePic: widget.profileImageUrl,
                coverPic: widget.coverImageUrl,
                isMyProfile:
                    widget.profileType == ProfileType.myprofile ? true : false,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (widget.profileType == ProfileType.myprofile || _isFollow)
                    IconButton(
                      onPressed: () {},
                      icon: Icon(
                        widget.profileType == ProfileType.myprofile
                            ? Icons.edit_outlined
                            : _isFollow
                            ? Icons.notifications
                            : null,
                      ),
                    ),
                ],
              ),
              SizedBox(
                height:
                    (widget.profileType == ProfileType.myprofile || _isFollow)
                        ? 5
                        : 50,
              ),
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ProfileHeader(
                      name: widget.name,
                      verified: widget.verified,
                      bio: widget.bio,
                      location: widget.location,
                      industry: widget.industry,
                      followers: widget.connections,
                      employeesCount: widget.connections,
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
                      websiteExists: widget.webSiteExists,
                      isPending: _isPending,
                      toggleConnect: _toggleConnect,
                      withdrawRequest: _showWarningDialogForPending,
                      toggleFollow: _toggleFollow,
                      unFollowPage: _showWarningDialogForUnfollowingPage,
                    ),
                  ],
                ),
              ),
              SizedBox(
                height:
                    MediaQuery.of(context).size.height -
                    200, // Adjust height as needed
                child: CompanyTabs(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
