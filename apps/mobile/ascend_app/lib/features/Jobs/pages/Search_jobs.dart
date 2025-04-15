import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';
import 'package:ascend_app/features/Jobs/pages/filter_option_widget.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

class SearchJobsPage extends StatefulWidget {
  const SearchJobsPage({
    super.key,
    required this.searchtext,
    required this.locationtext,
    required this.companyNames,
    required this.jobs,
  });
  final List<Jobsattributes> jobs; // List of all jobs
  final List<String> companyNames; // List of company names
  final String searchtext;
  final String locationtext;

  @override
  _SearchJobsPageState createState() => _SearchJobsPageState();
}

class _SearchJobsPageState extends State<SearchJobsPage> {
  bool showeasyapply = false;
  List<Jobsattributes> jobs = []; // List of all jobs
  List<Jobsattributes> filteredJobs = []; // List of filtered jobs
  List<Widget> filterWidgets = []; // List of filter widgets
  List<Jobsattributes> initialFilteredJobs =
      []; // List of initial filtered jobs
  bool reset = false; // Flag to check if reset is needed
  final TextEditingController locationController = TextEditingController();
  final TextEditingController searchController = TextEditingController();
  Duration? selectedTimeFilter;

  @override
  void initState() {
    super.initState();
    jobs = widget.jobs;
    locationController.text = widget.locationtext;
    searchController.text = widget.searchtext;

    // Filter jobs based on initial search, location, and remote options
    initialFilteredJobs =
        jobs.where((job) {
          final matchesSearch =
              searchController.text.isEmpty ||
              job.title.toLowerCase().contains(
                searchController.text.toLowerCase(),
              ) ||
              (job.jobDescription?.toLowerCase().contains(
                    searchController.text.toLowerCase(),
                  ) ??
                  false) ||
              job.company.toLowerCase().contains(
                searchController.text.toLowerCase(),
              );

          final matchesLocation =
              locationController.text.isEmpty ||
              job.location.toLowerCase().contains(
                locationController.text.toLowerCase(),
              );

          if ((job.isRemote == true) &&
              (locationController.text.toLowerCase() == "remote" ||
                  searchController.text.toLowerCase() == "remote")) {
            return true;
          }
          return matchesSearch && matchesLocation;
        }).toList();
    filteredJobs = initialFilteredJobs; // Initialize filtered jobs
  }

  List<Widget> generateFilterWidgets() {
    final filterOptions = [
      {
        'filterName': 'Date Posted',
        'options': ["Anytime", "Past 24 hours", "Past Week", "Past Month"],
        'allowMultipleSelection': false,
      },
      {
        'filterName': 'Experience Level',
        'options': [
          "Internship",
          "Entry Level",
          "Mid Level",
          "Senior Level",
          "Director",
        ],
        'allowMultipleSelection': false,
      },
      {
        'filterName': 'Company',
        'options': [
          "Google",
          "Meta",
          "Amazon",
          "Microsoft",
          "Apple",
          "Netflix",
          "Tesla",
          "IBM",
          "Intel",
          "Nvidia",
        ],
        'allowMultipleSelection': true,
      },
      {
        'filterName': 'Job type',
        'options': ["Full Time", "Part Time", "Contract", "Internship"],
        'allowMultipleSelection': true,
      },
      {
        'filterName': 'Remote',
        'options': ["Remote", "Hybrid", "On-site"],
        'allowMultipleSelection': true,
      },
    ];

    return filterOptions
        .map(
          (filter) => FilterOptionWidget(
            companyNames: widget.companyNames,
            allowMultipleSelection: filter['allowMultipleSelection'] as bool,
            filterName: filter['filterName'] as String,
            options: filter['options'] as List<String>,
            onFilterChanged: updateFilters,
            isReset: reset,
          ),
        )
        .expand((widget) => [widget, const SizedBox(width: 10)])
        .toList();
  }

  void applyFilters() {
    setState(() {
      filteredJobs =
          jobs.where((job) {
            // Filter by easy apply
            if (showeasyapply && !job.easyapply) return false;

            // Filter by keyword from the search box
            if (searchController.text.isNotEmpty &&
                !job.title.toLowerCase().contains(
                  searchController.text.toLowerCase(),
                ) &&
                !(job.jobDescription?.toLowerCase().contains(
                      searchController.text.toLowerCase(),
                    ) ??
                    false) &&
                !job.company.toLowerCase().contains(
                  searchController.text.toLowerCase(),
                )) {
              return false;
            }
            if ((job.isRemote == true) &&
                (locationController.text.toLowerCase() == "remote" ||
                    searchController.text.toLowerCase() == "remote")) {
              return true;
            }
            // Filter by location from the location search box
            if (locationController.text.isNotEmpty &&
                !job.location.toLowerCase().contains(
                  locationController.text.toLowerCase(),
                )) {
              return false;
            }

            // Filter by time posted (Date Posted filter)
            if (selectedTimeFilter != null) {
              final now = DateTime.now();
              final timePosted = job.timePostedDate;
              if (timePosted == null ||
                  timePosted.isBefore(now.subtract(selectedTimeFilter!))) {
                return false;
              }
            }

            // Job must match all criteria
            return true;
          }).toList();
    });
  }

  void updateFilters(List<String> selectedFilters) {
    setState(() {
      // Use selectedFilters to filter jobs
      if (selectedFilters.isEmpty) {
        filteredJobs = initialFilteredJobs; // Reset to initial filtered jobs
      }
      filteredJobs =
          filteredJobs.where((filteredJobs) {
            // Example: Check if job matches any selected filter
            return selectedFilters.any(
              (filter) => filteredJobs.company.contains(filter),
            );
          }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final double searchBoxHeight =
        MediaQuery.of(context).size.height * 0.06; // 6% of screen height

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: searchBoxHeight,
                child: TextField(
                  controller: searchController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: 'Search by title, skill, or company',
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => JobSearchPage(
                              false,
                              onBackPressed: () {},
                              jobs: jobs,
                            ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 50.0),
              child: SizedBox(
                height: searchBoxHeight,
                child: TextField(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder:
                            (context) => JobSearchPage(
                              false,
                              onBackPressed: () {},
                              jobs: jobs,
                            ),
                      ),
                    );
                  },
                  controller: locationController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.location_on),
                    hintText: 'City, state, or zip code',
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('Easy Apply'),
                    selected: showeasyapply,
                    onSelected: (bool selected) {
                      setState(() {
                        showeasyapply = selected;
                        applyFilters();
                      });
                    },
                    selectedColor: Colors.green,
                  ),
                  const SizedBox(width: 10),
                  ...generateFilterWidgets(),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        showeasyapply = false;
                        reset = true; // Trigger reset for filter widgets

                        // Reapply filters to reset only the filter values
                        filteredJobs = initialFilteredJobs;

                        reset = false; // Reset the flag
                      });
                    },
                    child: const Text('Reset All'),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(
                vertical: 8.0,
                horizontal: 16.0,
              ),
              child: Text(
                '${filteredJobs.length} results',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView.builder(
                itemCount: filteredJobs.length,
                itemBuilder: (context, index) {
                  final job = filteredJobs[index];
                  return jobCard(
                    context: context,
                    job: job,
                    isDarkMode: false,
                    onRemove: (removedJob) {
                      setState(() {
                        jobs.remove(removedJob);
                      });
                    },
                    onTap: () {
                      // Handle job card tap
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
