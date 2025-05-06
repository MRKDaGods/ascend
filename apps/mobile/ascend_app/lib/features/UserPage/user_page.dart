// ignore_for_file: use_build_context_synchronously

import 'dart:convert';
import 'package:ascend_app/features/UserPage/Data/dummy_profile_sections.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/UserPage/add_featured_page.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_bloc.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_event.dart';
import 'package:ascend_app/features/profile/bloc/user_profile_state.dart';
import 'package:ascend_app/features/settings/Presentation/widgets/loading_indicator.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'models/profile_section.dart';
import 'package:url_launcher/url_launcher.dart';
import 'buttons.dart';
import 'custom_alert_dialog.dart';
import 'profile_main_images.dart';
import 'section_builder.dart';
import 'profile_header.dart';
import 'profile_entry.dart';
import 'add_education_page.dart';
import 'add_experience_page.dart';
import 'add_skill_page.dart';
import 'add_course_page.dart';
import 'add_project_page.dart';
import 'add_interest_page.dart';
import 'package:ascend_app/shared/widgets/custom_sliver_appbar.dart';
import 'edit_profile_page.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';
import 'resume_viewer_page.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({this.profileId, super.key});

  final int? profileId; // Null means it's the user's profile

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  Profile? _profile;
  late bool _isMyProfile;
  late bool _isConnect;
  late bool _isFollow;
  late bool _isPending;
  late String _degree;
  late List<ProfileSection> _sections;

  @override
  void initState() {
    super.initState();
    _isMyProfile = widget.profileId == null;
    _fetchProfileData(widget.profileId).then((profile) {
      setState(() {
        _profile = profile;
        _sections = _buildSections(profile);
        if (_sections.isEmpty) _sections = sections; // Assign sections here
      });
    });
    _isConnect = false; // Dummy data
    _degree = "1st"; // Dummy data
    _isFollow = false; // Dummy data
    _isPending = true; // Dummy data
    _sections = []; // Initialize as empty
  }

  List<ProfileSection> _buildSections(Profile profile) {
    final sections = <ProfileSection>[];

    // Add bio as a section
    if (profile.bio != null && profile.bio!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "About",
          content: [ProfileEntryWidget(description: profile.bio)],
        ),
      );
    }

    // Add featured section if resumeUrl exists
    if (profile.resumeUrl != null) {
      final Uri resumeUri = Uri.parse(profile.resumeUrl!);
      final String fileName = resumeUri.pathSegments.last;
      final String fileFormat = fileName.split('.').last.toUpperCase();

      sections.add(
        ProfileSection(
          title: "Featured",
          content: [],
          contentWidgets: [
            GestureDetector(
              onTap: () async {
                // Navigate to resume viewer page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ResumeViewerPage(
                      resumeUrl: profile.resumeUrl!,
                      isMyProfile: _isMyProfile,
                      profile: profile,
                      onResumeUpdated: () => _onRefresh(),
                    ),
                  ),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Non-scrollable PDF preview
                    Stack(
                      children: [
                        SizedBox(
                          height: 200, // Fixed height for the preview
                          child: ClipRRect(
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(8),
                              topRight: Radius.circular(8),
                            ),
                            child: SfPdfViewer.network(
                              profile.resumeUrl!,
                              canShowScrollHead: false,
                              canShowScrollStatus: false,
                              enableDoubleTapZooming: false,
                              enableTextSelection: false,
                              interactionMode: PdfInteractionMode.pan,
                            ),
                          ),
                        ),
                        Positioned.fill(
                          child: Container(
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.1),
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(8),
                                topRight: Radius.circular(8),
                              ),
                            ),
                            child: TextButton.icon(
                              icon: const Icon(
                                Icons.visibility,
                                color: Colors.white,
                              ),
                              label: const Text(
                                "View Resume",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              style: TextButton.styleFrom(
                                backgroundColor: Colors.blue.withOpacity(0.7),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                              ),
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ResumeViewerPage(
                                      resumeUrl: profile.resumeUrl!,
                                      isMyProfile: _isMyProfile,
                                      profile: profile,
                                      onResumeUpdated: () => _onRefresh(),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 1, color: Colors.grey),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Row(
                        children: [
                          Icon(
                            Icons.description,
                            size: 28,
                            color: Colors.blue.shade700,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  fileName,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.black87,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  fileFormat,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (_isMyProfile)
                            PopupMenuButton<String>(
                              icon: const Icon(Icons.more_vert),
                              onSelected: (value) async {
                                if (value == 'view') {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ResumeViewerPage(
                                        resumeUrl: profile.resumeUrl!,
                                        isMyProfile: _isMyProfile,
                                        profile: profile,
                                        onResumeUpdated: () => _onRefresh(),
                                      ),
                                    ),
                                  );
                                } else if (value == 'replace') {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => AddFeaturedPage(
                                        onSave: (resumeUrl) {
                                          // Update the resumeUrl in the profile
                                          final newProfile = profile.copyWith(
                                            resumeUrl: resumeUrl,
                                          );

                                          // Update the profile using the bloc
                                          context.read<UserProfileBloc>().add(
                                                UpdateUserProfile(newProfile),
                                              );

                                          // Refresh the page
                                          _onRefresh();
                                        },
                                      ),
                                    ),
                                  );
                                } else if (value == 'download') {
                                  if (await canLaunchUrl(resumeUri)) {
                                    await launchUrl(
                                      resumeUri,
                                      mode: LaunchMode.externalApplication,
                                    );
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text("Could not open the link")),
                                    );
                                  }
                                } else if (value == 'delete') {
                                  _deleteResumeEntry();
                                }
                              },
                              itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                                const PopupMenuItem<String>(
                                  value: 'view',
                                  child: ListTile(
                                    leading: Icon(Icons.visibility),
                                    title: Text('View Resume'),
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'replace',
                                  child: ListTile(
                                    leading: Icon(Icons.upload_file),
                                    title: Text('Replace Resume'),
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'download',
                                  child: ListTile(
                                    leading: Icon(Icons.download),
                                    title: Text('Download'),
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'delete',
                                  child: ListTile(
                                    leading: Icon(Icons.delete, color: Colors.red),
                                    title: Text('Delete Resume', style: TextStyle(color: Colors.red)),
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Add experience as a section (LinkedIn puts experience before education)
    if (profile.experience != null && profile.experience!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Experience",
          content:
              profile.experience!
                  .map(
                    (e) => ProfileEntryWidget(
                      icon: Icon(Icons.work),
                      title: e.position,
                      subtitle: e.company,
                      description:
                          "From ${e.startDate.month}/${e.startDate.year} to ${e.endDate != null ? '${e.endDate!.month}/${e.endDate!.year}' : 'Present'}${e.description != null && e.description!.isNotEmpty ? '\n\n${e.description}' : ''}",
                    ),
                  )
                  .toList(),
        ),
      );
    }

    // Add education as a section
    if (profile.education != null && profile.education!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Education",
          content:
              profile.education!
                  .map(
                    (e) => ProfileEntryWidget(
                      icon: Icon(Icons.school),
                      title: e.school,
                      subtitle: "${e.degree} in ${e.fieldOfStudy}",
                      description:
                          "From ${e.startDate.year} to ${e.endDate ?? 'Present'}",
                    ),
                  )
                  .toList(),
        ),
      );
    }

    // Add skills as a section (LinkedIn puts skills before projects)
    if (profile.skills != null && profile.skills!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Skills",
          content:
              profile.skills!
                  .map((s) => ProfileEntryWidget(title: s.name))
                  .toList(),
        ),
      );
    }

    // Add projects as a section
    if (profile.projects != null && profile.projects!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Projects",
          content:
              profile.projects!
                  .map(
                    (p) => ProfileEntryWidget(
                      title: p.name,
                      description: p.description,
                      subtitle:
                          "${p.startDate.month}/${p.startDate.year} to ${p.endDate != null ? '${p.endDate!.month}/${p.endDate!.year}' : 'Present'}",
                    ),
                  )
                  .toList(),
        ),
      );
    }

    // Add courses as a section
    if (profile.courses != null && profile.courses!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Courses",
          content:
              profile.courses!
                  .map(
                    (c) => ProfileEntryWidget(
                      title: c.name,
                      subtitle: c.provider,
                      description:
                          c.completionDate != null
                              ? "Completed on ${c.completionDate!.month}/${c.completionDate!.year}"
                              : null,
                    ),
                  )
                  .toList(),
        ),
      );
    }

    // Add interests as a section (LinkedIn typically puts interests last)
    if (profile.interests != null && profile.interests!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Interests",
          content:
              profile.interests!
                  .map((i) => ProfileEntryWidget(title: i.name))
                  .toList(),
        ),
      );
    }

    return sections;
  }

  Future<Profile> _fetchProfileData(int? profileId) async {
    final endpoint =
        profileId == null ? "/user/profile/16" : "/user/profile/$profileId";
    final data = await ServiceLocator().apiClient.get(endpoint);
    final json = jsonDecode(data.body);
    return Profile.fromJson(json);
  }

  void _deleteResumeEntry() async {
    final endpoint = "/user/profile/resume";
    final response = await ServiceLocator().apiClient.delete(endpoint);
    final json = jsonDecode(response.body);
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Resume deleted successfully.")),
      );
      await _onRefresh(); // Refresh the profile data
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to delete resume: ${json['message']}")),
      );
    }
  }

  void _deleteProfilePic() async {
    final endpoint = "/user/profile/picture";
    final response = await sl.apiClient.delete(endpoint);
    final json = jsonDecode(response.body);
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profile Picture deleted successfully.")),
      );
      await _onRefresh(); // Refresh the profile data
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to delete Profile Picture: ${json['message']}"),
        ),
      );
    }
  }

  void _deleteCover() async {
    final endpoint = "/user/profile/cover";
    final response = await ServiceLocator().apiClient.delete(endpoint);
    final json = jsonDecode(response.body);
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Cover Picture deleted successfully.")),
      );
      await _onRefresh(); // Refresh the profile data
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to delete Cover Picture: ${json['message']}"),
        ),
      );
    }
  }

  void _updateBe(String title) async {
    final existingSectionIndex = _sections.indexWhere(
      (section) => section.title == title,
    );
    if (existingSectionIndex == -1) return; // Section not found

    try {
      // Update the corresponding field in the Profile model
      if (_profile != null) {
        switch (title) {
          case "Education":
            _profile = _profile!.copyWith(
              education:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Education(
                      id: 0, // Replace with actual ID if available
                      userId: _profile!.userId,
                      school: entry.title ?? "",
                      degree: entry.subtitle ?? "",
                      fieldOfStudy: entry.description ?? "",
                      startDate:
                          DateTime.now(), // Replace with actual date if available
                      endDate:
                          null, // Replace with actual end date if available
                    );
                  }).toList(),
            );
            break;
          case "Experience":
            _profile = _profile!.copyWith(
              experience:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Experience(
                      id: 0, // Replace with actual ID if available
                      userId: _profile!.userId,
                      company: entry.subtitle ?? "",
                      position: entry.title ?? "",
                      startDate:
                          DateTime.now(), // Replace with actual date if available
                      endDate:
                          null, // Replace with actual end date if available
                      description: entry.description,
                    );
                  }).toList(),
            );
            break;
          case "Projects":
            _profile = _profile!.copyWith(
              projects:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Project(
                      id: 0, // Replace with actual ID if available
                      userId: _profile!.userId,
                      name: entry.title ?? "",
                      description: entry.description ?? "",
                      startDate:
                          DateTime.now(), // Replace with actual date if available
                      endDate:
                          null, // Replace with actual end date if available
                    );
                  }).toList(),
            );
            break;
          case "Skills":
            _profile = _profile!.copyWith(
              skills:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Skill(
                      id: 0, // Replace with actual ID if available
                      name: entry.title ?? "",
                    );
                  }).toList(),
            );
            break;
          case "Interests":
            _profile = _profile!.copyWith(
              interests:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Interest(
                      id: 0, // Replace with actual ID if available
                      name: entry.title ?? "",
                    );
                  }).toList(),
            );
            break;
          case "Courses":
            _profile = _profile!.copyWith(
              courses:
                  _sections[existingSectionIndex].content.map((entry) {
                    return Course(
                      id: 0, // Replace with actual ID if available
                      userId: _profile!.userId,
                      name: entry.title ?? "",
                      provider: entry.subtitle ?? "",
                      completionDate:
                          DateTime.now(), // Replace with actual date if available
                    );
                  }).toList(),
            );
            break;
        }
      }

      // Make the API call to update the section on the backend
      final endpoint = "/user/profile";
      final response = await ServiceLocator().apiClient.put(
        endpoint,
        data: _profile!.toJson(),
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Section updated successfully.")),
        );
      } else {
        throw Exception("Failed to update section");
      }
    } catch (e) {
      // Handle errors gracefully
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error updating section: $e")));
    }
  }

  void _updateSection(ProfileSection updatedSection) async {
    setState(() {
      // Find the index of the section to update
      final int index = _sections.indexWhere(
        (section) => section.title == updatedSection.title,
      );
      if (index != -1) {
        _sections[index] = updatedSection; // Update the section locally
      }
      _updateBe(updatedSection.title); // Call the update function
    });
  }

  void _addOrUpdateSection(
    String title,
    ProfileEntryWidget? newEntry, {
    Widget? contentWidget,
    String? resumeUrl,
  }) async {
    final existingSectionIndex = _sections.indexWhere(
      (section) => section.title == title,
    );

    if (existingSectionIndex != -1) {
      setState(() {
        if (title == "Featured") {
          // Update contentWidgets for "Featured"
          _sections[existingSectionIndex].contentWidgets.clear();
          _sections[existingSectionIndex].contentWidgets.add(contentWidget!);

          // Update the profile's resumeUrl
          if (resumeUrl != null) {
            _profile = _profile!.copyWith(resumeUrl: resumeUrl);
          }
        } else if (newEntry != null) {
          // Update content for other sections
          _sections[existingSectionIndex].content.add(newEntry);
        }
      });
    } else {
      setState(() {
        final newSection =
            title == "Featured"
                ? ProfileSection(
                  title: title,
                  content: [],
                  contentWidgets: contentWidget != null ? [contentWidget] : [],
                )
                : ProfileSection(
                  title: title,
                  content: newEntry != null ? [newEntry] : [],
                );

        if (title == "Featured") {
          // Place "Featured" section after "About" section
          final aboutIndex = _sections.indexWhere((s) => s.title == "About");
          if (aboutIndex != -1) {
            _sections.insert(aboutIndex + 1, newSection);
          } else {
            _sections.add(newSection);
          }

          // Update the profile's resumeUrl
          if (resumeUrl != null) {
            _profile = _profile!.copyWith(resumeUrl: resumeUrl);
          }
        } else {
          _sections.add(newSection);
        }
      });
    }
    _updateBe(title); // Call the update function
  }

  void _toggleConnect() {
    setState(() {
      if (!_isConnect && !_isPending) {
        _isPending = true; // Change to "Pending"
      } else if (_isPending) {
        _isPending = false;
        _isConnect = true; // Change to "Connected" //inv accepted
      }
      if (_isConnect) {
        _isConnect = false; // remove connection
      }
    });
  }

  void _toggleFollow() {
    setState(() {
      _isFollow = !_isFollow;
    });
  }

  void _toggleisPending() {
    setState(() {
      _isPending = !_isPending;
    });
  }

  // Function to show withdraw confirmation dialog
  void _showWarningDialogForRemovingConnection(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Remove connection",
          description:
              "Are you sure you want to remove ${_profile?.firstName} ${_profile?.lastName} from your connections?",
          confirmText: "Remove",
          onConfirm: _toggleConnect,
        );
      },
    );
  }

  void _showWarningDialogForPending(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Withdraw invitation",
          description:
              "If you withdraw now, you won't be able to resend to this person for up to 3 weeks.",
          confirmText: "Withdraw",
          onConfirm: _toggleisPending,
        );
      },
    );
  }

  // Function to handle refresh
  Future<void> _onRefresh() async {
    try {
      // Fetch the latest profile data
      final Profile updatedProfile = await _fetchProfileData(widget.profileId);
      setState(() {
        _profile = updatedProfile;
        _sections = _buildSections(updatedProfile); // Rebuild sections
      });
    } catch (e) {
      // Handle errors gracefully
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Failed to refresh: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<UserProfileBloc, UserProfileState>(
      listener: (BuildContext context, UserProfileState state) {
        if (_isMyProfile && state is UserProfileLoaded) {
          setState(() {
            _profile = state.profile;
            _sections = _buildSections(state.profile);
          });
        } 
      },
      child: Scaffold(
        backgroundColor: Colors.grey.shade100,
        body:
            _profile == null
                ? const LoadingIndicator()
                : RefreshIndicator(
                  onRefresh: _onRefresh,
                  child: CustomScrollView(
                    slivers: [
                      CustomSliverAppBar(
                        pinned: true,
                        floating: true,
                        showTabBar: false,
                        addpost: false,
                        settings: true,
                        jobs: false,
                        showProfileAvatar: false,
                        contextin: context,
                      ),
                      SliverToBoxAdapter(
                        child: Column(
                          children: [
                            // Profile card
                            Container(
                              margin: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Cover photo and profile image
                                  ProfileMainImages(
                                    profilePic:
                                        _profile?.profilePictureUrl ?? 
                                        'https://eqrp.com/wp-content/themes/blank-child/images/default.png',
                                    coverPic:
                                        _profile?.coverPhotoUrl ?? 
                                        'https://htmlcolorcodes.com/assets/images/colors/dark-gray-color-solid-background-1920x1080.png',
                                    isMyProfile: _isMyProfile,
                                    deleteCover:
                                        _isMyProfile ? _deleteCover : null,
                                    deleteProfile:
                                        _isMyProfile ? _deleteProfilePic : null,
                                    onProfileUpdated: _onRefresh,
                                  ),
                                  // Edit button (if my profile)
                                  if (_isMyProfile)
                                    Padding(
                                      padding: const EdgeInsets.only(
                                        right: 16,
                                        top: 8,
                                      ),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                          IconButton(
                                            onPressed: () {
                                              Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                  builder:
                                                      (
                                                        context,
                                                      ) => EditProfilePage(
                                                        profile: _profile!,
                                                        onSave: (
                                                          updatedProfile,
                                                        ) {
                                                          context
                                                              .read<
                                                                UserProfileBloc
                                                              >()
                                                              .add(
                                                                UpdateUserProfile(
                                                                  updatedProfile,
                                                                ),
                                                              );
                                                        },
                                                      ),
                                                ),
                                              );
                                            },
                                            icon: const Icon(
                                              Icons.edit,
                                              size: 21,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                  // Profile header information
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        ProfileHeader(
                                          name:
                                              "${_profile?.firstName} ${_profile?.additionalName != null && _profile!.additionalName!.isNotEmpty ? "(${_profile!.additionalName})" : ""} ${_profile?.lastName}",
                                          bio: _profile?.headline ?? "",
                                          location:
                                              _profile?.location ?? 
                                              'No location set',
                                          showSchool:
                                              _profile?.showSchool ?? true,
                                          showCurrentCompany:
                                              _profile?.showCurrentCompany ?? 
                                              true,
                                          latestEducation:
                                              _profile?.education?.isNotEmpty == 
                                                      true
                                                  ? _profile!
                                                      .education!
                                                      .first
                                                      .school
                                                  : 'Cairo University',
                                          connections: 15, // Dummy data
                                          isconnect: _isConnect,
                                          isPending: _isPending,
                                          currentPosition:
                                              _profile
                                                          ?.experience
                                                          ?.isNotEmpty == 
                                                      true
                                                  ? _profile!
                                                      .experience!
                                                      .first
                                                      .company
                                                  : 'Google',
                                          mutualConnections: [
                                            "Ahmed Hassan",
                                            "Sarah Ali",
                                          ], // Dummy data
                                          links:
                                              _profile?.website != null
                                                  ? [
                                                    {
                                                      "title": "My Website",
                                                      "url": _profile!.website!,
                                                    }, 
                                                  ]
                                                  : [
                                                    {
                                                      "title": "My Portfolio",
                                                      "url":
                                                          "https://dartcode.org/docs/settings/",
                                                    },
                                                    {
                                                      "title": "GitHub",
                                                      "url":
                                                          "https://github.com/MagedWadi",
                                                    },
                                                  ], // Dummy data

                                          verified: true, // Dummy data
                                          degree: _degree,
                                          isMyProfile: _isMyProfile,
                                          namePronunciation:
                                              _profile?.namePronunciation != 
                                              null,
                                        ),

                                        ProfileButtons(
                                          isfollowing: _isFollow,
                                          isMyProfile: _isMyProfile,
                                          isConnect: _isConnect,
                                          isPending: _isPending,
                                          toggleConnect: _toggleConnect,
                                          withdrawRequest:
                                              _showWarningDialogForPending,
                                          toggleFollow: _toggleFollow,
                                          removeConnection:
                                              _showWarningDialogForRemovingConnection,
                                          addOrUpdateSection: 
                                              _addOrUpdateSection,
                                          profile: _profile,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                ],
                              ),
                            ),

                            if (_sections.isEmpty)
                              Container(
                                margin: const EdgeInsets.symmetric(vertical: 4),
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.1),
                                      blurRadius: 4,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Center(
                                  child: Text(
                                    "No sections available.",
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Colors.grey,
                                    ), 
                                  ),
                                ),
                              )
                            else
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  for (var section in _sections)
                                    Container(
                                      margin: const EdgeInsets.symmetric(
                                        vertical: 4,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(
                                              0.1,
                                            ),
                                            blurRadius: 4,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: SectionBuilder(
                                        section: section,
                                        isMyProfile: _isMyProfile,
                                        onUpdateSection: _updateSection,
                                        // Use condensed view for certain sections
                                        useCondensedView: [
                                          "Skills",
                                          "Projects", 
                                          "Courses",
                                          "Interests",
                                        ].contains(section.title),
                                        initialVisibleItems: 2,
                                        onAddEntry: () {
                                          if (section.title == "Education") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (
                                                      context,
                                                    ) => AddEducationPage(
                                                      onSave: (education) {
                                                        // Create a new profile with updated education list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              education: [
                                                                ...?_profile
                                                                    ?.education,
                                                                education,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile, 
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Experience") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (
                                                      context,
                                                    ) => AddExperiencePage(
                                                      onSave: (experience) {
                                                        // Create a new profile with updated experience list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              experience: [
                                                                ...?_profile
                                                                    ?.experience,
                                                                experience,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile, 
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Skills") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddSkillPage(
                                                      onSave: (skill) {
                                                        // Create a new profile with updated skills list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              skills: [
                                                                ...?_profile
                                                                    ?.skills,
                                                                skill,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Courses") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddCoursePage(
                                                      onSave: (course) {
                                                        // Create a new profile with updated courses list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              courses: [
                                                                ...?_profile
                                                                    ?.courses,
                                                                course,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Projects") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddProjectPage(
                                                      onSave: (project) {
                                                        // Create a new profile with updated projects list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              projects: [
                                                                ...?_profile
                                                                    ?.projects,
                                                                project,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Interests") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (
                                                      context,
                                                    ) => AddInterestPage(
                                                      onSave: (interest) {
                                                        // Create a new profile with updated interests list
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              interests: [
                                                                ...?_profile
                                                                    ?.interests,
                                                                interest,
                                                              ],
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                              "Featured") {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (
                                                      context,
                                                    ) => AddFeaturedPage(
                                                      onSave: (resumeUrl) {
                                                        final Uri resumeUri =
                                                            Uri.parse(
                                                              resumeUrl,
                                                            );
                                                        final String fileName =
                                                            resumeUri
                                                                .pathSegments
                                                                .last;
                                                        final String
                                                        fileFormat =
                                                            fileName
                                                                .split('.')
                                                                .last
                                                                .toUpperCase();

                                                        // Create a PDF viewer widget for the resume
                                                        final newWidget = GestureDetector(
                                                          onTap: () async {
                                                            if (await canLaunchUrl(
                                                              resumeUri,
                                                            )) {
                                                              await launchUrl(
                                                                resumeUri,
                                                                mode:
                                                                    LaunchMode
                                                                        .externalApplication,
                                                              );
                                                            } else {
                                                              ScaffoldMessenger.of(
                                                                context,
                                                              ).showSnackBar(
                                                                const SnackBar(
                                                                  content: Text(
                                                                    "Could not open the link",
                                                                  ),
                                                                ),
                                                              );
                                                            }
                                                          },
                                                          child: Container(
                                                            decoration: BoxDecoration(
                                                              border: Border.all(
                                                                color:
                                                                    Colors
                                                                        .grey
                                                                        .shade300,
                                                              ),
                                                              borderRadius:
                                                                  BorderRadius.circular(
                                                                    8,
                                                                  ),
                                                            ),
                                                            child: Column(
                                                              crossAxisAlignment:
                                                                  CrossAxisAlignment
                                                                      .start,
                                                              children: [
                                                                // Non-scrollable PDF preview
                                                                SizedBox(
                                                                  height:
                                                                      200, // Fixed height for the preview
                                                                  child: ClipRRect(
                                                                    borderRadius: const BorderRadius.only(
                                                                      topLeft:
                                                                          Radius.circular(
                                                                            8,
                                                                          ),
                                                                      topRight:
                                                                          Radius.circular(
                                                                            8,
                                                                          ),
                                                                    ),
                                                                    child: SfPdfViewer.network(
                                                                      resumeUrl,
                                                                      canShowScrollHead:
                                                                          false,
                                                                      canShowScrollStatus: 
                                                                          false,
                                                                      enableDoubleTapZooming:
                                                                          false, 
                                                                    ),
                                                                  ),
                                                                ),
                                                                const Divider(
                                                                  height: 1,
                                                                  color:
                                                                      Colors
                                                                          .grey,
                                                                ),
                                                                Padding(
                                                                  padding:
                                                                      const EdgeInsets.all(
                                                                        12.0,
                                                                      ),
                                                                  child: Row(
                                                                    children: [
                                                                      Icon(
                                                                        Icons
                                                                            .description,
                                                                        size:
                                                                            28,
                                                                        color: 
                                                                            Colors.blue.shade700,
                                                                      ),
                                                                      const SizedBox(
                                                                        width:
                                                                            12,
                                                                      ),
                                                                      Expanded(
                                                                        child: Column(
                                                                          crossAxisAlignment:
                                                                              CrossAxisAlignment.start,
                                                                          children: [
                                                                            Text(
                                                                              fileName,
                                                                              style: const TextStyle(
                                                                                fontSize:
                                                                                    16,
                                                                                fontWeight:
                                                                                    FontWeight.w600,
                                                                                color:
                                                                                    Colors.black87,
                                                                              ),
                                                                              overflow:
                                                                                  TextOverflow.ellipsis,
                                                                            ),
                                                                            const SizedBox(
                                                                              height:
                                                                                  2, 
                                                                            ),
                                                                            Text(
                                                                              fileFormat, 
                                                                              style: TextStyle(
                                                                                fontSize:
                                                                                    14,
                                                                                color:
                                                                                    Colors.grey.shade700,
                                                                              ),
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      ),
                                                                    ],
                                                                  ),
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                        );

                                                        // Create a new profile with updated resumeUrl
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              resumeUrl:
                                                                  resumeUrl, 
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );

                                                        // Update the UI with the new widget
                                                        _addOrUpdateSection(
                                                          "Featured",
                                                          null,
                                                          contentWidget:
                                                              newWidget,
                                                          resumeUrl: resumeUrl,
                                                        );
                                                      },
                                                    ),
                                              ),
                                            ); 
                                          }
                                        },
                                        onEditEntry: (index) { 
                                          // Add edit functionality for each section
                                          if (section.title == "About") {
                                            if (_profile != null) {
                                              // Navigate to edit profile page focused on bio
                                              Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                  builder:
                                                      (
                                                        context,
                                                      ) => EditProfilePage(
                                                        profile: _profile!,
                                                        //initialTabIndex: 0, // Assuming 0 is the tab for basic info including bio
                                                        onSave: (
                                                          updatedProfile, 
                                                        ) {
                                                          context
                                                              .read<
                                                                UserProfileBloc
                                                              >()
                                                              .add(
                                                                UpdateUserProfile(
                                                                  updatedProfile,
                                                                ),
                                                              );
                                                        },
                                                      ),
                                                ),
                                              );
                                            }
                                          } else if (section.title ==
                                                  "Education" &&
                                              _profile?.education != null &&
                                              index <
                                                  _profile!.education!.length) {
                                            final education =
                                                _profile!.education![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute( 
                                                builder:
                                                    (
                                                      context, 
                                                    ) => AddEducationPage(
                                                      education:
                                                          education, // Pass the existing education
                                                      onSave: (
                                                        updatedEducation,
                                                      ) {
                                                        // Create a new list with the updated education
                                                        final updatedEducationList =
                                                            List<
                                                              Education
                                                            >.from(
                                                              _profile!
                                                                      .education ?? 
                                                                  [],
                                                            ); 
                                                        updatedEducationList[index] =
                                                            updatedEducation;

                                                        // Update the profile
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              education:
                                                                  updatedEducationList,
                                                            );

                                                        // Use the bloc to update the profile
                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title == 
                                                  "Experience" &&
                                              _profile?.experience != null &&
                                              index < 
                                                  _profile!
                                                      .experience!
                                                      .length) {
                                            final experience =
                                                _profile!.experience![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (
                                                      context,
                                                    ) => AddExperiencePage(
                                                      experience:
                                                          experience, // Pass the existing experience
                                                      onSave: (
                                                        updatedExperience,
                                                      ) {
                                                        final updatedExperienceList =
                                                            List< 
                                                              Experience
                                                            >.from(
                                                              _profile!
                                                                      .experience ?? 
                                                                  [],
                                                            );
                                                        updatedExperienceList[index] =
                                                            updatedExperience;

                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              experience:
                                                                  updatedExperienceList,
                                                            );

                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      }, 
                                                    ),
                                              ),
                                            ); 
                                          } else if (section.title ==
                                                  "Skills" &&
                                              _profile?.skills != null &&
                                              index <
                                                  _profile!.skills!.length) {
                                            final skill =
                                                _profile!.skills![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddSkillPage(
                                                      skill:
                                                          skill, // Pass the existing skill
                                                      onSave: (updatedSkill) { 
                                                        final updatedSkillsList =
                                                            List<Skill>.from(
                                                              _profile!
                                                                      .skills ?? 
                                                                  [],
                                                            );
                                                        updatedSkillsList[index] =
                                                            updatedSkill;

                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              skills:
                                                                  updatedSkillsList,
                                                            );

                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                                  "Projects" &&
                                              _profile?.projects != null &&
                                              index <
                                                  _profile!.projects!.length) {
                                            final project =
                                                _profile!.projects![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddProjectPage( 
                                                      project:
                                                          project, // Pass the existing project 
                                                      onSave: (updatedProject) {
                                                        final updatedProjectsList = 
                                                            List<Project>.from(
                                                              _profile!
                                                                      .projects ?? 
                                                                  [],
                                                            );
                                                        updatedProjectsList[index] =
                                                            updatedProject; 

                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              projects:
                                                                  updatedProjectsList,
                                                            );

                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title == 
                                                  "Interests" &&
                                              _profile?.interests != null && 
                                              index <
                                                  _profile!.interests!.length) { 
                                            final interest =
                                                _profile!.interests![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    ( 
                                                      context,
                                                    ) => AddInterestPage(
                                                      interest:
                                                          interest, // Pass the existing interest
                                                      onSave: (
                                                        updatedInterest,
                                                      ) {
                                                        final updatedInterestsList =
                                                            List<Interest>.from(
                                                              _profile!
                                                                      .interests ?? 
                                                                  [],
                                                            );
                                                        updatedInterestsList[index] =
                                                            updatedInterest;

                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              interests: 
                                                                  updatedInterestsList,
                                                            ); 

                                                        context 
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile, 
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            );
                                          } else if (section.title ==
                                                  "Courses" &&
                                              _profile?.courses != null &&
                                              index <
                                                  _profile!.courses!.length) {
                                            final course =
                                                _profile!.courses![index];
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder:
                                                    (context) => AddCoursePage(
                                                      course:
                                                          course, // Pass the existing course 
                                                      onSave: (updatedCourse) {
                                                        final updatedCoursesList = 
                                                            List<Course>.from(
                                                              _profile! 
                                                                      .courses ?? 
                                                                  [],
                                                            );
                                                        updatedCoursesList[index] =
                                                            updatedCourse;
 
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              courses:
                                                                  updatedCoursesList,
                                                            );

                                                        context
                                                            .read<
                                                              UserProfileBloc
                                                            >()
                                                            .add(
                                                              UpdateUserProfile(
                                                                newProfile,
                                                              ),
                                                            );
                                                      },
                                                    ),
                                              ),
                                            ); 
                                          }
                                        }, 
                                        onDeleteEntry: (index) {
                                          // Add delete functionality for each section 
                                          // Show confirmation dialog
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return CustomAlertDialog(
                                                title: 
                                                    "Delete ${section.title} Entry",
                                                description:
                                                    "Are you sure you want to delete this ${section.title.toLowerCase()} entry?",
                                                confirmText: "Delete",
                                                onConfirm: () {
                                                  if (section.title == 
                                                          "Education" &&
                                                      _profile?.education != 
                                                          null &&
                                                      index <
                                                          _profile!
                                                              .education!
                                                              .length) {
                                                    // Create a new list without the deleted education
                                                    final updatedEducationList =
                                                        List<Education>.from(
                                                          _profile!.education ?? 
                                                              [],
                                                        ); 
                                                    updatedEducationList
                                                        .removeAt(index); 

                                                    // Update the profile 
                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          education:
                                                              updatedEducationList,
                                                        );
 
                                                    // Use the bloc to update the profile
                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title == 
                                                          "Experience" &&
                                                      _profile?.experience != 
                                                          null &&
                                                      index <
                                                          _profile!
                                                              .experience!
                                                              .length) {
                                                    final updatedExperienceList =
                                                        List<Experience>.from(
                                                          _profile!
                                                                  .experience ??  
                                                              [],
                                                        );
                                                    updatedExperienceList
                                                        .removeAt(index);

                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          experience:
                                                              updatedExperienceList,
                                                        );

                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title == 
                                                          "Skills" &&
                                                      _profile?.skills != 
                                                          null &&
                                                      index <
                                                          _profile!
                                                              .skills!
                                                              .length) {
                                                    final updatedSkillsList =
                                                        List<Skill>.from(
                                                          _profile!.skills ?? 
                                                              [],
                                                        );
                                                    updatedSkillsList.removeAt(
                                                      index,
                                                    );
                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          skills:
                                                              updatedSkillsList,
                                                        );
                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title ==
                                                           "Projects" &&
                                                      _profile?.projects !=
                                                           null &&
                                                      index <
                                                          _profile!
                                                              .projects!
                                                              .length) {
                                                    final updatedProjectsList =
                                                        List<Project>.from(
                                                          _profile!.projects ?? 
                                                               [],
                                                        );
                                                    updatedProjectsList
                                                        .removeAt(index);
                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          projects:
                                                              updatedProjectsList,
                                                        );
                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title ==
                                                           "Interests" &&
                                                      _profile?.interests !=
                                                           null &&
                                                      index <
                                                          _profile!
                                                              .interests!
                                                              .length) {
                                                    final updatedInterestsList =
                                                        List<Interest>.from(
                                                          _profile!.interests ?? 
                                                               [],
                                                        );
                                                    updatedInterestsList
                                                        .removeAt(index);
                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          interests:
                                                              updatedInterestsList,
                                                        );
                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title ==
                                                           "Courses" &&
                                                      _profile?.courses !=
                                                           null &&
                                                      index <
                                                          _profile!
                                                              .courses!
                                                              .length) {
                                                    final updatedCoursesList =
                                                        List<Course>.from(
                                                          _profile!.courses ?? 
                                                               [],
                                                        );
                                                    updatedCoursesList.removeAt(
                                                      index,
                                                    );
                                                    final newProfile = _profile!
                                                        .copyWith(
                                                          courses:
                                                              updatedCoursesList,
                                                        );
                                                    context
                                                        .read<UserProfileBloc>()
                                                        .add(
                                                          UpdateUserProfile(
                                                            newProfile,
                                                          ),
                                                        );
                                                  } else if (section.title ==
                                                       "Featured") {
                                                    // Delete resume
                                                    _deleteResumeEntry();
                                                  }
                                                },
                                              );
                                            },
                                          );
                                        },
                                      ),
                                    ),
                                  const SizedBox(height: 20),
                                ],
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
      ),
    );
  }
}