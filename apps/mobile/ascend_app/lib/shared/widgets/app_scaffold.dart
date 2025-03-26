import 'package:flutter/material.dart';
import 'custom_drawer.dart';

class AppScaffold extends StatelessWidget {
  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final Color? backgroundColor;
  final bool extendBody;
  final bool extendBodyBehindAppBar;
  final Widget? bottomNavigationBar;
  
  // Drawer animation properties
  final Duration drawerOpenDuration;
  final Duration drawerCloseDuration;
  final Curve drawerOpenCurve;
  final Curve drawerCloseCurve;

  const AppScaffold({
    Key? key,
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.backgroundColor,
    this.extendBody = false,
    this.extendBodyBehindAppBar = false,
    this.bottomNavigationBar,
    this.drawerOpenDuration = const Duration(milliseconds: 250),
    this.drawerCloseDuration = const Duration(milliseconds: 200),
    this.drawerOpenCurve = Curves.easeInOut,
    this.drawerCloseCurve = Curves.easeIn,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomDrawer(
      openDuration: drawerOpenDuration,
      closeDuration: drawerCloseDuration,
      openCurve: drawerOpenCurve,
      closeCurve: drawerCloseCurve,
      child: body,
    );
  }
}