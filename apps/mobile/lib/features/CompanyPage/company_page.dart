import 'package:ascend_app/features/settings/Presentation/widgets/loading_indicator.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'buttons.dart';
import 'custom_alert_dialog.dart';
import 'page_main_images.dart';
import 'page_header.dart';
import 'company_tabs.dart';
import '../../core/di/dependency_injection.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'company_analytics_page.dart';

enum ProfileType { myprofile, otherUserProfile }

class CompanyPage extends StatefulWidget {
  const CompanyPage({
    required this.companyId,
    this.isMyCompany = false,
    super.key,
  });

  final int companyId;
  final bool isMyCompany; // Default value
  @override
  State<CompanyPage> createState() => _CompanyPageState();
}

class _CompanyPageState extends State<CompanyPage> {
  String name = ''; // Default value
  String bio = '';
  String profileImageUrl = '';
  String coverImageUrl = '';
  String location = '';
  ProfileType profiletype = ProfileType.otherUserProfile;
  String industry = '';
  bool isFollow = false;
  int Followers = 0;
  bool verified = false;
  DateTime createdAt = DateTime.now();
  int CreatedBy = 0;
  String domainName = '';
  List<Map<String, String>> links = [];
  Profile? myUser;
  bool isLoading = true;
  bool isAdminView = false;

  @override
  void initState() {
    super.initState();
    _fetchMyUser(); // Fetch the current user's profile
    _fetchFollowedCompanies();
    _fetchCompanyFollowers();
    _fetchCompanyProfile();
  }

  Future<void> _fetchMyUser() async {
    final Uendpoint = "/user/profile";
    final data = await ServiceLocator().apiClient.get(Uendpoint);
    final json = jsonDecode(data.body);
    myUser = Profile.fromJson(json);
  }

  Future<void> _fetchFollowedCompanies() async {
    try {
      final endpoint = '/company/companies/user/followed';
      final response = await ServiceLocator().apiClient.get(endpoint);
      final data = jsonDecode(response.body)['data']['companies'];
      if (data != null) {
        final followedCompanies = List<Map<String, dynamic>>.from(data);
        setState(() {
          isFollow = followedCompanies.any(
            (company) => company['company_id'] == widget.companyId,
          );
          print("isFollow: $isFollow");
        });
      }
    } catch (e) {
      debugPrint('Error fetching followed companies: $e');
    }
  }

  void _showWarningDialogForUnfollowingPage(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Unfollow page",
          description: "You are about to unfollow ${name}.",
          confirmText: "Unfollow",
          onConfirm: _toggleFollow,
        );
      },
    );
  }

  void _toggleFollow() async {
    try {
      if (isFollow) {
        // Unfollow the company
        final endpoint = '/company/companies/${widget.companyId}/unfollow';
        final response = await ServiceLocator().apiClient.delete(endpoint);

        if (response.statusCode == 200) {
          setState(() {
            isFollow = false;
            Followers =
                Followers > 0 ? Followers - 1 : 0; // Decrease follower count
          });
          debugPrint('Company unfollowed successfully.');
        } else {
          debugPrint('Failed to unfollow company: ${response.body}');
        }
      } else {
        // Follow the company

        final endpoint = '/company/companies/${widget.companyId}/follow';
        print("h3mel following $endpoint");
        final response = await ServiceLocator().apiClient.post(
          endpoint,
          data: {
            "first_name":
                "${myUser!.firstName}", // Replace with actual user data
            "last_name": "${myUser!.lastName}", // Replace with actual user data
          },
        );

        if (response.statusCode == 200) {
          setState(() {
            isFollow = true;
            Followers += 1; // Increase follower count
          });
          debugPrint('Company followed successfully.');
        } else {
          debugPrint('Failed to follow company: ${response.body}');
        }
      }
    } catch (e) {
      if (e.toString() ==
          'Exception: Error: 400, {"error":"company already followed"}') {
        setState(() {
          isFollow = !isFollow;
        });
      }
      print(e);
      debugPrint('Error toggling follow status: $e');
    }
  }

  Future<void> _fetchCompanyProfile() async {
    try {
      final endpoint = '/company/companies/${widget.companyId}';
      final response = await ServiceLocator().apiClient.get(endpoint);
      final data = jsonDecode(response.body)['data']['company'];
      print(data);
      setState(() {
        name = data['company_name'] ?? ''; // Provide default value
        bio = data['description'] ?? ''; // Provide default value
        profileImageUrl =
            data['profile_photo_url'] ?? ''; // Provide default value
        coverImageUrl = data['cover_photo_url'] ?? ''; // Provide default value
        location = data['location'] ?? ''; // Provide default value
        industry = data['industry'] ?? ''; // Provide default value
        createdAt =
            data['created_at'] != null
                ? DateTime.parse(data['created_at'])
                : DateTime.now(); // Provide default value
        CreatedBy = data['created_by'] ?? 0; // Provide default value
        domainName = data['domain_name'] ?? ''; // Provide default value

        verified = true; // Default value, update based on API if needed
        links = []; // Default value, update based on API if needed
        isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching company profile: $e');
    }
  }

  Future<void> _fetchCompanyFollowers() async {
    try {
      final endpoint = '/company/companies/${widget.companyId}/followers';
      final response = await ServiceLocator().apiClient.get(endpoint);
      final data = jsonDecode(response.body)['data']['followers'];
      print("a7aaa: $data");
      setState(() {
        Followers =
            data.length; // Update Followers count based on the list size
        print("Followers: $Followers");
      });
    } catch (e) {
      debugPrint('Error fetching company followers: $e');
    }
  }

  void _toggleAdminView() {
    setState(() {
      isAdminView = !isAdminView;
    });
    if (isAdminView) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => CompanyAnalyticsPage(companyId: widget.companyId),
        ),
      );
    } else {
      Navigator.pop(context); // Navigate back to the member view
    }
  }

  @override
  Widget build(BuildContext context) {
    return isLoading
        ? LoadingIndicator()
        : Scaffold(
          body: RefreshIndicator(
            onRefresh: () async {
              await _fetchFollowedCompanies();
              await _fetchCompanyProfile();
              await _fetchCompanyFollowers();
            },
            child: CustomScrollView(
              slivers: [
                CustomSliverAppBar(
                  pinned: true,
                  floating: true,
                  showProfileAvatar: false,
                  contextin: context,
                ),
                SliverToBoxAdapter(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ProfileMainImages(
                          profilePic: profileImageUrl,
                          coverPic: coverImageUrl,
                          isMyProfile: false,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            if (profiletype == ProfileType.myprofile ||
                                isFollow)
                              IconButton(
                                onPressed: () {},
                                icon: Icon(
                                  profiletype == ProfileType.myprofile
                                      ? Icons.edit_outlined
                                      : isFollow
                                      ? Icons.notifications
                                      : null,
                                ),
                              ),
                          ],
                        ),
                        SizedBox(
                          height:
                              (profiletype == ProfileType.myprofile || isFollow)
                                  ? 5
                                  : 50,
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ProfileHeader(
                                name: name,
                                verified: verified,
                                bio: bio,
                                location: location,
                                industry: industry,
                                followers: Followers,
                                employeesCount: 0,
                                isconnect: isFollow,
                                mutualConnections: [], // Update if needed
                                links: links,
                                isMyProfile: false,
                              ),
                              SizedBox(height: 15),
                              ProfileButtons(
                                isfollowing: isFollow,
                                isMyProfile: widget.isMyCompany,
                                websiteExists: links.isNotEmpty,
                                isPending: isFollow,
                                toggleConnect: () {}, // Implement if needed
                                withdrawRequest:
                                    (context) {}, // Implement if needed
                                toggleFollow:
                                    _toggleFollow, // Implement if needed
                                unFollowPage:
                                    _showWarningDialogForUnfollowingPage,
                                onToggleAdminView: _toggleAdminView,
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: MediaQuery.of(context).size.height - 200,
                          child: CompanyTabs(
                            companyName: name,
                            bio: bio,
                            industry: industry,
                            location: location,
                            createdAt: createdAt,
                            companyId: widget.companyId,
                            companyImageUrl: profileImageUrl,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
  }
}
