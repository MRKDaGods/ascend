import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/location_model.dart';

abstract class LocationRepository {
  Future<List<LocationModel>> searchLocations(String query);
}

class OpenStreetMapLocationRepository implements LocationRepository {
  final String baseUrl = 'https://nominatim.openstreetmap.org/search';

  @override
  Future<List<LocationModel>> searchLocations(String query) async {
    if (query.isEmpty) {
      return [];
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl?q=$query&format=json&addressdetails=1&limit=10'),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AscendApp/1.0', // Required by Nominatim API
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => LocationModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load locations: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error searching locations: $e');
    }
  }
}

// Mock repository for testing or offline development
class MockLocationRepository implements LocationRepository {
  final List<LocationModel> _mockLocations = [
    LocationModel(
      id: '1',
      name: 'New York',
      country: 'United States',
      countryCode: 'US',
      latitude: 40.7128,
      longitude: -74.0060,
    ),
    LocationModel(
      id: '2',
      name: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      latitude: 51.5074,
      longitude: -0.1278,
    ),
    LocationModel(
      id: '3',
      name: 'Paris',
      country: 'France',
      countryCode: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
    ),
    LocationModel(
      id: '4',
      name: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      latitude: 35.6762,
      longitude: 139.6503,
    ),
    LocationModel(
      id: '5',
      name: 'Sydney',
      country: 'Australia',
      countryCode: 'AU',
      latitude: -33.8688,
      longitude: 151.2093,
    ),
    LocationModel(
      id: '6',
      name: 'Berlin',
      country: 'Germany',
      countryCode: 'DE',
      latitude: 52.5200,
      longitude: 13.4050,
    ),
    LocationModel(
      id: '7',
      name: 'San Francisco',
      country: 'United States',
      countryCode: 'US',
      latitude: 37.7749,
      longitude: -122.4194,
    ),
  ];

  @override
  Future<List<LocationModel>> searchLocations(String query) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));

    if (query.isEmpty) {
      return _mockLocations;
    }

    final lowercaseQuery = query.toLowerCase();
    return _mockLocations.where((location) {
      return location.name.toLowerCase().contains(lowercaseQuery) ||
          location.country.toLowerCase().contains(lowercaseQuery);
    }).toList();
  }
}

// Provider for repository
class LocationRepositoryProvider {
  //static final LocationRepository _instance = MockLocationRepository();
  // Use this for real API calls:
  static final LocationRepository _instance = OpenStreetMapLocationRepository();

  static LocationRepository getRepository() {
    return _instance;
  }
}
