import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';
import 'package:ascend_app/features/Jobs/job_details.dart';

class Bookmarked extends StatefulWidget {
  final VoidCallback toalljobs;

  const Bookmarked({super.key, required this.toalljobs});

  @override
  State<Bookmarked> createState() => _BookmarkedState();
}

class _BookmarkedState extends State<Bookmarked> {
  final TextEditingController searchController = TextEditingController();

  List<Jobsattributes> get filteredBookmarkedJobs {
    String query = searchController.text.toLowerCase();
    return jobs.where((job) {
      return job.isBookmarked &&
          (job.title.toLowerCase().contains(query) ||
              job.location.toLowerCase().contains(query) ||
              job.company.toLowerCase().contains(query));
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
      appBar: AppBar(title: Text('Saved Jobs')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: searchController,
              decoration: InputDecoration(
                hintText: 'Search saved jobs by title, location, or company...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => setState(() {}), // Triggers filtering
            ),
          ),
          Expanded(
            child:
                filteredBookmarkedJobs.isEmpty
                    ? Center(child: Text("No matching saved jobs."))
                    : ListView.builder(
                      itemCount: filteredBookmarkedJobs.length,
                      itemBuilder: (context, index) {
                        final job = filteredBookmarkedJobs[index];
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
                                      Icons.bookmark_remove,
                                      color: Colors.red,
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
        child: Icon(Icons.bookmarks),
        onPressed: widget.toalljobs,
      ),
    );
  }
}
