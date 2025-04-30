import 'dart:convert';
import 'package:ascend_app/features/UserPage/Data/dummy_profile_sections.dart';
import 'package:ascend_app/core/di/dependency_injection.dart';
import 'package:ascend_app/features/settings/Presentation/widgets/loading_indicator.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:flutter/material.dart';
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
  _UserProfilePageState createState() => _UserProfilePageState();
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
      print(profile.toJson());
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
    if (profile.resumeUrl != null && profile.resumeUrl!.isNotEmpty) {
      sections.add(
        ProfileSection(
          title: "Featured",
          content: [],
          contentWidgets: [
            GestureDetector(
              onTap: () async {
                final Uri url = Uri.parse(profile.resumeUrl!);
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Could not open the link")),
                  );
                }
              },
              child: Container(
                height: 300, // Adjust height for the preview
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: SfPdfViewer.network(
                  profile.resumeUrl!,
                  canShowScrollHead: false,
                  canShowScrollStatus: false,
                  enableDoubleTapZooming: true,
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

    return sections;
  }

  Future<Profile> _fetchProfileData(int? profileId) async {
    final endpoint =
        profileId == null ? "/user/profile/16" : "/user/profile/$profileId";
    final data = await ServiceLocator().apiClient.get(endpoint);
    final json = jsonDecode(data.body);
    return Profile.fromJson(json);
  }

  void _updateSection(ProfileSection updatedSection) {
    setState(() {
      // Find the index of the section to update
      final int index = _sections.indexWhere(
        (section) => section.title == updatedSection.title,
      );
      if (index != -1) {
        _sections[index] = updatedSection; // Update the section
      }
    });
  }

  void _addOrUpdateSection(String title, ProfileEntryWidget newEntry) {
    final existingSectionIndex = _sections.indexWhere(
      (section) => section.title == title,
    );
    if (existingSectionIndex != -1) {
      setState(() {
        _sections[existingSectionIndex].content.add(newEntry);
      });
    } else {
      setState(() {
        _sections.add(ProfileSection(title: title, content: [newEntry]));
      });
    }
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
    // Simulate a network call or data refresh
    await Future.delayed(Duration(seconds: 2));
    // Update the state or data as needed
    setState(() {
      // Example: Refresh the sections or any other data
      _sections = List.from(_sections);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          _profile == null
              ? LoadingIndicator()
              : CustomScrollView(
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
                    child: RefreshIndicator(
                      onRefresh: _onRefresh,
                      child: SingleChildScrollView(
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
                                                  setState(() {
                                                    _profile =
                                                        updatedProfile; // Update the profile
                                                    _sections = _buildSections(
                                                      updatedProfile,
                                                    ); // Refresh sections
                                                  });
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
                                    bio:
                                        _profile?.bio ??
                                        "Computer & communications engineering student at Cairo University",
                                    location:
                                        _profile?.location ?? 'Cairo, Egypt',
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
                                    links: [
                                      {
                                        "title": "My Portfolio",
                                        "url":
                                            "https://dartcode.org/docs/settings/",
                                      },
                                      {
                                        "title": "GitHub",
                                        "url": "https://github.com/MagedWadi",
                                      },
                                    ],
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
                                                        _profile?.education
                                                            ?.add(education);
                                                        _sections =
                                                            _buildSections(
                                                              _profile!,
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
                                                  (context) =>
                                                      AddExperiencePage(
                                                        onSave: (experience) {
                                                          setState(() {
                                                            _profile?.experience
                                                                ?.add(
                                                                  experience,
                                                                );
                                                            _sections =
                                                                _buildSections(
                                                                  _profile!,
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
                                                        _profile?.skills?.add(
                                                          skill,
                                                        );
                                                        _sections =
                                                            _buildSections(
                                                              _profile!,
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
                                        }
                                      },
                                    ),
                                ],
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
    );
  }
}
