import 'package:flutter/material.dart';

class ProfileSection {
  final String title;
  final List<Widget>
  content; //can be text(usually one item if text)or list of rows
  final String? text;

  ProfileSection({required this.title, required this.content, this.text});
}
