import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/pages/job_picks_section.dart';
import 'package:ascend_app/features/Jobs/pages/premium_section.dart';
import 'package:ascend_app/features/Jobs/pages/explore_section.dart';
import 'package:ascend_app/features/Jobs/pages/more_jobs_section.dart';
import 'package:ascend_app/features/Jobs/pages/saved_section.dart';

class JobHomePage extends StatefulWidget {
  final VoidCallback tosavedjobs;
  final bool isDarkMode;
  const JobHomePage({
    super.key,
    required this.tosavedjobs,
    required this.isDarkMode,
  });

  @override
  State<JobHomePage> createState() => _JobHomePageState();
}

class _JobHomePageState extends State<JobHomePage> {
  final TextEditingController searchController = TextEditingController();
  String selectedExperienceLevel = "All";
  String selectedCompany = "All";
  int salaryRange = 100; // Default salary range filter

  List<Jobsattributes> jobsList = List.from(
    jobs,
  ); // Create a mutable copy of jobs

  // Function to filter jobs based on search query & filters
  List<Jobsattributes> get filteredJobs {
    String query = searchController.text.toLowerCase();
    return jobsList.where((job) {
      bool matchesQuery =
          job.title.toLowerCase().contains(query) ||
          job.location.toLowerCase().contains(query) ||
          job.company.toLowerCase().contains(query);

      bool matchesExperience =
          (selectedExperienceLevel == "All") ||
          (job.experienceLevel == selectedExperienceLevel);

      bool matchesCompany =
          (selectedCompany == "All") || (job.company == selectedCompany);

      bool matchesSalary = job.salaryRange >= salaryRange;

      return matchesQuery &&
          matchesExperience &&
          matchesCompany &&
          matchesSalary;
    }).toList();
  }

  void toggleBookmark(Jobsattributes job) {
    setState(() {
      job.isBookmarked = !job.isBookmarked;
    });
  }

  void removeJob(Jobsattributes job) {
    setState(() {
      jobsList.remove(job); // Remove the job from the list
    });
  }

  void updateJobs() {
    setState(() {});
  }

  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        String tempSelectedExperience = selectedExperienceLevel;
        String tempSelectedCompany = selectedCompany;
        int tempSalaryRange = salaryRange;

        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Experience Level Dropdown
                  DropdownButtonFormField<String>(
                    value: tempSelectedExperience,
                    onChanged: (value) {
                      setState(() {
                        tempSelectedExperience = value!;
                      });
                    },
                    items:
                        ["All", "Entry", "Mid", "Senior"]
                            .map(
                              (level) => DropdownMenuItem(
                                value: level,
                                child: Text(level),
                              ),
                            )
                            .toList(),
                    decoration: InputDecoration(labelText: "Experience Level"),
                  ),

                  SizedBox(height: 12),

                  // Company Dropdown
                  DropdownButtonFormField<String>(
                    value: tempSelectedCompany,
                    onChanged: (value) {
                      setState(() {
                        tempSelectedCompany = value!;
                      });
                    },
                    items:
                        ["All", ...jobs.map((job) => job.company).toSet()]
                            .map(
                              (company) => DropdownMenuItem(
                                value: company,
                                child: Text(company),
                              ),
                            )
                            .toList(),
                    decoration: InputDecoration(labelText: "Company"),
                  ),

                  SizedBox(height: 12),

                  // Salary Range Slider
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Salary Range: \$${tempSalaryRange.toString()}"),
                      Slider(
                        value: tempSalaryRange.toDouble(),
                        min: 0,
                        max: 5000,
                        divisions: 20,
                        label: tempSalaryRange.toString(),
                        onChanged: (value) {
                          setState(() {
                            tempSalaryRange = value.toInt();
                          });
                        },
                      ),
                    ],
                  ),

                  SizedBox(height: 16),

                  // Buttons Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Reset Filters Button
                      TextButton(
                        onPressed: () {
                          setState(() {
                            tempSelectedExperience = "All";
                            tempSelectedCompany = "All";
                            tempSalaryRange = 100;
                          });
                        },
                        child: Text(
                          "Reset Filters",
                          style: TextStyle(color: Colors.red),
                        ),
                      ),

                      // Apply Button
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);

                          setState(() {
                            selectedExperienceLevel = tempSelectedExperience;
                            selectedCompany = tempSelectedCompany;
                            salaryRange = tempSalaryRange;
                          });

                          updateJobs();
                        },
                        child: Text("Apply Filters"),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final savedJobs = jobs.where((job) => job.isBookmarked).toList();

    return Scaffold(
      backgroundColor:
          widget.isDarkMode
              ? const Color.fromARGB(255, 29, 34, 38)
              : Colors.white,
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
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
              color:
                  widget.isDarkMode
                      ? Colors.black
                      : Colors.grey[300], // Gray if not dark mode
            ),

            JobPicksSection(
              isDarkMode: widget.isDarkMode,
              jobs: jobsList,
              onRemove: removeJob,
            ),
            Container(
              height: 10,
              color:
                  widget.isDarkMode
                      ? Colors.black
                      : Colors.grey[300], // Gray if not dark mode
            ),

            // Saved Section (only if there are saved jobs)
            if (savedJobs.isNotEmpty) ...[
              SavedPage(isDarkMode: widget.isDarkMode),
              Container(
                height: 10,
                color:
                    widget.isDarkMode
                        ? Colors.black
                        : Colors.grey[300], // Gray if not dark mode
              ),
            ],
            Container(height: 3, color: Colors.amber),
            PremiumSection(isDarkMode: widget.isDarkMode),
            Container(
              height: 10,
              color:
                  widget.isDarkMode
                      ? Colors.black
                      : Colors.grey[300], // Gray if not dark mode
            ),

            // ExploreScreen(isDarkMode: widget.isDarkMode),
            Container(
              height: 10,
              color:
                  widget.isDarkMode
                      ? Colors.black
                      : Colors.grey[300], // Gray if not dark mode
            ),

            MoreJobsSection(
              isDarkMode: widget.isDarkMode,
              jobs: jobsList,
              onRemove: removeJob,
            ),
          ],
        ),
      ),
    );
  }

  Widget _filterButton(String title) {
    return ElevatedButton(
      onPressed: () {},
      style: ElevatedButton.styleFrom(
        backgroundColor:
            widget.isDarkMode
                ? const Color.fromARGB(255, 29, 34, 38)
                : Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: BorderSide(
          color: widget.isDarkMode ? Colors.grey : Colors.black, // Border color
          width: 0.5, // Border width
        ),
      ),

      child: Text(title, style: TextStyle(color: Colors.grey, fontSize: 13)),
    );
  }
}
