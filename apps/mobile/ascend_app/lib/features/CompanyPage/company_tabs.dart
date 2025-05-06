import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';

class CompanyTabs extends StatefulWidget {
  final String companyName; // Company name to fetch jobs for
  const CompanyTabs({super.key, required this.companyName});

  @override
  State<CompanyTabs> createState() => _CompanyTabsState();
}

class _CompanyTabsState extends State<CompanyTabs>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Jobsattributes> companyJobs = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    print(widget.companyName);
    _tabController = TabController(length: 5, vsync: this); // 5 tabs
    fetchCompanyJobs();
  }

  Future<void> fetchCompanyJobs() async {
    setState(() {
      isLoading = true;
    });
    print("Fetching jobs for company: ${widget.companyName}");
    final url = Uri.parse(
      'https://api.ascendx.tech/job?company=${widget.companyName}',
    );

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        if (jsonResponse.containsKey('data')) {
          final List<dynamic> jobData = jsonResponse['data'];
          setState(() {
            companyJobs =
                jobData.map((data) => Jobsattributes.fromJson(data)).toList();
          });
        }
      }
    } catch (e) {
      print('Error fetching company jobs: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
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
          alignment: Alignment.centerLeft, // Align TabBar to the
          padding: EdgeInsets.all(0),
          margin: EdgeInsets.all(0),
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
    if (isLoading) {
      return Center(child: CircularProgressIndicator());
    }

    if (companyJobs.isEmpty) {
      return Center(child: Text("No jobs available for this company."));
    }

    return ListView.builder(
      itemCount: companyJobs.length,
      itemBuilder: (context, index) {
        final job = companyJobs[index];
        return jobCard(
          context: context,
          job: job,
          isDarkMode: false,
          onRemove: (removedJob) {
            setState(() {
              companyJobs.remove(removedJob);
            });
          },
          onTap: () {
            // Handle job card tap
          },
        );
      },
    );
  }

  Widget _buildPeopleTab() {
    return Center(child: Text("People Section"));
  }
}
