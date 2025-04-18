import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';
import 'package:ascend_app/features/Jobs/pages/filter_option_widget.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/data/dummy_company_names.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchJobsPage extends StatefulWidget {
  const SearchJobsPage({
    super.key,
    required this.searchtext,
    required this.locationtext,
    required this.jobs,
  });
  final List<Jobsattributes> jobs; // List of all jobs
  final String searchtext;
  final String locationtext;

  @override
  _SearchJobsPageState createState() => _SearchJobsPageState();
}

class _SearchJobsPageState extends State<SearchJobsPage> {
  final List<String> companyNames = companySearchNames; // List of company names

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
    locationController.text = widget.locationtext;
    searchController.text = widget.searchtext;
    jobs = [];
    filteredJobs = []; // Initialize filtered jobs as empty

    fetchData(); // Fetch job data from the API on initialization
    initialFilteredJobs = filteredJobs; // Store initial filtered jobs
  }

  List<Widget> generateFilterWidgets() {
    final filterOptions = [
      {
        'filterName': 'Experience Level',
        'options': ["Internship", "Entry", "Mid", "Associate", "Director"],
        'allowMultipleSelection': true,
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
            if (showeasyapply && !job.easyapply) {
              return false;
            }

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

            // Job must match all criteria
            return true;
          }).toList();
    });
  }

  void fetchData({int pageNumber = 1, String experienceLevel = ""}) async {
    String keyword = "";
    String industry = "";
    String company = "";

    // Predefined lists of industries and company names
    List<String> industries = [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Retail",
    ];
    List<String> companies = companyNames;

    // Convert searchInput and lists to lowercase for case-insensitive comparison
    String searchInput = searchController.text.trim().toLowerCase();
    if (industries.map((e) => e.toLowerCase()).contains(searchInput)) {
      industry = searchInput;
    } else if (companies.map((e) => e.toLowerCase()).contains(searchInput)) {
      company = searchInput;
    } else {
      keyword = searchInput;
    }

    final location =
        locationController.text.isNotEmpty ? locationController.text : '';

    final url = Uri.parse(
      'https://fictional-space-orbit-qwwjrw4qg6pcxqx6-8080.app.github.dev/job/search?keyword=$keyword&location=$location&industry=$industry&experience_level=$experienceLevel&company_name=$company&salary_range_min=&salary_range_max=&pageNumber=$pageNumber',
    );

    print('Fetching data from: $url');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      print('Response body: ${response.body}');

      if (response.body.isNotEmpty) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        if (jsonResponse.containsKey('data')) {
          final List<dynamic> jobData = jsonResponse['data'];
          print('Job data received: $jobData'); // Log the received job data

          if (jobData.isNotEmpty) {
            setState(() {
              filteredJobs =
                  jobData
                      .map((data) {
                        try {
                          return Jobsattributes.fromJson(data);
                        } catch (e) {
                          print('Error parsing job data: $e');
                          return null;
                        }
                      })
                      .where((job) => job != null)
                      .cast<Jobsattributes>()
                      .toList();
            });
          } else {
            setState(() {
              filteredJobs = [];
            });
          }
        } else {
          setState(() {
            filteredJobs = [];
          });
        }
      } else {
        setState(() {
          filteredJobs = [];
        });
      }
    } else {
      print('Request failed with status: ${response.statusCode}');
    }
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

      // If the filter is for experience level, call fetchData with the selected experience level
      if (selectedFilters.isNotEmpty) {
        fetchData(experienceLevel: selectedFilters.join(","));
      }
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
