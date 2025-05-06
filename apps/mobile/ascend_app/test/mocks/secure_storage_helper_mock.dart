import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter/material.dart';

class MockSecureStorageHelper extends Mock implements SecureStorageHelper {
  @override
  Future<String?> getUserId() async => 'test-user-id';

  @override
  Future<String?> getAuthToken() async => 'test-auth-token';

  @override
  Future<dynamic> getBox(String boxName) async => {};

  @override
  Future<void> setUserId(String userId) async {}

  @override
  Future<void> setAuthToken(String token) async {}
}

class SecureStorageHelperMock {
  static final MockSecureStorageHelper mock = MockSecureStorageHelper();

  static void setupMocks() {
    // Instead of trying to use when() with the overridden methods,
    // we rely on the implementation in the MockSecureStorageHelper class

    // No need to use when() here as we've already overridden the methods
    // in the MockSecureStorageHelper class with concrete implementations
  }

  static void setMockInstance(MockSecureStorageHelper mockSecureStorageHelper) {
    // We can't directly set an instance field if it doesn't exist
    // Instead, we'll need to use a provider pattern or dependency injection
    // in the test to make the widget use our mock
  }

  static void resetMocks() {
    // Reset all interactions on the mock
    reset(mock);
  }
}
