import 'package:ascend_app/features/Jobs/pages/manage_owned_company.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/job_picks_section.dart';
import 'package:ascend_app/features/Jobs/pages/premium_section.dart';
import 'package:ascend_app/features/Jobs/pages/explore_section.dart';
import 'package:ascend_app/features/Jobs/pages/more_jobs_section.dart';
import 'package:ascend_app/features/Jobs/pages/saved_section.dart';
import 'package:ascend_app/features/Jobs/pages/my_jobs_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class JobHomePage extends StatefulWidget {
  final bool isDarkMode;
  const JobHomePage({super.key, required this.isDarkMode, required this.jobs});
  final List<Jobsattributes> jobs; // List of job attributes

  @override
  State<JobHomePage> createState() => _JobHomePageState();
}

class _JobHomePageState extends State<JobHomePage> {
  final TextEditingController searchController = TextEditingController();
  late List<Jobsattributes> jobsList;
  bool isLoading = true;
  int currentPage = 1;
  bool isLoadingMore = false;

  @override
  void initState() {
    super.initState();
    jobsList = []; // Initialize jobsList as an empty list
    fetchJobs();
  }

  Future<void> fetchJobs({int page = 1}) async {
    setState(() {
      if (page > 1) {
        isLoadingMore = true;
      } else {
        isLoading = true;
      }
    });

    try {
      final url = Uri.parse(
        'https://api.ascendx.tech/job?keyword=&location&industry=&experience_level=&company=&salary_min_range=0&salary_max_range=200000&page=$page',
      );
      print("Fetching jobs from: $url");
      final response = await http.get(url);
      print("Response: ${response.body}");
      print("Status Code: ${response.statusCode}");
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        if (jsonResponse.containsKey('data')) {
          final List<dynamic> jobData = jsonResponse['data'];
          setState(() {
            if (page > 1) {
              jobsList.addAll(
                jobData.map((data) => Jobsattributes.fromJson(data)).toList(),
              );
            } else {
              jobsList =
                  jobData.map((data) => Jobsattributes.fromJson(data)).toList();
            }
          });
        }
      } else {
        throw Exception('Failed to load jobs');
      }
    } catch (e) {
      print('Error fetching jobs: $e');
    } finally {
      setState(() {
        isLoading = false;
        isLoadingMore = false;
        currentPage = page;
      });
    }
  }

  Future<void> fetchMoreJobs({int page = 1}) async {
    setState(() {
      isLoadingMore = true;
    });

    final url = Uri.parse(
      'https://api.ascendx.tech/job?keyword=&location&industry=&experience_level=&company=&salary_min_range=0&salary_max_range=200000&page=$page',
    );
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      if (jsonResponse.containsKey('data')) {
        final List<dynamic> jobData = jsonResponse['data'];
        setState(() {
          jobsList.addAll(
            jobData.map((data) => Jobsattributes.fromJson(data)).toList(),
          );
        });
      }
    }

    setState(() {
      isLoadingMore = false;
      currentPage = page;
    });
  }

  void removeJob(Jobsattributes job) {
    setState(() {
      jobsList.remove(job);
    });
  }

  void _randomizeJobs() {
    setState(() {
      jobsList.shuffle();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                onRefresh: () => fetchJobs(page: 1),
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    LayoutBuilder(
                      builder: (context, constraints) {
                        if (constraints.maxWidth < 300) {
                          return SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Column(
                              children: [
                                _filterButton("My jobs"),
                                const SizedBox(height: 5),
                                _filterButton("Manage Company"),
                              ],
                            ),
                          );
                        } else {
                          return Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.center,
                                    child: _filterButton("My jobs"),
                                  ),
                                ),
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.center,
                                    child: _filterButton("Manage Company"),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }
                      },
                    ),
                    const SizedBox(height: 10),
                    JobPicksSection(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                      onRemove: removeJob,
                    ),
                    const SizedBox(height: 10),

                    SavedPage(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList.where((job) => job.isBookmarked).toList(),
                    ),
                    const SizedBox(height: 10),

                    PremiumSection(isDarkMode: widget.isDarkMode),
                    const SizedBox(height: 10),
                    ExploreScreen(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                    ),
                    const SizedBox(height: 10),
                    MoreJobsSection(
                      isDarkMode: widget.isDarkMode,
                      jobs: jobsList,
                      onRemove: removeJob,
                    ),
                    if (isLoadingMore)
                      const Center(child: CircularProgressIndicator())
                    else if (currentPage > 1 &&
                        jobsList.length < (currentPage * 20))
                      Center(
                        child: Text("No more jobs to load", style: TextStyle()),
                      )
                    else
                      TextButton(
                        onPressed: () => fetchMoreJobs(page: currentPage + 1),
                        child: const Text("Load More"),
                      ),
                  ],
                ),
              ),
    );
  }

  Widget _filterButton(String title) {
    return ElevatedButton(
      onPressed: () {
        if (title == "My jobs") {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => MyJobsPage()),
          );
        } else if (title == "Manage Company") {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) =>
                      Scaffold(body: Center(child: ManageOwnedCompany())),
            ),
          );
        }
      },
      style: ElevatedButton.styleFrom(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: const BorderSide(width: 0.5),
      ),
      child: Text(
        title,
        style: const TextStyle(fontSize: 13, color: Colors.grey),
      ),
    );
  }


  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }
}
