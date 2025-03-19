import 'package:flutter/material.dart';
import 'models/profile_section.dart';
import 'full_screen_image.dart';
import 'buttons.dart';
import 'withdraw_request.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({
    super.key,
    this.name = 'Hamada Helal',
    this.bio = "zzz",
    this.profileImageUrl = 'https://picsum.photos/150/150',
    this.coverImageUrl = 'https://picsum.photos/1500/500',
    this.location = 'Cairo, Cairo, Egypt',
    this.latestEducation = 'Cairo University',
    this.sections = const [],
    this.isconnect = false,
    this.isfollow = false,
    this.isPending = false,
    this.connections = 15,
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

  @override
  _UserProfilePageState createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  late bool _isConnect;
  late bool _isFollow;
  late bool _isPending;

  @override
  void initState() {
    super.initState();
    _isConnect = widget.isconnect;
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

  void _showFullScreenImage(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FullScreenImage(imageUrl: imageUrl),
      ),
    );
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
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
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
            style: TextStyle(color: const Color.fromARGB(255, 0, 0, 0)),
            decoration: InputDecoration(
              prefixIcon: Icon(
                Icons.search,
                color: const Color.fromARGB(179, 0, 0, 0),
              ),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: const Color.fromARGB(179, 0, 0, 0)),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomLeft,
              children: [
                GestureDetector(
                  onTap:
                      () => _showFullScreenImage(context, widget.coverImageUrl),
                  child: Container(
                    height: 120,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(widget.coverImageUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  left: 20,
                  bottom: -40,
                  child: GestureDetector(
                    onTap:
                        () => _showFullScreenImage(
                          context,
                          widget.profileImageUrl,
                        ),
                    child: CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.black,
                      child: CircleAvatar(
                        radius: 50,
                        backgroundImage: NetworkImage(widget.profileImageUrl),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 50),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.name,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(widget.bio, style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 5),
                  Text(
                    widget.latestEducation,
                    style: TextStyle(color: Colors.white70),
                  ),
                  Text(
                    widget.location,
                    style: TextStyle(color: Colors.white70),
                  ),
                  SizedBox(height: 5),
                  if (widget.connections > 0)
                    Text(
                      widget.connections < 500
                          ? '${widget.connections} connections'
                          : '500+ connections',
                      style: TextStyle(color: Colors.white70),
                    ),
                  SizedBox(height: 15),
                  ProfileButtons(
                    _isConnect,
                    _isPending,
                    _toggleConnect,
                    _showWithdrawDialog,
                  ),
                  SizedBox(height: 30),
                  for (var section in widget.sections) _buildSection(section),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

Widget _buildSection(ProfileSection section) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        section.title,
        style: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      for (var item in section.content) ...[
        SizedBox(height: 5),
        item,
        Divider(color: Colors.white38),
      ],
      SizedBox(height: 20),
    ],
  );
}
