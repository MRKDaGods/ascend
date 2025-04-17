import 'package:flutter/material.dart';

class CompanyTabs extends StatefulWidget {
  const CompanyTabs({super.key});

  @override
  _CompanyTabsState createState() => _CompanyTabsState();
}

class _CompanyTabsState extends State<CompanyTabs>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this); // 5 tabs
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // TabBar Section
        Container(
          alignment: Alignment.centerLeft, // Align TabBar to the left
          width: double.infinity,
          child: TabBar(
            padding: EdgeInsets.zero,
            controller: _tabController,
            isScrollable:
                true, // Allow tabs to scroll if they exceed screen width
            indicatorColor: Colors.green[800], // Underline color
            indicatorWeight: 2.0, // Thickness of the underline
            labelColor: Colors.green[800], // Active tab text color
            labelStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ), // Active tab text style
            unselectedLabelStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ), // Inactive tab text style
            tabs: [
              Tab(text: "Home"),
              Tab(text: "About"),
              Tab(text: "Posts"),
              Tab(text: "Jobs"),
              Tab(text: "People"),
            ],
          ),
        ),

        // TabBarView Section
        Flexible(
          fit: FlexFit.tight,
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildHomeTab(),
              _buildAboutTab(),
              _buildPostsTab(),
              _buildJobsTab(),
              _buildPeopleTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHomeTab() {
    return Center(child: Text("Home Section"));
  }

  Widget _buildAboutTab() {
    return Center(child: Text("About Section"));
  }

  Widget _buildPostsTab() {
    return Center(child: Text("Posts Section"));
  }

  Widget _buildJobsTab() {
    return Center(child: Text("Jobs Section"));
  }

  Widget _buildPeopleTab() {
    return Center(child: Text("People Section"));
  }
}
