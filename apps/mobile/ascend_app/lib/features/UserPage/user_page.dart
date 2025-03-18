import 'package:flutter/material.dart';
import 'models/profile_section.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'full_screen_image.dart';

class UserProfilePage extends StatelessWidget {
  UserProfilePage({
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
    this.connections = 15,
  });

  final String name;
  final bool isconnect;
  final bool isfollow;
  final int connections;
  final String latestEducation;
  final String bio;
  final String profileImageUrl;
  final String coverImageUrl;
  final String location;
  List<ProfileSection> sections;
  void _showFullScreenImage(BuildContext context, String imageUrl) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FullScreenImage(imageUrl: imageUrl),
      ),
    );
  }

  //final void Function(int) changescreen;
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
        //search bar
        title: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextField(
            style: TextStyle(color: const Color.fromARGB(255, 19, 19, 19)),
            decoration: InputDecoration(
              prefixIcon: Icon(
                Icons.search,
                color: const Color.fromARGB(137, 0, 0, 0),
              ),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: const Color.fromARGB(137, 3, 3, 3)),
              suffixStyle: TextStyle(color: Colors.white54),
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
                  onTap: () {
                    _showFullScreenImage(context, coverImageUrl);
                  },
                  child: Container(
                    height: 120,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(coverImageUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  left: 20,
                  bottom: -40,
                  child: GestureDetector(
                    onTap: () {
                      _showFullScreenImage(context, profileImageUrl);
                    },
                    child: CircleAvatar(
                      radius: 50,
                      backgroundColor: const Color.fromARGB(255, 0, 0, 0),
                      child: CircleAvatar(
                        radius: 50,
                        backgroundImage: NetworkImage(profileImageUrl),
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

                    name,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 5),

                  Text(bio, style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 5),
                  Text(
                    latestEducation,
                    style: TextStyle(color: Colors.white70),
                  ),
                  Text(location, style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 5),
                  if (connections > 0)
                    Text(
                      connections < 500
                          ? '$connections connections'
                          : '500+ connections',
                      style: TextStyle(color: Colors.white70),
                    ),

                  SizedBox(height: 15),
                  Row(
                    children:
                        isconnect
                            ? [
                              // Wide "Message" Button when connected
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {},
                                  style: OutlinedButton.styleFrom(
                                    side: BorderSide(color: Colors.white70),
                                    padding: EdgeInsets.symmetric(
                                      vertical: 15,
                                    ), // Make it taller
                                  ),
                                  child: Text(
                                    'Message',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                              ),
                            ]
                            : [
                              // "Connect" and "Message" buttons when NOT connected
                              ElevatedButton.icon(
                                label: Text('Connect'),
                                icon: Icon(Icons.add),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                ),
                                onPressed: () {},
                              ),
                              SizedBox(width: 10),
                              OutlinedButton(
                                onPressed: () {},
                                style: OutlinedButton.styleFrom(
                                  side: BorderSide(color: Colors.white70),
                                ),
                                child: Text(
                                  'Message',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ],
                  ),

                  SizedBox(height: 30),
                  // Divider(color: Colors.white38),
                  for (var section in sections) _buildSection(section),
                ],
              ),
            ),
          ],
        ),
      ),
    );
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
        // Divider(color: Colors.white38),
      ],
    );
  }

}
