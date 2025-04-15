import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_home_page.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'package:ascend_app/theme.dart';
import 'package:ascend_app/features/Jobs/pages/job_search_page.dart';
import 'package:ascend_app/features/Jobs/data/jobsdummy.dart';

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
    final List<String> companyNames =
        jobs.map((job) => job.company).toSet().toList();

    Widget? activescreen;
    if (screen == "job-home") {
      activescreen = JobHomePage(isDarkMode: isDarkTheme, jobs: jobs);
    } else if (screen == "searchbar") {
      activescreen = JobSearchPage(true, onBackPressed: tojobs, jobs: jobs);
    }

    return MaterialApp(
      theme: isDarkTheme ? AppTheme.dark : AppTheme.light,
      home: Scaffold(
        //backgroundColor: isDarkTheme ? Colors.black : Colors.white,
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
