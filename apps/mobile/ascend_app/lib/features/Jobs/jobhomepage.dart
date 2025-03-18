import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/job_details.dart';

class JobHomePage extends StatefulWidget {
  final VoidCallback tosavedjobs;

  const JobHomePage({super.key, required this.tosavedjobs});

  @override
  State<JobHomePage> createState() => _JobHomePageState();
}

class _JobHomePageState extends State<JobHomePage> {
  final TextEditingController searchController = TextEditingController();
  String selectedExperienceLevel = "All";
  String selectedCompany = "All";
  int salaryRange = 100; // Default salary range filter

  // Function to filter jobs based on search query & filters
  List<Jobsattributes> get filteredJobs {
    String query = searchController.text.toLowerCase();
    return jobs.where((job) {
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
    return Scaffold(
      appBar: AppBar(
        title: Text('Jobs & Hiring'),
        actions: [
          IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: searchController,
              decoration: InputDecoration(
                hintText: 'Search by title, location, or company...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => setState(() {}), // Triggers list update
            ),
          ),
          Expanded(
            child:
                filteredJobs.isEmpty
                    ? Center(child: Text("No matching jobs found."))
                    : ListView.builder(
                      itemCount: filteredJobs.length,
                      itemBuilder: (context, index) {
                        final job = filteredJobs[index];
                        return GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (context) => JobDetailsPage(
                                      job: job,
                                      onBookmarkToggle: () {
                                        toggleBookmark(job);
                                        Navigator.pop(
                                          context,
                                        ); // Go back after saving
                                      },
                                    ),
                              ),
                            );
                          },
                          child: Card(
                            margin: EdgeInsets.symmetric(
                              vertical: 8.0,
                              horizontal: 16.0,
                            ),
                            child: Padding(
                              padding: EdgeInsets.all(15.0),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8.0),
                                    child: Image.asset(
                                      job.companyPhoto ??
                                          'assets/logo.png', // Use default logo if null
                                      width: 50,
                                      height: 50,
                                      fit: BoxFit.cover,
                                      errorBuilder: (
                                        context,
                                        error,
                                        stackTrace,
                                      ) {
                                        return Icon(
                                          Icons.image_not_supported,
                                          size: 50,
                                          color: Colors.grey,
                                        );
                                      },
                                    ),
                                  ),
                                  SizedBox(width: 12.0),

                                  // Job Details
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          job.title,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16.0,
                                          ),
                                        ),
                                        SizedBox(height: 4.0),
                                        Text(
                                          'Company: ${job.company}',
                                          style: TextStyle(
                                            color: Colors.grey[700],
                                          ),
                                        ),
                                        Text(
                                          'Location: ${job.location}',
                                          style: TextStyle(
                                            color: Colors.grey[700],
                                          ),
                                        ),
                                        Text(
                                          'Experience Level: ${job.experienceLevel}',
                                          style: TextStyle(
                                            color: Colors.grey[700],
                                          ),
                                        ),
                                        Text(
                                          'Salary: \$${job.salaryRange}',
                                          style: TextStyle(
                                            color: Colors.green[700],
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    icon: Icon(
                                      job.isBookmarked
                                          ? Icons.bookmark_added
                                          : Icons.bookmark_border,
                                    ),
                                    onPressed: () => toggleBookmark(job),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.bookmark),
        onPressed: widget.tosavedjobs,
      ),
    );
  }
}
