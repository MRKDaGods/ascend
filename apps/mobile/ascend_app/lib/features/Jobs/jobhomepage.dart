import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';

class JobHomePage extends StatefulWidget {
  final VoidCallback tosavedjobs;

  const JobHomePage({super.key, required this.tosavedjobs});

  @override
  State<JobHomePage> createState() => _JobHomePageState();
}

class _JobHomePageState extends State<JobHomePage> {
  final TextEditingController searchController = TextEditingController();

  // Function to filter jobs based on search query
  List<Jobsattributes> get filteredJobs {
    String query = searchController.text.toLowerCase();
    return jobs.where((job) {
      return job.title.toLowerCase().contains(query) ||
          job.location.toLowerCase().contains(query) ||
          job.company.toLowerCase().contains(query);
    }).toList();
  }

  void toggleBookmark(Jobsattributes job) {
    setState(() {
      job.isBookmarked = !job.isBookmarked;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Jobs & Hiring'),
        actions: [IconButton(icon: Icon(Icons.filter_list), onPressed: () {})],
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
                        return Card(
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
                                    errorBuilder: (context, error, stackTrace) {
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
