import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/more_categories_section.dart';

class ExploreScreen extends StatelessWidget {
  final List<String> categories = [
    'Technology',
    'Health',
    'Science',
    'Business',
    'Education',
    'Sports',
  ];
  final bool isDarkMode;
  ExploreScreen({super.key, required this.isDarkMode});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Explore"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder:
                      (context) => MoreCategoriesScreen(categories: categories),
                ),
              );
            },
            child: Text("More", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: Column(
        children: [
          // Slider
          Container(
            height: 180,
            child: PageView.builder(
              itemCount: categories.length,
              itemBuilder: (context, index) {
                return Card(
                  margin: EdgeInsets.all(10),
                  child: Center(
                    child: Text(
                      categories[index],
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Explore Section
          Expanded(
            child: GridView.builder(
              padding: EdgeInsets.all(10),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                return Card(
                  child: Center(
                    child: Text(
                      categories[index],
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
