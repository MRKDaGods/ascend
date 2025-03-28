import 'package:flutter/material.dart';

extension ScaffoldStateExtension on ScaffoldState {
  void openDrawerWithAnimation({
    Duration duration = const Duration(milliseconds: 250),
    Curve curve = Curves.decelerate,
  }) {
    if (!isDrawerOpen && widget.drawer != null) {
      openDrawer();
    }
  }

  void closeDrawerWithAnimation({
    Duration duration = const Duration(milliseconds: 200),
    Curve curve = Curves.easeIn,
  }) {
    if (isDrawerOpen) {
      Navigator.of(context).pop();
    }
  }
}