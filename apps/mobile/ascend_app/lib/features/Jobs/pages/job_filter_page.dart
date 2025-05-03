import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class JobFilterScreen extends StatefulWidget {
  const JobFilterScreen({
    super.key,
    required this.chosenCategory,
    required this.jobs,
  });
  final List<Jobsattributes> jobs; // List of job attributes
  final String chosenCategory; // Category selected by the user

  @override

  // ignore: library_private_types_in_public_api
  _JobFilterScreenState createState() => _JobFilterScreenState();
}

class _JobFilterScreenState extends State<JobFilterScreen> {

  final List<String> jobCategories = [
    "Easy Apply",
    "Part-time",
    "Remote",
    "Hybrid",
    "Internship",
    "Volunteer",
    "Contract",
  ];

  late int _initialTabIndex;
  List<Jobsattributes> allJobs = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _initialTabIndex =
        jobCategories.contains(widget.chosenCategory)
            ? jobCategories.indexOf(widget.chosenCategory)
            : 0;
    fetchAllJobs();
  }

  Future<void> fetchAllJobs() async {
    setState(() {
      isLoading = true;
    });

    final url = Uri.parse(
      'https://api.ascendx.tech/job?keyword=&location&industry&experience_level=&company=&salary_min_range=0&salary_max_range=200000&page=1',
    );
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      if (jsonResponse.containsKey('data')) {
        final List<dynamic> jobData = jsonResponse['data'];
        setState(() {
          allJobs =
              jobData.map((data) => Jobsattributes.fromJson(data)).toList();
        });
      }
    }

    setState(() {
      isLoading = false;
    });
  }

  Map<String, List<Jobsattributes>> getJobsByCategory() {
    return {
      "Easy Apply": allJobs.where((job) => job.easyapply).toList(),
      "Part-time": allJobs.where((job) => job.isPartTime == true).toList(),
      "Remote": allJobs.where((job) => job.isRemote == true).toList(),
      "Hybrid": allJobs.where((job) => job.isHybrid == true).toList(),
      "Internship": allJobs.where((job) => job.internship == true).toList(),
      "Volunteer": allJobs.where((job) => job.volunteer == true).toList(),
      "Contract": allJobs.where((job) => job.contract == true).toList(),
    };
  }

  @override
  Widget build(BuildContext context) {
    final jobsByCategory = getJobsByCategory();

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: TextEditingController(),
          onChanged: (String value) {},
          decoration: InputDecoration(
            hintText: "Start a job search",
            border: InputBorder.none,
            prefixIcon: Icon(Icons.search),
          ),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => JobSearchPage(false, jobs: widget.jobs),
              ),
            );
          },
        ),
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Expanded(
                    child: DefaultTabController(
                      length: jobCategories.length,
                      initialIndex: _initialTabIndex,
                      child: Column(
                        children: [
                          Container(
                            alignment: Alignment.centerLeft,
                            child: TabBar(
                              isScrollable: true,
                              padding: EdgeInsets.zero,
                              indicatorPadding: EdgeInsets.zero,
                              labelPadding: EdgeInsets.symmetric(
                                horizontal: 16.0,
                              ),
                              tabs:
                                  jobCategories
                                      .map(
                                        (category) => Tab(
                                          iconMargin: EdgeInsets.only(
                                            bottom: 8.0,
                                          ),
                                          icon: Icon(
                                            category == "Easy Apply"
                                                ? Icons.check_circle
                                                : category == "Part-time"
                                                ? Icons.access_time
                                                : category == "Remote"
                                                ? Icons.home
                                                : category == "Hybrid"
                                                ? Icons.home_work
                                                : category == "Internship"
                                                ? Icons.work_outline
                                                : category == "Volunteer"
                                                ? Icons.volunteer_activism
                                                : category == "Contract"
                                                ? Icons.assignment
                                                : Icons.storefront,
                                          ),
                                          text: category,
                                        ),
                                      )
                                      .toList(),
                            ),
                          ),
                          Expanded(
                            child: TabBarView(
                              children:
                                  jobCategories.map((category) {
                                    final jobs = jobsByCategory[category] ?? [];
                                    if (jobs.isEmpty) {
                                      return Center(
                                        child: Text(
                                          "No jobs available for this filter.",
                                          style: TextStyle(
                                            // color:
                                            //     Theme.of(context).brightness ==
                                            //             Brightness.dark
                                            //         ? Colors.white
                                            //         : Colors.black,
                                          ),
                                        ),
                                      );
                                    }
                                    return ListView.builder(
                                      itemCount: jobs.length,
                                      itemBuilder: (context, index) {
                                        return jobCard(
                                          context: context,
                                          job: jobs[index],
                                          isDarkMode:
                                              Theme.of(context).brightness ==
                                              Brightness.dark,
                                          onRemove: (job) {
                                            setState(() {
                                              jobsByCategory[category]?.remove(
                                                job,
                                              );
                                            });
                                          },
                                          onTap: () {
                                            // Handle job card tap
                                          },
                                        );
                                      },
                                    );
                                  }).toList(),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
    );
  }
}
