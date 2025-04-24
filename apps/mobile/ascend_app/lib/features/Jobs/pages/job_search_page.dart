import 'package:flutter/material.dart';

class JobSearchPage extends StatelessWidget {
  final VoidCallback toalljobs;

  const JobSearchPage({super.key, required this.toalljobs});

  @override
  Widget build(BuildContext context) {
    final double searchBoxHeight =
        MediaQuery.of(context).size.height * 0.06; // 6% of screen height

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        title: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: toalljobs, // Trigger the callback to navigate back
            ),
            Expanded(
              child: SizedBox(
                height: searchBoxHeight,
                child: TextField(
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
            const SizedBox(height: 10),
            SizedBox(
              height: searchBoxHeight,

              child: TextField(
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
            const SizedBox(height: 20),
            const Text('Try searching for', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 10),
            _buildSearchSuggestion('remote'),
            _buildSearchSuggestion('marketing manager'),
            _buildSearchSuggestion('hr'),
            _buildSearchSuggestion('legal'),
            _buildSearchSuggestion('sales'),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchSuggestion(String text) {
    return ListTile(
      leading: const Icon(Icons.search),
      title: Text(
        text,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
      trailing: const Icon(Icons.arrow_forward),
      onTap: () {
        // Handle search suggestion tap
        print('Search suggestion tapped: $text');
      },
    );
  }
}
