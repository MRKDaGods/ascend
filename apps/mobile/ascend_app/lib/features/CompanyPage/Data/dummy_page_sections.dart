import '../Models/profile_section.dart';
import '../profile_entry.dart';
import 'package:flutter/material.dart';

List<ProfileSection> csections = [
  // About Section
  ProfileSection(
    title: 'About',
    content: [
      ProfileEntryWidget(
        description:
            "I am a passionate Computer Engineering student at Cairo University, "
            "with a keen interest in Flutter development, mobile applications, "
            "and software engineering. Always eager to learn and collaborate!",
      ),
    ],
  ),
  if (false)
    ProfileSection(
      title: 'Analytics',
      content: [
        ProfileEntryWidget(
          title: '5 profile views',
          subtitle: 'Discover who\'s viewed your profile.',
          icon: Icon(Icons.people), // Use an appropriate icon
        ),
        ProfileEntryWidget(
          title: '0 post impressions',
          subtitle: 'Start a post to increase engagement.',
          description: "Past 7 days",
          icon: Icon(Icons.bar_chart), // Use an appropriate icon
        ),
        ProfileEntryWidget(
          title: '8 search appearances',
          subtitle: 'See how often you appear in search results.',
          icon: Icon(Icons.search), // Use an appropriate icon,
        ),
      ],
    ),

  // Education Section
  ProfileSection(
    title: 'Education',
    content: [
      ProfileEntryWidget(
        title: 'Cairo University',
        subtitle: 'Bachelor of Engineering - Computer Engineering',
        description: 'Oct 2021 - Jun 2026\nGPA: 3.5',
        imageUrl: 'assets/cairo_university.png',
      ),
      ProfileEntryWidget(
        title: 'Pioneers Language School',
        subtitle: 'High School',
        description: 'Sep 2014 - Jun 2021',
        imageUrl: 'assets/company_placeholder.png',
      ),
      ProfileEntryWidget(
        title: 'Cairo University',
        subtitle: 'Bachelor of Engineering - Computer Engineering',
        description: 'Oct 2021 - Jun 2026\nGPA: 3.5',
        imageUrl: 'assets/cairo_university.png',
      ),
      ProfileEntryWidget(
        title: 'Cairo University',
        subtitle: 'Bachelor of Engineering - Computer Engineering',
        description: 'Oct 2021 - Jun 2026\nGPA: 3.5',
        imageUrl: 'assets/cairo_university.png',
      ),
    ],
  ),

  // Experience Section
  ProfileSection(
    title: 'Experience',
    content: [
      ProfileEntryWidget(
        title: 'Google',
        subtitle: 'Software Engineer Intern',
        description: 'June 2024 - Aug 2024\nWorked on Flutter development',
        imageUrl: 'assets/google.png',
      ),
      ProfileEntryWidget(
        title: 'Microsoft',
        subtitle: 'Student Ambassador',
        description: 'Jan 2023 - Dec 2023\nOrganized tech events and workshops',
        imageUrl: 'assets/microsoft.png',
      ),
    ],
  ),

  // Skills Section
  ProfileSection(
    title: 'Skills',
    content: [
      ProfileEntryWidget(
        title: 'Flutter',
        subtitle: 'Proficient',
        description:
            'Experienced in building cross-platform mobile applications with Flutter. '
            'Skilled in creating responsive UI, state management, and integrating APIs.',
      ),
      ProfileEntryWidget(
        title: 'Dart',
        subtitle: 'Proficient',
        description:
            'Strong understanding of Dart programming language, including asynchronous programming, '
            'object-oriented principles, and functional programming.',
      ),
      ProfileEntryWidget(
        title: 'Java',
        subtitle: 'Intermediate',
        description:
            'Hands-on experience with Java for Android development and backend services. '
            'Familiar with OOP concepts, multithreading, and data structures.',
      ),
      ProfileEntryWidget(
        title: 'Python',
        subtitle: 'Intermediate',
        description:
            'Used Python for data analysis, scripting, and automation. '
            'Familiar with libraries like NumPy, Pandas, and Matplotlib.',
      ),
      ProfileEntryWidget(
        title: 'Problem Solving',
        subtitle: 'Advanced',
        description:
            'Strong problem-solving skills demonstrated through competitive programming and algorithmic challenges. '
            'Proficient in solving complex problems using efficient algorithms and data structures.',
      ),
      ProfileEntryWidget(
        title: 'Git & Version Control',
        subtitle: 'Proficient',
        description:
            'Experienced in using Git for version control, including branching, merging, and resolving conflicts. '
            'Familiar with GitHub workflows and collaborative development.',
      ),
      ProfileEntryWidget(
        title: 'UI/UX Design',
        subtitle: 'Intermediate',
        description:
            'Capable of designing user-friendly interfaces and improving user experiences. '
            'Familiar with tools like Figma and Adobe XD.',
      ),
      ProfileEntryWidget(
        title: 'Agile Methodologies',
        subtitle: 'Intermediate',
        description:
            'Knowledgeable in Agile practices, including Scrum and Kanban. '
            'Experienced in working within Agile teams to deliver iterative and incremental solutions.',
      ),
    ],
  ),

  // Licenses & Certifications Section
  ProfileSection(
    title: 'Licenses & Certifications',
    content: [
      ProfileEntryWidget(
        title: 'Google Flutter Certification',
        subtitle: 'Google',
        description: 'Issued Jan 2024 - No Expiration Date',
        imageUrl: 'assets/google.png',
      ),
      ProfileEntryWidget(
        title: 'AWS Certified Solutions Architect',
        subtitle: 'Amazon Web Services (AWS)',
        description: 'Issued Dec 2023 - No Expiration Date',
        imageUrl: 'assets/aws.png',
      ),
    ],
  ),

  // Volunteering Section
  ProfileSection(
    title: 'Volunteering',
    content: [
      ProfileEntryWidget(
        title: 'IEEE Cairo University',
        subtitle: 'Event Organizer',
        description: 'Organized tech events and hackathons for students',
        imageUrl: 'assets/ieee.png',
      ),
      ProfileEntryWidget(
        title: 'Resala Charity Organization',
        subtitle: 'Volunteer',
        description: 'Participated in community service and charity events',
        imageUrl: 'assets/company_placeholder.png',
      ),
    ],
  ),

  // Projects Section
  ProfileSection(
    title: 'Projects',
    content: [
      ProfileEntryWidget(
        title: 'Ascend Mobile App',
        subtitle: 'Flutter Developer',
        description:
            'Developed a mobile app for professional networking using Flutter',
        imageUrl: 'assets/flutter.png',
      ),
      ProfileEntryWidget(
        title: 'E-Commerce Website',
        subtitle: 'Full-Stack Developer',
        description:
            'Built a fully functional e-commerce platform using React and Node.js',
        imageUrl: 'assets/react.png',
      ),
    ],
  ),

  // Accomplishments Section
  ProfileSection(
    title: 'Accomplishments',
    content: [
      ProfileEntryWidget(
        title: 'Hackathon Winner',
        subtitle: 'Cairo University Hackathon 2024',
        description: 'Won 1st place for developing an innovative mobile app',
        imageUrl: 'assets/cairo_university.png',
      ),
      ProfileEntryWidget(
        title: 'Dean\'s List',
        subtitle: 'Cairo University',
        description: 'Recognized for academic excellence in 2023 and 2024',
        imageUrl: 'assets/cairo_university.png',
      ),
    ],
  ),
];
