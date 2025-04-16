import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ascend_app/features/UserPage/user_page.dart';
import 'package:ascend_app/features/UserPage/profile_main_images.dart';
import 'package:ascend_app/features/UserPage/profile_header.dart';
import 'dart:io';

class TestHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}

void main() {
  setUpAll(() {
    HttpOverrides.global = TestHttpOverrides();
  });

  testWidgets('UserProfilePage displays profile details and sections', (
    WidgetTester tester,
  ) async {
    // Arrange
    const name = 'Maged Amgad';
    const bio = 'Computer engineering student at Cairo University';

    await tester.pumpWidget(
      MaterialApp(
        home: UserProfilePage(
          name: name,
          bio: bio,
          location: 'Cairo, Egypt',
          latestEducation: 'Cairo University',
          sections: const [],
          isconnect: false,
          isfollow: false,
          isPending: true,
          connections: 15,
          verified: true,
          degree: '1st',
          mutualConnections: const [],
          links: const [],
        ),
      ),
    );

    // Assert
    expect(find.text(name), findsOneWidget);
    expect(find.text(bio), findsOneWidget);
    expect(find.byType(ProfileMainImages), findsOneWidget);
    expect(find.byType(ProfileHeader), findsOneWidget);
  });
}
