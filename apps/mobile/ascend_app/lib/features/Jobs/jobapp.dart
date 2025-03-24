import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/pages/job_home_page.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';

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

  void tosavedjobs() {
    setState(() {
      screen = "bookmarked";
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget? activescreen;
    if (screen == "job-home") {
      activescreen = JobHomePage(
        tosavedjobs: tosavedjobs,
        isDarkMode: widget.isDarkMode,
      );
    }
    if (screen == "bookmarked") {
      //activescreen = Bookmarked(toalljobs: tojobs);
    }
    return MaterialApp(
      theme: widget.isDarkMode ? ThemeData.dark() : ThemeData.light(),
      home: Scaffold(
        backgroundColor: widget.isDarkMode ? Colors.black : Colors.white,
        body: DefaultTabController(
          length: 2,
          child: CustomScrollView(
            slivers: [
              CustomSliverAppBar(
                floating: true,
                pinned: true,
                showTabBar: false,
                jobs: true,
              ),
              SliverFillRemaining(child: activescreen),
            ],
          ),
        ),
      ),
    );
  }
}
