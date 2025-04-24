import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/Search_jobs.dart';
import 'package:ascend_app/features/Jobs/models/jobsattributes.dart';

class JobSearchPage extends StatefulWidget {
  final bool isfromhome;
  final VoidCallback? onBackPressed; // Added callback for back button
  final List<Jobsattributes> jobs; // List of all jobs
  const JobSearchPage(
    this.isfromhome, {
    super.key,
    this.onBackPressed, // Initialize the callback
    required this.jobs, // Initialize with an empty list
  }); //is from home to check if the one calling the search bar is the home page or not

  @override
  _JobSearchPageState createState() => _JobSearchPageState();
}

class _JobSearchPageState extends State<JobSearchPage> {
  late List<String> companyNames;

  @override
  void initState() {
    super.initState();
    // Initialize the list of jobs here if needed
    companyNames = widget.jobs.map((job) => job.company).toSet().toList();
  }

  void navigateToSearchJobs(context) {
    // Get unique company names
    // Navigate to the SearchJobsPage with the search and location text
    Navigator.push(
      context,
      MaterialPageRoute(
        builder:
            (context) => SearchJobsPage(
              jobs: widget.jobs,
              companyNames: companyNames,
              searchtext: searchController.text,
              locationtext: locationController.text,
            ),
      ),
    );
  }

  bool firstlocation =
      true; // Flag to check if it's the first time the location is set
  bool locationsearch = false;
  // Flag to check if location search is active
  final TextEditingController searchController = TextEditingController();
  final TextEditingController locationController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final double searchBoxHeight =
        MediaQuery.of(context).size.height * 0.06; // 6% of screen height
    if (firstlocation) {
      firstlocation = false;
      locationController.text = 'Egypt';
    } // Set default location to Egypt

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Row(
          children: [
            if (widget.isfromhome) ...[
              GestureDetector(
                onTap:
                    widget.onBackPressed, // Trigger the callback when pressed
                child: const Icon(Icons.arrow_back),
              ),
              const SizedBox(width: 30),
            ],
            Expanded(
              child: SizedBox(
                height: searchBoxHeight,
                child: TextField(
                  onTap:
                      () => setState(() {
                        locationsearch = false;
                      }),
                  controller: searchController,
                  onSubmitted: (value) {
                    searchController.text = value;
                    navigateToSearchJobs(context);
                  },

                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: 'Search by title, skill, or company',

                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                  ),
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
                  controller: locationController,
                  onSubmitted: (value) {
                    locationController.text = value;
                    navigateToSearchJobs(context);
                  },
                  onTap: () {
                    setState(() {
                      locationsearch = true;
                    });
                  },
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
            const Text('Try searching for', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 10),
            if (locationsearch) ...[
              _buildSearchSuggestion(
                'Cairo, Cairo, Egypt',
                locationController,
                context,
              ),
              _buildSearchSuggestion(
                'Cairo, Egypt',
                locationController,
                context,
              ),
              _buildSearchSuggestion('Remote', locationController, context),
            ] else ...[
              _buildSearchSuggestion('remote', searchController, context),
              _buildSearchSuggestion(
                'marketing manager',
                searchController,
                context,
              ),
              _buildSearchSuggestion('hr', searchController, context),
              _buildSearchSuggestion('legal', searchController, context),
              _buildSearchSuggestion('sales', searchController, context),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSearchSuggestion(
    String text,
    TextEditingController controller,
    BuildContext context,
  ) {
    return ListTile(
      leading: const Icon(Icons.search),
      title: Text(
        text,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
      trailing: const Icon(Icons.arrow_forward),
      onTap: () {
        controller.text = text;
        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => SearchJobsPage(
                  jobs: widget.jobs,
                  companyNames: companyNames,
                  searchtext: searchController.text,
                  locationtext: locationController.text,
                ),
          ),
        );
      },
    );
  }
}
