import 'package:ascend_app/features/UserPage/add_course_page.dart';
import 'package:ascend_app/features/UserPage/add_project_page.dart';
import 'package:ascend_app/features/UserPage/add_interest_page.dart';
import 'package:ascend_app/features/UserPage/models/profile_section.dart';
import 'package:ascend_app/shared/models/profile.dart';
import 'package:flutter/material.dart';
import 'section_builder.dart';
import 'add_education_page.dart';
import 'add_experience_page.dart';
import 'add_skill_page.dart';
import 'profile_entry.dart';
import 'custom_alert_dialog.dart';

class ExpandedSectionPage extends StatefulWidget {
  final ProfileSection section;
  final bool isMyProfile;
  final void Function()? deleteResume;
  final Function(ProfileSection)? onUpdateSection;
  final List<Education>? educationList;
  final List<Experience>? experienceList;
  final List<Skill>? skillsList;
  final List<Project>? projectsList;
  final List<Course>? coursesList;
  final List<Interest>? interestsList;

  const ExpandedSectionPage({
    super.key,
    required this.section,
    required this.isMyProfile,
    this.deleteResume,
    this.onUpdateSection,
    this.educationList,
    this.experienceList,
    this.skillsList,
    this.projectsList,
    this.coursesList,
    this.interestsList,
  });

  @override
  State<ExpandedSectionPage> createState() => _ExpandedSectionPageState();
}

class _ExpandedSectionPageState extends State<ExpandedSectionPage> {
  late ProfileSection _currentSection;

  @override
  void initState() {
    super.initState();
    _currentSection = ProfileSection(
      title: widget.section.title,
      content: List.from(widget.section.content),
      contentWidgets: List.from(widget.section.contentWidgets),
    );
  }

  void _addOrUpdateSection(String title, ProfileEntryWidget newEntry) {
    setState(() {
      _currentSection.content.add(newEntry);

      if (widget.onUpdateSection != null) {
        widget.onUpdateSection!(_currentSection);
      }
    });
  }

  void _editEntry(int index) {
    if (_currentSection.title == "Education" &&
        widget.educationList != null &&
        index < widget.educationList!.length) {
      final education = widget.educationList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddEducationPage(
                education: education,
                onSave: (updatedEducation) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      imageUrl: "assets/company_placeholder.png",
                      title: updatedEducation.school,
                      subtitle:
                          "${updatedEducation.degree} in ${updatedEducation.fieldOfStudy}",
                      description:
                          "From ${updatedEducation.startDate.year} to ${updatedEducation.endDate ?? 'Present'}",
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    } else if (_currentSection.title == "Experience" &&
        widget.experienceList != null &&
        index < widget.experienceList!.length) {
      final experience = widget.experienceList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddExperiencePage(
                experience: experience,
                onSave: (updatedExperience) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      imageUrl: "assets/company_placeholder.png",
                      title: updatedExperience.position,
                      subtitle: updatedExperience.company,
                      description:
                          "From ${updatedExperience.startDate.year} to ${updatedExperience.endDate?.year ?? 'Present'}",
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    } else if (_currentSection.title == "Skills" &&
        widget.skillsList != null &&
        index < widget.skillsList!.length) {
      final skill = widget.skillsList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddSkillPage(
                skill: skill,
                onSave: (updatedSkill) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      title: updatedSkill.name,
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    } else if (_currentSection.title == "Projects" &&
        widget.projectsList != null &&
        index < widget.projectsList!.length) {
      final project = widget.projectsList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddProjectPage(
                project: project,
                onSave: (updatedProject) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      title: updatedProject.name,
                      description: updatedProject.description,
                      subtitle:
                          "${updatedProject.startDate.month}/${updatedProject.startDate.year} to ${updatedProject.endDate != null ? '${updatedProject.endDate!.month}/${updatedProject.endDate!.year}' : 'Present'}",
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    } else if (_currentSection.title == "Interests" &&
        widget.interestsList != null &&
        index < widget.interestsList!.length) {
      final interest = widget.interestsList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddInterestPage(
                interest: interest,
                onSave: (updatedInterest) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      title: updatedInterest.name,
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    } else if (_currentSection.title == "Courses" &&
        widget.coursesList != null &&
        index < widget.coursesList!.length) {
      final course = widget.coursesList![index];
      Navigator.push(
        context,
        MaterialPageRoute(
          builder:
              (context) => AddCoursePage(
                course: course,
                onSave: (updatedCourse) {
                  setState(() {
                    _currentSection.content[index] = ProfileEntryWidget(
                      title: updatedCourse.name,
                      subtitle: updatedCourse.provider,
                      description:
                          updatedCourse.completionDate != null
                              ? "Completed on ${updatedCourse.completionDate!.month}/${updatedCourse.completionDate!.year}"
                              : null,
                    );

                    if (widget.onUpdateSection != null) {
                      widget.onUpdateSection!(_currentSection);
                    }
                  });
                },
              ),
        ),
      );
    }
  }

  void _deleteEntry(int index) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return CustomAlertDialog(
          title: "Delete Entry",
          description: "Are you sure you want to delete this entry?",
          confirmText: "Delete",
          onConfirm: () {
            setState(() {
              _currentSection.content.removeAt(index);

              if (widget.onUpdateSection != null) {
                widget.onUpdateSection!(_currentSection);
              }
            });
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (widget.onUpdateSection != null) {
              widget.onUpdateSection!(_currentSection);
            }
            Navigator.pop(context);
          },
        ),
        title: Text(
          _currentSection.title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions:
            widget.isMyProfile
                ? [
                  IconButton(
                    icon: const Icon(Icons.reorder),
                    onPressed: () {
                      // Handle reordering
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () {
                      if (_currentSection.title == "Education") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddEducationPage(
                                  onSave: (education) {
                                    final newEntry = ProfileEntryWidget(
                                      imageUrl:
                                          "assets/company_placeholder.png",
                                      title: education.school,
                                      subtitle:
                                          "${education.degree} in ${education.fieldOfStudy}",
                                      description:
                                          "From ${education.startDate.year} to ${education.endDate ?? 'Present'}",
                                    );
                                    _addOrUpdateSection("Education", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (_currentSection.title == "Experience") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddExperiencePage(
                                  onSave: (experience) {
                                    final newEntry = ProfileEntryWidget(
                                      imageUrl:
                                          "assets/company_placeholder.png",
                                      title: experience.position,
                                      subtitle: experience.company,
                                      description:
                                          "From ${experience.startDate.year} to ${experience.endDate?.year ?? 'Present'}",
                                    );
                                    _addOrUpdateSection("Experience", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (_currentSection.title == "Skills") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddSkillPage(
                                  onSave: (skill) {
                                    final newEntry = ProfileEntryWidget(
                                      title: skill.name,
                                    );
                                    _addOrUpdateSection("Skills", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (_currentSection.title == "Projects") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddProjectPage(
                                  onSave: (project) {
                                    final newEntry = ProfileEntryWidget(
                                      title: project.name,
                                      description: project.description,
                                    );
                                    _addOrUpdateSection("Projects", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (_currentSection.title == "Courses") {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddCoursePage(
                                  onSave: (course) {
                                    final newEntry = ProfileEntryWidget(
                                      title: course.name,
                                      subtitle: course.provider,
                                      description:
                                          course.completionDate != null
                                              ? "Completed on ${course.completionDate!.toLocal()}"
                                              : null,
                                    );
                                    _addOrUpdateSection("Courses", newEntry);
                                  },
                                ),
                          ),
                        );
                      } else if (_currentSection.title == 'Interests') {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => AddInterestPage(
                                  onSave: (interest) {
                                    final newEntry = ProfileEntryWidget(
                                      title: interest.name,
                                    );
                                    _addOrUpdateSection("Interests", newEntry);
                                  },
                                ),
                          ),
                        );
                      }
                    },
                  ),
                ]
                : null,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: SectionBuilder(
            section: _currentSection,
            isMyProfile: widget.isMyProfile,
            onUpdateSection: (updatedSection) {
              if (widget.onUpdateSection != null) {
                widget.onUpdateSection!(updatedSection);
              }
            },
            onAddEntry: () {},
            onEditEntry: widget.isMyProfile ? _editEntry : null,
            onDeleteEntry: widget.isMyProfile ? _deleteEntry : null,
          ),
        ),
      ),
    );
  }
}
