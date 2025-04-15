import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
//import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';

class JobFilterScreen extends StatefulWidget {
  JobFilterScreen({
    super.key,
    required this.chosenCategory,
    required this.jobs,
  });
  final List<Jobsattributes> jobs; // List of job attributes
  final String chosenCategory; // Category selected by the user

  @override
  _JobFilterScreenState createState() => _JobFilterScreenState();
}

class _JobFilterScreenState extends State<JobFilterScreen> {
  double _sliderValue = 0;
  final List<String> jobCategories = [
    "Easy Apply",
    "Part-time",
    "Remote",
    "Hybrid",
    "Construction",
    "Education",
    "Small biz",
  ];

  @override
  void initState() {
    super.initState();
    _initialTabIndex =
        jobCategories.contains(widget.chosenCategory)
            ? jobCategories.indexOf(widget.chosenCategory)
            : 0; // Default to the first category if not found
  }

  late int _initialTabIndex;

  Map<String, List<Jobsattributes>> getJobsByCategory() {
    return {
      "Easy Apply": widget.jobs.where((job) => job.easyapply).toList(),
      "Part-time": widget.jobs.where((job) => job.isPartTime == true).toList(),
      "Remote": widget.jobs.where((job) => job.isRemote == true).toList(),
      "Hybrid": widget.jobs.where((job) => job.isHybrid == true).toList(),
      "Construction":
          widget.jobs.where((job) => job.isConstruction == true).toList(),
      "Education": widget.jobs.where((job) => job.isEducation == true).toList(),
      "Small biz":
          widget.jobs.where((job) => job.isSmallBusiness == true).toList(),
      // Add other categories as needed...
    };
  }

  @override
  Widget build(BuildContext context) {
    final jobsByCategory = getJobsByCategory();
    final List<String> jobNames = jobsByCategory.keys.toList();

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
      body: Column(
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
                      labelPadding: EdgeInsets.symmetric(horizontal: 16.0),
                      tabs:
                          jobCategories
                              .map(
                                (category) => Tab(
                                  iconMargin: EdgeInsets.only(bottom: 8.0),
                                  icon: Icon(
                                    category == "Easy Apply"
                                        ? Icons.check_circle
                                        : category == "Part-time"
                                        ? Icons.access_time
                                        : category == "Remote"
                                        ? Icons.home
                                        : category == "Hybrid"
                                        ? Icons.home_work
                                        : category == "Construction"
                                        ? Icons.construction
                                        : category == "Education"
                                        ? Icons.school
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
                                      jobsByCategory[category]?.remove(job);
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
