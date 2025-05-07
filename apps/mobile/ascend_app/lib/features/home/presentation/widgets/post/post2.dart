import 'package:ascend_app/features/home/presentation/widgets/post/post_feedback_options.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../bloc/post_bloc/post_bloc.dart';
import '../../../bloc/post_bloc/post_event.dart';
import '../../../bloc/post_bloc/post_state.dart';
import '../../../models/post_model.dart';
import '../../../models/comment_model.dart';
import '../../../managers/reaction_manager.dart';
import '../../pages/post_detail_page.dart';
import '../../utils/reaction_utils.dart';
import '../post/post_header.dart';
import '../post/post_content.dart';
import '../image/post_image_section.dart';
import '../post/post_action_button.dart';
import '../post/post_engagement_stats.dart';
import '../reaction/reaction_button.dart';
import '../comment/comment_preview.dart';
import '../../utils/full_screen_image_viewer.dart';
import '../../utils/sheet_helpers.dart';
import '../../../../../core/di/dependency_injection.dart';
import 'dart:convert';
import 'package:ascend_app/features/home/presentation/widgets/image/post_images_grid_shape.dart';

class Announcement extends StatefulWidget {
  final int companyId;
  final String companyName;
  const Announcement({
    super.key,
    required this.companyId,
    required this.companyName,
  });

  @override
  State<Announcement> createState() => _AnnouncementState();
}

class _AnnouncementState extends State<Announcement> {
  List<dynamic> announcements = [];
  bool isLoading = true;

  Future<void> _fetchAnnouncements() async {
    try {
      final endpoint = '/company/companies/${widget.companyId}/announcements';
      final response = await ServiceLocator().apiClient.get(endpoint);
      final data = jsonDecode(response.body)['data']['announcements'];
      print("Announcements data: $data");
      setState(() {
        announcements = data;
        isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching announcements: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchAnnouncements();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (announcements.isEmpty) {
      return const Center(child: Text("No announcements available."));
    }

    return ListView.builder(
      itemCount: announcements.length,
      itemBuilder: (context, index) {
        final announcement = announcements[index];
        final List<String> imageUrls = List<String>.from(
          announcement['image_urls'] ?? [],
        );

        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          elevation: 0.5,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Announcement Header
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  "${widget.companyName}",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),

              // Announcement Content
              if (announcement['content'] != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Text(
                    announcement['content'],
                    style: const TextStyle(fontSize: 14),
                  ),
                ),

              // Announcement Images Grid
              if (imageUrls.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12.0,
                    vertical: 7.0,
                  ),
                  child: ImagesGridShape(
                    imageCount: imageUrls.length,
                    images: imageUrls,
                    onTap: (index) {
                      debugPrint(
                        "Image tapped at index: $index for announcement",
                      );
                    },
                  ),
                ),

              // Announcement Date
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 8.0,
                ),
                child: Text(
                  "Created At: ${announcement['created_at']}",
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
