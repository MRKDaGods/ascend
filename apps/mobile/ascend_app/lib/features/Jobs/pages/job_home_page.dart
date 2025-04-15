import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/job_picks_section.dart';
import 'package:ascend_app/features/Jobs/pages/premium_section.dart';
import 'package:ascend_app/features/Jobs/pages/explore_section.dart';
import 'package:ascend_app/features/Jobs/pages/more_jobs_section.dart';
import 'package:ascend_app/features/Jobs/pages/saved_section.dart';

class JobHomePage extends StatefulWidget {
  final bool isDarkMode;
  const JobHomePage({super.key, required this.isDarkMode, required this.jobs});
  final List<Jobsattributes> jobs; // List of job attributes

  @override
  State<JobHomePage> createState() => _JobHomePageState();
}

class _JobHomePageState extends State<JobHomePage> {
  final TextEditingController searchController = TextEditingController();
  late List<Jobsattributes> jobsList; // Create a mutable copy of jobs
  void initState() {
    super.initState();
    jobsList = List.from(widget.jobs); // Initialize jobsList in initState
    _randomizeJobs(); // Randomize the order of the jobs during initialization
  }

  void removeJob(Jobsattributes job) {
    setState(() {
      jobsList.remove(job); // Remove the job from the list
    });
  }

  void _randomizeJobs() {
    setState(() {
      jobsList.shuffle(); // Randomly shuffle the jobs list
    });
  }

  @override
  Widget build(BuildContext context) {
    final savedJobs = widget.jobs.where((job) => job.isBookmarked).toList();
    return Scaffold(
      // backgroundColor:
      //     widget.isDarkMode
      //         ? const Color.fromARGB(255, 29, 34, 38)
      //         : Colors.white,
      body: RefreshIndicator(
        onRefresh: _refreshJobs,
        child: LayoutBuilder(
          builder: (context, constraints) {
            return ListView(
              physics: AlwaysScrollableScrollPhysics(), // Ensures scrollability

              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Filters Row
                    LayoutBuilder(
                      builder: (context, constraints) {
                        if (constraints.maxWidth < 300) {
                          // Vertical layout for small screens
                          return SingleChildScrollView(
                            scrollDirection:
                                Axis.horizontal, // Allow horizontal scrolling
                            child: Column(
                              children: [
                                _filterButton("Preferences"),
                                SizedBox(height: 5),
                                _filterButton("My jobs"),
                                SizedBox(height: 5),
                                _filterButton("Post a free job"),
                              ],
                            ),
                          );
                        } else {
                          // Horizontal layout for wider screens
                          return Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.centerLeft,
                                    child: _filterButton("Preferences"),
                                  ),
                                ),
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.center,
                                    child: _filterButton("My jobs"),
                                  ),
                                ),
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.centerRight,
                                    child: _filterButton("Post a free job"),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                      },
                    ),
                    Container(
                      height: 10,
                      // color:
                      //     widget.isDarkMode
                      //         ? Colors.black
                      //         : Colors.grey[300], // Gray if not dark mode
                    ),

                    JobPicksSection(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                      onRemove: removeJob,
                    ),
                    Container(
                      height: 10,
                      // color:
                      //     widget.isDarkMode
                      //         ? Colors.black
                      //         : Colors.grey[300], // Gray if not dark mode
                    ),

                    // Saved Section (only if there are saved jobs)
                    if (savedJobs.isNotEmpty) ...[
                      SavedPage(isDarkMode: widget.isDarkMode, jobs: jobsList),
                      Container(
                        height: 10,
                        // color:
                        //     widget.isDarkMode
                        //         ? Colors.black
                        //         : Colors.grey[300], // Gray if not dark mode
                      ),
                    ],
                    Container(height: 3, color: Colors.amber),
                    PremiumSection(isDarkMode: widget.isDarkMode),
                    Container(
                      height: 10,
                      // color:
                      //     widget.isDarkMode
                      //         ? Colors.black
                      //         : Colors.grey[300], // Gray if not dark mode
                    ),

                    ExploreScreen(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                    ),
                    Container(
                      height: 10,
                      // color:
                      //     widget.isDarkMode
                      //         ? Colors.black
                      //         : Colors.grey[300], // Gray if not dark mode
                    ),

                    MoreJobsSection(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                      onRemove: removeJob,
                    ),
                  ],
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _filterButton(String title) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        // backgroundColor:
        //     widget.isDarkMode
        //         ? const Color.fromARGB(255, 29, 34, 38)
        //         : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: BorderSide(
          // color: widget.isDarkMode ? Colors.grey : Colors.black, // Border color
          width: 0.5, // Border width
        ),
      ),

      child: Text(title, style: TextStyle(fontSize: 13)),
    );
  }

  // Function to handle refresh
  Future<void> _refreshJobs() async {
    // Simulate a network call or data refresh
    await Future.delayed(Duration(seconds: 1));
    print("Refreshed jobs");
    setState(() {
      // Update the jobs list or any other state
      jobsList = List.from(widget.jobs); // Reset the jobs list
      _randomizeJobs(); // Randomize the order of the jobs
    });
  }

  @override
  void dispose() {
    // Dispose of any resources, such as timers or streams
    searchController.dispose();
    super.dispose();
  }
}
