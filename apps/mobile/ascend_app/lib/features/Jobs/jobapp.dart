import 'package:flutter/material.dart';
import 'package:ascend_app/features/Jobs/jobhomepage.dart';
import 'package:ascend_app/features/Jobs/bookmarked.dart';

class JobApp extends StatefulWidget {
  const JobApp({super.key});

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
      activescreen = JobHomePage(tosavedjobs: tosavedjobs);
    }
    if (screen == "bookmarked") {
      activescreen = Bookmarked(toalljobs: tojobs);
    }
    return MaterialApp(home: Scaffold(body: activescreen));
  }
}
