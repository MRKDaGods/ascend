import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';
import 'package:ascend_app/features/Jobs/pages/filter_option_widget.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/data/dummy_company_names.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
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
  // ignore: library_private_types_in_public_api
  _SearchJobsPageState createState() => _SearchJobsPageState();
}

class _SearchJobsPageState extends State<SearchJobsPage> {
  final List<String> companyNames = companySearchNames; // List of company names

  bool showeasyapply = true; // Flag to show easy apply option
  List<Jobsattributes> jobs = []; // List of all jobs
  List<Jobsattributes> filteredJobs = []; // List of filtered jobs
  List<Widget> filterWidgets = []; // List of filter widgets
  List<Jobsattributes> initialFilteredJobs =
      []; // List of initial filtered jobs
  bool reset = false; // Flag to check if reset is needed
  bool isLoading = false; // Flag to show loading indicator
  final TextEditingController locationController = TextEditingController();
  final TextEditingController searchController = TextEditingController();
  Duration? selectedTimeFilter;
  // Initialize filter parameters
  String salaryMin = "";
  String salaryMax = "";
  List<String> experienceLevels = [];
  List<String> originalSelectedExperienceLevels = [];
  List<String> companies = [];
  List<String> originalSelectedCompanies = [];
  List<String> jobTypes = [];
  List<String> originalSelectedJobTypes = [];
  int originalMinSalary = 0;
  int originalMaxSalary = 200000;
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
      'filterName': 'Salary',
      'options': <String>[], // Explicitly define as List<String>
      'allowMultipleSelection': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    locationController.text = widget.locationtext;
    searchController.text = widget.searchtext;
    jobs = [];
    filteredJobs = []; // Initialize filtered jobs as empty

    fetchData(); // Fetch job data from the API on initialization
    // filteredJobs = filterDummyJobs(
    //   jobs: jobsDummy,
    //   keyword: searchController.text,
    //   location: locationController.text,
    // ); // Filter jobs based on dummy data
    initialFilteredJobs = filteredJobs; // Store initial filtered jobs
  }

  List<Widget> generateFilterWidgets() {
    return filterOptions
        .map(
          (filter) => FilterOptionWidget(
            allowMultipleSelection: filter['allowMultipleSelection'] as bool,
            filterName: filter['filterName'] as String,
            options: List<String>.from(
              filter['options'] as List,
            ), // Explicitly cast to List<String>
            onFilterChanged: updateFilters,
            isReset: reset,
          ),
        )
        .expand((widget) => [widget, const SizedBox(width: 10)])
        .toList();
  }

  Future<void> fetchData({
    int pageNumber = 1,
    String experienceLevels = "",
    String companies = "",
    String jobTypes = "",
    String salaryMin = "",
    String salaryMax = "",
  }) async {
    setState(() {
      isLoading = true; // Show loading indicator
    });

    // Preserve current filter selections
    experienceLevels =
        experienceLevels.isEmpty
            ? originalSelectedExperienceLevels.join(',')
            : experienceLevels.split(',').toSet().join(',');
    companies =
        companies.isEmpty
            ? originalSelectedCompanies.join(',')
            : companies.split(',').toSet().join(',');
    jobTypes =
        jobTypes.isEmpty
            ? originalSelectedJobTypes.join(',')
            : jobTypes.split(',').toSet().join(',');
    salaryMin = salaryMin.isEmpty ? this.salaryMin : salaryMin;
    salaryMax = salaryMax.isEmpty ? this.salaryMax : salaryMax;

    String keyword = "";
    String industry = "";

    // Predefined lists of industries
    List<String> industries = [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Retail",
    ];
    List<String> companyList = companyNames;

    // Convert searchInput and lists to lowercase for case-insensitive comparison
    String searchInput = searchController.text.trim().toLowerCase();
    if (industries.map((e) => e.toLowerCase()).contains(searchInput)) {
      industry = searchInput;
    } else if (companyList.map((e) => e.toLowerCase()).contains(searchInput)) {
      companies = searchInput;
      if (!companies.split(',').contains(searchInput)) {
        companies = companies.isEmpty ? searchInput : "$companies,$searchInput";
      }
    } else {
      keyword = searchInput;
    }

    // Ensure salaryMin and salaryMax are valid numeric values
    salaryMin =
        int.tryParse(salaryMin)?.toString() ?? originalMinSalary.toString();
    originalMinSalary = int.tryParse(salaryMin) ?? 0;
    salaryMax =
        int.tryParse(salaryMax)?.toString() ?? originalMaxSalary.toString();
    originalMaxSalary = int.tryParse(salaryMax) ?? 0;

    final location =
        locationController.text.isNotEmpty ? locationController.text : '';

    final url = Uri.parse(
      'https://api.ascendx.tech/job?keyword=$keyword&location=$location&industry=$industry&experience_level=$experienceLevels&company=$companies&salary_min_range=$salaryMin&salary_max_range=$salaryMax&page=1',
    );
    print("URL: $url");
    final response = await http.get(url);
    print("response: ${response.body}");
    if (response.statusCode == 200) {
      if (response.body.isNotEmpty) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        if (jsonResponse.containsKey('data')) {
          final List<dynamic> jobData = jsonResponse['data'];

          if (jobData.isNotEmpty) {
            setState(() {
              filteredJobs =
                  jobData.map((data) => Jobsattributes.fromJson(data)).toList();
              _updateIndustriesAndCompanies();
              filteredJobs.shuffle();
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
      filteredJobs = []; // Reset filtered jobs on error
    }

    setState(() {
      isLoading = false; // Hide loading indicator
    });
  }

  void _updateIndustriesAndCompanies() {
    final industries = filteredJobs.map((job) => job.industry).toSet();
    final companies = filteredJobs.map((job) => job.company).toSet();

    for (var industry in industries) {
      if (!industries.contains(industry)) {
        industries.add(industry);
      }
    }

    for (var company in companies) {
      if (!companySearchNames.contains(company)) {
        companySearchNames.add(company);
      }
    }
  }

  List<Jobsattributes> filterDummyJobs({
    required List<Jobsattributes> jobs,
    String keyword = "",
    String location = "",
    String industry = "",
    String experienceLevels = "",
    String companies = "",
    String jobTypes = "",
    String salaryMin = "",
    String salaryMax = "",
    bool showEasyApply = true,
  }) {
    // Deduplicate filter parameters
    experienceLevels = experienceLevels
        .split(',')
        .where((e) => e.isNotEmpty)
        .toSet()
        .join(',');
    companies = companies
        .split(',')
        .where((e) => e.isNotEmpty)
        .toSet()
        .join(',');
    jobTypes = jobTypes.split(',').where((e) => e.isNotEmpty).toSet().join(',');

    return jobs.where((job) {
      // Filter by keyword
      if (keyword.isNotEmpty &&
          !job.title.toLowerCase().contains(keyword.toLowerCase()) &&
          !(job.jobDescription?.toLowerCase().contains(keyword.toLowerCase()) ??
              false) &&
          !job.company.toLowerCase().contains(keyword.toLowerCase())) {
        return false;
      }

      // Filter by location
      if (location.isNotEmpty &&
          !job.location.toLowerCase().contains(location.toLowerCase())) {
        return false;
      }

      // Filter by experience levels (match any)
      if (experienceLevels.isNotEmpty &&
          !experienceLevels
              .split(',')
              .any((level) => job.experienceLevel == level)) {
        return false;
      }

      // Filter by companies (match any)
      if (companies.isNotEmpty &&
          !companies
              .split(',')
              .any(
                (company) => job.company.toLowerCase() == company.toLowerCase(),
              )) {
        return false;
      }

      // Filter by salary range
      if (salaryMin.isNotEmpty &&
          job.salaryMinRange < int.tryParse(salaryMin)!) {
        return false;
      }
      if (salaryMax.isNotEmpty &&
          job.salaryMaxRange > int.tryParse(salaryMax)!) {
        return false;
      }

      return true;
    }).toList();
  }

  void updateFilters(List<String> selectedFilters, String filterName) {
    setState(() {
      // Update filters based on the filter name
      if (filterName.toLowerCase() == 'experience level') {
        experienceLevels = selectedFilters;
        originalSelectedExperienceLevels = List.from(selectedFilters);
      } else if (filterName.toLowerCase() == 'company') {
        companies = selectedFilters;
        originalSelectedCompanies = List.from(selectedFilters);
      } else if (filterName.toLowerCase() == 'job type') {
        jobTypes = selectedFilters;
        originalSelectedJobTypes = List.from(selectedFilters);
      } else if (filterName.toLowerCase() == 'salary') {
        if (selectedFilters.isNotEmpty) {
          salaryMin = selectedFilters[0];
          salaryMax =
              selectedFilters.length > 1 ? selectedFilters[1] : salaryMax;
        }
      }

      // Ensure salaryMin and salaryMax are valid numeric values
      salaryMin =
          int.tryParse(salaryMin)?.toString() ?? originalMinSalary.toString();
      salaryMax =
          int.tryParse(salaryMax)?.toString() ?? originalMaxSalary.toString();

      // Call fetchData immediately after updating filters
      fetchData(
        experienceLevels: originalSelectedExperienceLevels.join(','),
        companies: originalSelectedCompanies.join(','),
        jobTypes: originalSelectedJobTypes.join(','),
        salaryMin: salaryMin,
        salaryMax: salaryMax,
      );
    });
  }

  void resetFilters() {
    setState(() {
      // Reset all filter parameters
      showeasyapply = false;
      salaryMin = "";
      salaryMax = "";
      experienceLevels = [];
      originalSelectedExperienceLevels = [];
      companies = [];
      originalSelectedCompanies = [];
      jobTypes = [];
      originalSelectedJobTypes = [];

      // Reset filtered jobs to the initial state
      filteredJobs = List.from(jobsDummy);

      // Reset the reset flag
      reset = true;
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
                        if (!selected) {
                          filteredJobs = [];
                        } else {
                          fetchData();
                        }
                      });
                    },
                    selectedColor: Colors.green,
                  ),
                  const SizedBox(width: 10),
                  ...generateFilterWidgets(),
                  const SizedBox(width: 10),
                ],
              ),
            ),
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else ...[
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
                child: RefreshIndicator(
                  onRefresh: () async {
                    fetchData();
                  },
                  child: ListView.builder(
                    itemCount: filteredJobs.length,
                    itemBuilder: (context, index) {
                      if (index >= filteredJobs.length) {
                        return const SizedBox(); // Prevent out-of-range access
                      }
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
              ),
            ],
          ],
        ),
      ),
    );
  }
}
