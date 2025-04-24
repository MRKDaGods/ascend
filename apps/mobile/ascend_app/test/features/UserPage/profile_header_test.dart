import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/profile_header.dart';

void main() {
  testWidgets('ProfileHeader displays name, bio, and location', (
    WidgetTester tester,
  ) async {
    // Arrange
    const name = 'Maged Amgad';
    const bio = 'Computer engineering student at Cairo University';
    const location = 'Cairo, Egypt';

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ProfileHeader(
            name: name,
            verified: true,
            degree: '1st',
            bio: bio,
            location: location,
            latestEducation: 'Cairo University',
            connections: 15,
            isconnect: false,
            isPending: false,
            mutualConnections: const [],
            links: const [],
            isMyProfile: false,
          ),
        ),
      ),
    );

    // Assert
    expect(find.text(name), findsOneWidget);
    expect(find.text(bio), findsOneWidget);
    expect(find.text(location), findsOneWidget);
    expect(
      find.byIcon(Icons.gpp_good_outlined),
      findsOneWidget,
    ); // Verified icon
  });
}
