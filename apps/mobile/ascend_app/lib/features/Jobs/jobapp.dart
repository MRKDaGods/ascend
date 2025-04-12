import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_home_page.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'package:ascend_app/theme.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';

class JobApp extends StatefulWidget {
  final bool isDarkMode;
  const JobApp({super.key, required this.isDarkMode});

  @override
  State<JobApp> createState() {
    return _JobAppState();
  }
}

class _JobAppState extends State<JobApp> {
  String screen = "job-home";

  void tojobs() {
    setState(() {
      screen = "job-home";
    });
  }

  void tosearchbar() {
    setState(() {
      screen = "searchbar";
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDarkTheme =
        widget.isDarkMode || Theme.of(context).brightness == Brightness.dark;

    Widget? activescreen;
    if (screen == "job-home") {
      activescreen = JobHomePage(isDarkMode: isDarkTheme);
    }
    if (screen == "searchbar") {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => JobSearchPage(),
          ),
        ).then((_) {
          setState(() {
            screen = "job-home"; // Reset to job-home when back is pressed
          });
        });
      });
    }
    return MaterialApp(
      theme: isDarkTheme ? AppTheme.dark : AppTheme.light,
      home: Scaffold(
        backgroundColor: isDarkTheme ? Colors.black : Colors.white,
        body: DefaultTabController(
          length: 2,
          child: CustomScrollView(
            slivers: [
              if (screen == "job-home")
                CustomSliverAppBar(
                  floating: true,
                  pinned: true,
                  showTabBar: false,
                  jobs: true,
                  onJobAction: tosearchbar,
                ),

              SliverFillRemaining(child: activescreen),
            ],
          ),
        ),
      ),
    );
  }
}
