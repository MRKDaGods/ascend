import 'package:flutter/material.dart';
import 'app_drawer.dart';

class CustomDrawer extends StatelessWidget {
  final Widget child;
  final Duration openDuration;
  final Duration closeDuration;
  final Curve openCurve;
  final Curve closeCurve;

  const CustomDrawer({
    Key? key,
    required this.child,
    this.openDuration = const Duration(milliseconds: 250),
    this.closeDuration = const Duration(milliseconds: 200),
    this.openCurve = Curves.easeInOut,
    this.closeCurve = Curves.easeIn,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return _CustomDrawerController(
      openDuration: openDuration,
      closeDuration: closeDuration,
      openCurve: openCurve,
      closeCurve: closeCurve,
      child: child,
    );
  }
}

class _CustomDrawerController extends StatefulWidget {
  final Widget child;
  final Duration openDuration;
  final Duration closeDuration;
  final Curve openCurve;
  final Curve closeCurve;

  const _CustomDrawerController({
    Key? key,
    required this.child,
    required this.openDuration,
    required this.closeDuration,
    required this.openCurve,
    required this.closeCurve,
  }) : super(key: key);

  @override
  _CustomDrawerControllerState createState() => _CustomDrawerControllerState();
}

class _CustomDrawerControllerState extends State<_CustomDrawerController> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isDrawerOpen = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.openDuration,
      reverseDuration: widget.closeDuration,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: AppDrawer(),
      onDrawerChanged: (isOpened) {
        // This callback helps ensure our internal state stays in sync
        // with the drawer's actual state
        if (_isDrawerOpen != isOpened) {
          setState(() {
            _isDrawerOpen = isOpened;
          });
        }
      },
      drawerEnableOpenDragGesture: true,
      body: widget.child,
    );
  }
}