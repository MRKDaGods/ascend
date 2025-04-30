import 'package:flutter/cupertino.dart';

import '../profile_entry.dart';

class ProfileSection {
  final String title;
  final List<ProfileEntryWidget>
  content; //can be text(usually one item if text)or list of rows
  final String? text;
  final List<Widget> contentWidgets;

  const ProfileSection({
    required this.title,
    required this.content,
    this.text,
    this.contentWidgets = const [],
  });
}
