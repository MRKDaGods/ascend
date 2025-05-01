import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_details.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/pages/jobcard.dart';
import 'package:ascend_app/features/Jobs/pages/job_filter_page.dart';

class ExploreScreen extends StatefulWidget {
  final bool isDarkMode;
  final List<Jobsattributes> jobs;

  ExploreScreen({super.key, required this.isDarkMode, required this.jobs});

  @override
  _ExploreScreenState createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  String selectedTab = "Easy Apply"; // Default to Easy Apply
  void _returbtofilter(String tab) {
    setState(() {
      selectedTab = tab;
    });
  }

  @override
  Widget build(BuildContext context) {
    List<Jobsattributes> filteredJobs =
        widget.jobs.where((job) {
          if (selectedTab == "Easy Apply") {
            return job.easyapply;
          } else if (selectedTab == "Part Time") {
            return job.isPartTime ?? false;
          } else if (selectedTab == "Remote") {
            return job.isRemote ?? false;
          }
          return false;
        }).toList();

    return SingleChildScrollView(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 16, top: 5),
            child: Row(
              children: [
                Text(
                  "Explore with job collections",
                  style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                    //color: widget.isDarkMode ? Colors.white : Colors.black,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _tabItem(Icons.check_circle, "Easy Apply"),
              _tabItem(Icons.access_time, "Part Time"),
              _tabItem(Icons.home, "Remote"),
              _tabItem(Icons.more_horiz, "More"),
            ],
          ),
          const SizedBox(height: 20),

          if (selectedTab == "More") _buildMoreCategories(),

          if (selectedTab != "More" && filteredJobs.isEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                "No jobs found for the selected filter.",
                style: TextStyle(
                  //color: widget.isDarkMode ? Colors.white70 : Colors.black87,
                  fontSize: 16,
                ),
              ),
            )
          else if (selectedTab != "More") ...[
            ...filteredJobs
                .take(2)
                .map(
                  (job) => jobCard(
                    context: context,
                    job: job,
                    isDarkMode: widget.isDarkMode,
                    onRemove: (Jobsattributes job) {
                      setState(() {
                        widget.jobs.remove(job);
                      });
                    },
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => JobDetailsPage(job: job),
                        ),
                      );
                    },
                  ),
                ),
            if (filteredJobs.length > 2)
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) => JobFilterScreen(
                            chosenCategory: selectedTab,
                            jobs: widget.jobs,
                          ),
                    ),
                  );
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text("Show All", style: TextStyle(color: Colors.grey)),
                    Icon(Icons.arrow_forward, color: Colors.grey, size: 16),
                  ],
                ),
              ),
          ],
        ],
      ),
    );
  }

  Widget _tabItem(IconData icon, String label) {
    bool isSelected = selectedTab == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          selectedTab = label;
        });
      },
      child: Column(
        children: [
          Icon(icon, size: 24, color: Colors.blue),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              //color: widget.isDarkMode ? Colors.white : Colors.black,
            ),
          ),
          if (isSelected)
            Container(
              margin: const EdgeInsets.only(top: 4),
              height: 2,
              width: 24,
              color: Colors.black,
            ),
        ],
      ),
    );
  }

  Widget _buildMoreCategories() {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: GridView.count(
        shrinkWrap: true,
        crossAxisCount: 2,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 3,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _moreCategoryTile(Icons.home_work, "Hybrid"),
          _moreCategoryTile(Icons.storefront, "Small biz"),
          _moreCategoryTile(Icons.construction, "Construction"),
          _moreCategoryTile(Icons.school, "Education"),
        ],
      ),
    );
  }

  Widget _moreCategoryTile(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        setState(() {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) =>
                      JobFilterScreen(chosenCategory: label, jobs: widget.jobs),
            ),
          );
        });
        // You can add filter logic based on these categories here
      },
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            Icon(icon, size: 28, color: Colors.blue),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
