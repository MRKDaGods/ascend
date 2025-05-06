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
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart'; // Add this import for PDF rendering

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
      //debugPrint();
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
                if (await canLaunchUrl(resumeUri)) {
                  await launchUrl(
                    resumeUri,
                    mode: LaunchMode.externalApplication,
                  );
                } else {
                  // ignore: use_build_context_synchronously
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Could not open the link")),
                  );
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Non-scrollable PDF preview
                    SizedBox(
                      height: 200, // Fixed height for the preview
                      child: SfPdfViewer.network(
                        profile.resumeUrl!,
                        canShowScrollHead: false,
                        canShowScrollStatus: false,
                        enableDoubleTapZooming: false,
                      ),
                    ),
                    const Divider(color: Colors.grey),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.description, size: 28),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  fileName,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  fileFormat,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
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
            ),
          ],
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
                      imageUrl: 'assets/company_placeholder.png',
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

    // Add experience as a section
    if (profile.experience != null && profile.experience!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Experience",
          content:
              profile.experience!
                  .map(
                    (e) => ProfileEntryWidget(
                      imageUrl: 'assets/company_placeholder.png',
                      title: e.position,
                      subtitle: e.company,
                      description:
                          "From ${e.startDate.year} to ${e.endDate?.year ?? 'Present'}",
                    ),
                  )
                  .toList(),
        ),
      );
    }

    // Add interests as a section
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
                              ? "Completed on ${c.completionDate!.toLocal()}"
                              : null,
                    ),
                  )
                  .toList(),
        ),
      );
    }
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
    final Response = await ServiceLocator().apiClient.delete(endpoint);
    final json = jsonDecode(Response.body);
    if (Response.statusCode == 200) {
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
    final Response = await ServiceLocator().apiClient.delete(endpoint);
    final json = jsonDecode(Response.body);
    if (Response.statusCode == 200) {
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
    final Response = await ServiceLocator().apiClient.delete(endpoint);
    final json = jsonDecode(Response.body);
    if (Response.statusCode == 200) {
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
    if (title == "Featured") {
      // Save the updated profile to the backend
      try {
        final endpoint = "/user/profile/resume"; // Replace with actual endpoint
        final response = await ServiceLocator().apiClient.post(
          endpoint,
          data: _profile!.toJson(),
        );
        if (response.statusCode != 200) {
          throw Exception("Failed to update profile");
        }
      } catch (e) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Error saving resume: $e")));
      }
      return;
    }
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
      print(_profile!.toJson());

      // Make the API call to update the section on the backend
      final endpoint = "/user/profile";
      final response = await ServiceLocator().apiClient.put(
        endpoint,
        data: _profile!.toJson(),
      );
      print(response.body);
      print(response.statusCode);
      print(response);
      final json = jsonDecode(response.body);
      print(json);
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
    String? resumeUrl, // Add optional resumeUrl parameter
  }) async {
    final existingSectionIndex = _sections.indexWhere(
      (section) => section.title == title,
    );

    if (existingSectionIndex != -1) {
      setState(() {
        if (title == "Featured") {
          // Update contentWidgets for "Featured"
          print("contentWidget: $contentWidget");
          _sections[existingSectionIndex].contentWidgets.clear();
          _sections[existingSectionIndex].contentWidgets.add(contentWidget!);

          // Update the profile's resumeUrl
          if (resumeUrl != null) {
            _profile = _profile!.copyWith(resumeUrl: resumeUrl);
          }
        } else if (newEntry != null) {
          // Update content for other sections
          print("updating content: $newEntry");
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
              "If you withdraw now, you won’t be able to resend to this person for up to 3 weeks.",
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
        // ignore: use_build_context_synchronously
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
        body:
            _profile == null
                ? LoadingIndicator()
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
                            ProfileMainImages(
                              profilePic:
                                  _profile?.profilePictureUrl ??
                                  'https://picsum.photos/500',
                              coverPic:
                                  _profile?.coverPhotoUrl ??
                                  'https://picsum.photos/1500/500',
                              isMyProfile: _isMyProfile,
                              deleteCover: _isMyProfile ? _deleteCover : null,
                              deleteProfile:
                                  _isMyProfile ? _deleteProfilePic : null,
                            ),
                            if (_isMyProfile)
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  IconButton(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder:
                                              (context) => EditProfilePage(
                                                profile: _profile!,
                                                onSave: (updatedProfile) {
                                                  debugPrint(
                                                    "Updated ProfileReq: ${updatedProfile.toJson()}",
                                                  );
                                                  context
                                                      .read<UserProfileBloc>()
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
                                    icon: Icon(Icons.edit_outlined),
                                  ),
                                ],
                              ),
                            SizedBox(height: _isMyProfile ? 5 : 50),
                            Padding(
                              padding: EdgeInsets.symmetric(horizontal: 20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ProfileHeader(
                                    name:
                                        "${_profile?.firstName} ${_profile?.additionalName != null && _profile!.additionalName!.isNotEmpty ? "(${_profile!.additionalName})" : ""}${_profile?.lastName}",
                                    bio: _profile?.headline ?? "",
                                    location:
                                        _profile?.location ?? 'No location set',
                                    showSchool: _profile?.showSchool ?? true,
                                    showCurrentCompany:
                                        _profile?.showCurrentCompany ?? true,
                                    latestEducation:
                                        _profile?.education?.isNotEmpty == true
                                            ? _profile!.education!.first.school
                                            : 'Cairo University',
                                    connections: 15, // Dummy data
                                    isconnect: _isConnect,
                                    isPending: _isPending,
                                    currentPosition:
                                        _profile?.experience?.isNotEmpty == true
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
                                        _profile?.namePronunciation != null,
                                  ),
                                  SizedBox(height: 15),
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
                                    addOrUpdateSection: _addOrUpdateSection,
                                    profile: _profile,
                                  ),
                                  SizedBox(height: 30),
                                ],
                              ),
                            ),
                            if (_sections.isEmpty)
                              Padding(
                                padding: const EdgeInsets.all(20.0),
                                child: Text(
                                  "No sections available.",
                                  style: TextStyle(fontSize: 18),
                                ),
                              )
                            else
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(height: 10),
                                  for (var section in _sections)
                                    SectionBuilder(
                                      section: section,
                                      isMyProfile: _isMyProfile,
                                      onUpdateSection: _updateSection,
                                      onAddEntry: () {
                                        if (section.title == "Education") {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder:
                                                  (context) => AddEducationPage(
                                                    onSave: (education) {
                                                      setState(() {
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              education: [
                                                                ...?_profile
                                                                    ?.education,
                                                                education,
                                                              ],
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
                                                      });
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
                                                      setState(() {
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              experience: [
                                                                ...?_profile
                                                                    ?.experience,
                                                                experience,
                                                              ],
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
                                                      });
                                                    },
                                                  ),
                                            ),
                                          );
                                        } else if (section.title == "Skills") {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder:
                                                  (context) => AddSkillPage(
                                                    onSave: (skill) {
                                                      setState(() {
                                                        final newProfile =
                                                            _profile!.copyWith(
                                                              skills: [
                                                                ...?_profile
                                                                    ?.skills,
                                                                skill,
                                                              ],
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
                                                      });
                                                    },
                                                  ),
                                            ),
                                          );
                                        } else if (section.title == "Courses") {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder:
                                                  (context) => AddCoursePage(
                                                    onSave: (course) {
                                                      final newEntry =
                                                          ProfileEntryWidget(
                                                            title: course.name,
                                                            subtitle:
                                                                course.provider,
                                                            description:
                                                                course.completionDate !=
                                                                        null
                                                                    ? "Completed on ${course.completionDate!.toLocal()}"
                                                                    : null,
                                                          );
                                                      _addOrUpdateSection(
                                                        "Courses",
                                                        newEntry,
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
                                                      final newEntry =
                                                          ProfileEntryWidget(
                                                            title: project.name,
                                                            description:
                                                                project
                                                                    .description,
                                                          );
                                                      _addOrUpdateSection(
                                                        "Projects",
                                                        newEntry,
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
                                                  (context) => AddInterestPage(
                                                    onSave: (interest) {
                                                      final newEntry =
                                                          ProfileEntryWidget(
                                                            title:
                                                                interest.name,
                                                          );
                                                      _addOrUpdateSection(
                                                        "Interests",
                                                        newEntry,
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
                                                  (context) => AddFeaturedPage(
                                                    onSave: (resumeUrl) {
                                                      final Uri resumeUri =
                                                          Uri.parse(resumeUrl);
                                                      final String fileName =
                                                          resumeUri
                                                              .pathSegments
                                                              .last;
                                                      final String fileFormat =
                                                          fileName
                                                              .split('.')
                                                              .last
                                                              .toUpperCase();
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
                                                                  Colors.grey,
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
                                                              const Divider(
                                                                color:
                                                                    Colors.grey,
                                                              ),
                                                              Padding(
                                                                padding:
                                                                    const EdgeInsets.all(
                                                                      8.0,
                                                                    ),
                                                                child: Row(
                                                                  children: [
                                                                    const Icon(
                                                                      Icons
                                                                          .description,
                                                                      size: 28,
                                                                    ),
                                                                    const SizedBox(
                                                                      width: 8,
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
                                                                                  14,
                                                                              fontWeight:
                                                                                  FontWeight.bold,
                                                                              color:
                                                                                  Colors.black,
                                                                            ),
                                                                            overflow:
                                                                                TextOverflow.ellipsis,
                                                                          ),
                                                                          Text(
                                                                            fileFormat,
                                                                            style: const TextStyle(
                                                                              fontSize:
                                                                                  12,
                                                                              color:
                                                                                  Colors.grey,
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
                                      deleteResume: _deleteResumeEntry,
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
    );
  }
}
