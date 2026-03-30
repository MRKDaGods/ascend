import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/Data/dummy_profile_sections.dart';

void main() {
  test('Dummy profile sections contain expected data', () {
    // Assert
    expect(sections.isNotEmpty, true);

    // Check specific section titles
    expect(sections.any((section) => section.title == 'About'), true);
    expect(sections.any((section) => section.title == 'Education'), true);
    expect(sections.any((section) => section.title == 'Experience'), true);

    // Check content of a specific section
    final aboutSection = sections.firstWhere((section) => section.title == 'About');
    expect(aboutSection.content.isNotEmpty, true);
    expect(aboutSection.content.first.description, contains('Computer Engineering student'));
  });
}