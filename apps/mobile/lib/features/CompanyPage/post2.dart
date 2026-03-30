import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_header.dart';
import 'package:ascend_app/features/home/presentation/widgets/post/post_content.dart';
import '../../../../../core/di/dependency_injection.dart';
import 'dart:convert';
import 'package:ascend_app/features/home/presentation/widgets/image/post_images_grid_shape.dart';

class Announcement extends StatefulWidget {
  final int companyId;
  final String companyName;
  final String companyImageUrl;
  const Announcement({
    super.key,
    required this.companyId,
    required this.companyName,
    required this.companyImageUrl,
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
                child: PostHeader(
                  ownerImageUrl: widget.companyImageUrl,
                  ownerName: widget.companyName,
                  followers: 0,
                  timePosted:
                      DateTime.parse(announcement['created_at'])
                          .toLocal()
                          .toString()
                          .split(' ')[0], // Extract only the date
                  userId: '16',
                ),
              ),

              // Announcement Content
              if (announcement['content'] != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: PostContent(
                    title: "",
                    description: announcement['content'],
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
              SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }
}
