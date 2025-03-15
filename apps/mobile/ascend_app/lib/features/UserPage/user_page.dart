import 'package:flutter/material.dart'; 
class UserProfilePage extends StatelessWidget {
  const UserProfilePage(this.changescreen, {super.key});
  final void Function(int) changescreen;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => changescreen(0),
        ),
        title: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextField(
            style: TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search, color: Colors.white54),
              border: InputBorder.none,
              hintText: 'Search',
              hintStyle: TextStyle(color: Colors.white54),
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
                    'Hamada Helal',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    'Student at Cairo University',
                    style: TextStyle(color: Colors.white70),
                  ),
                  SizedBox(height: 5),
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
                  ),
                  SizedBox(height: 30),
                  // Divider(color: Colors.white38),
                  _buildSection('Highlights', [
                    'You both studied at Cairo University from 2021 to 2026',
                  ]),
                  _buildSection('Activity', ['Hamada hasn’t posted yet']),
                  _buildEducation(),
                  _buildInterests(),
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
          title,
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        for (var item in content) ...[
          SizedBox(height: 5),
          Text(item, style: TextStyle(color: Colors.white70)),
          Divider(color: Colors.white38),
        ],
        SizedBox(height: 20),
        // Divider(color: Colors.white38),
      ],
    );
  }

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
}
