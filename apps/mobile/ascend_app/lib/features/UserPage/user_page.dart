import 'package:flutter/material.dart';
<<<<<<< Updated upstream

class UserProfilePage extends StatelessWidget {
  const UserProfilePage(this.changescreen, {super.key});
  final void Function(int) changescreen;
=======
import 'models/profile_section.dart';
import 'package:ascend_app/features/home/presentation/pages/home.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'full_screen_image.dart';

<<<<<<< HEAD
class UserProfilePage extends StatelessWidget {
=======
>>>>>>> parent of 2a73c5c (zz)
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
>>>>>>> Stashed changes
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
<<<<<<< Updated upstream
          onPressed: () => changescreen(0),
=======

          onPressed: () {
            Navigator.pop(context);
          },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              prefixIcon: Icon(Icons.search, color: Colors.white54),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: Colors.white54),
=======
              prefixIcon: Icon(
                Icons.search,
                color: const Color.fromARGB(137, 0, 0, 0),
              ),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: const Color.fromARGB(137, 3, 3, 3)),
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                Container(height: 120, color: Colors.grey[800]),
                Positioned(
                  left: 20,
                  bottom: -40,
                  child: CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.black,
                    child: CircleAvatar(
                      radius: 38,
                      backgroundImage: NetworkImage(
                        'https://via.placeholder.com/150',
=======

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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    'Hamada Helal',
=======

                    name,
>>>>>>> Stashed changes
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 5),
<<<<<<< Updated upstream
                  Text(
                    'Student at Cairo University',
=======

                  Text(bio, style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 5),
                  Text(
                    latestEducation,
>>>>>>> Stashed changes
                    style: TextStyle(color: Colors.white70),
                  ),
                  Text(location, style: TextStyle(color: Colors.white70)),
                  SizedBox(height: 5),
<<<<<<< Updated upstream
                  Text(
                    'Cairo University\nCairo, Cairo, Egypt',
                    style: TextStyle(color: Colors.white70),
                  ),
                  SizedBox(height: 10),
                  Row(
                    children: [
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
=======
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
>>>>>>> Stashed changes
                  ),

                  SizedBox(height: 30),
                  // Divider(color: Colors.white38),
<<<<<<< Updated upstream
                  _buildSection('Highlights', [
                    'You both studied at Cairo University from 2021 to 2026',
                  ]),
                  _buildSection('Activity', ['Hamada hasn’t posted yet']),
                  _buildEducation(),
                  _buildInterests(),
=======
                  for (var section in sections) _buildSection(section),
>>>>>>> Stashed changes
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildnNavigationBar(),
    );
  }

  Widget _buildSection(String title, List<String> content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
<<<<<<< Updated upstream
          title,
=======

          section.title,
>>>>>>> Stashed changes
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
<<<<<<< Updated upstream
        for (var item in content) ...[
=======

        for (var item in section.content) ...[
>>>>>>> Stashed changes
          SizedBox(height: 5),
          Text(item, style: TextStyle(color: Colors.white70)),
          Divider(color: Colors.white38),
        ],
        SizedBox(height: 20),
        // Divider(color: Colors.white38),
      ],
    );
  }

<<<<<<< Updated upstream
  Widget _buildEducation() {
    return _buildSection('Education', [
      'Cairo University\nBachelor of Engineering - Computer Engineering\nOct 2021 - Jun 2026',
      'Pioneers Language School\nHigh School\nSep 2018 - Jun 2021',
    ]);
  }

  Widget _buildnNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.black,
      selectedItemColor: Colors.blue,
      unselectedItemColor: Colors.white60,
      items: [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.people), label: 'My Network'),
        BottomNavigationBarItem(icon: Icon(Icons.add), label: 'Post'),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications),
          label: 'Notifications',
        ),
        BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Jobs'),
      ],
    );
  }

  Widget _buildInterests() {
    return _buildSection('Interests', [
      'Cairo University',
      'Microsoft',
      'Flutter',
    ]);
  }
=======
>>>>>>> Stashed changes
}
