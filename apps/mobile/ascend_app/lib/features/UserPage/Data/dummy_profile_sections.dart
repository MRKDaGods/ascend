import '../models/profile_section.dart';
import '../profile_entry.dart';

List<ProfileSection> sections = [
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
  ProfileSection(
    title: 'Education',
    content: [
      ProfileEntryWidget(
        title: 'Cairo University',
        subtitle: 'Bachelor of Engineering - Computer Engineering',
        description: 'Oct 2021 - Jun 2026\nGPA: 3.5',
        imageUrl: 'assets/microsoft.png',
      ),
      ProfileEntryWidget(
        title: 'Pioneers Language School',
        subtitle: 'High School',
        description: 'Sep 2014 - Jun 2021',
        imageUrl: 'assets/microsoft.png',
      ),
    ],
  ),
  ProfileSection(
    title: 'Experience',
    content: [
      ProfileEntryWidget(
        title: 'Google',
        subtitle: 'Software Engineer Intern',
        description: 'June 2024 - Aug 2024\nWorked on Flutter development',
        imageUrl: 'assets/google.png',
      ),
    ],
  ),
  ProfileSection(
    title: 'Skills',
    content: [
      ProfileEntryWidget(title: 'Flutter'),
      ProfileEntryWidget(title: 'Dart'),
      ProfileEntryWidget(title: 'Java'),
    ],
  ),
];
