import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/Search_jobs.dart';

class JobSearchPage extends StatefulWidget {
  const JobSearchPage({super.key});

  @override
  _JobSearchPageState createState() => _JobSearchPageState();
}

class _JobSearchPageState extends State<JobSearchPage> {
  bool firstlocation =
      true; // Flag to check if it's the first time the location is set
  bool locationsearch = false;
  // Flag to check if location search is active
  @override
  Widget build(BuildContext context) {
    final double searchBoxHeight =
        MediaQuery.of(context).size.height * 0.06; // 6% of screen height
    TextEditingController searchController = TextEditingController();
    TextEditingController locationController = TextEditingController();
    if (firstlocation) {
      firstlocation = false;
      locationController.text = 'Egypt';
    } // Set default location to Egypt

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
          MaterialPageRoute(builder: (context) => const SearchJobsPage()),
        );
      },
    );
  }
}
