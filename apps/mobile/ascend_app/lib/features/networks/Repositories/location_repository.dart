import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ascend_app/features/networks/model/location_model.dart';

abstract class LocationRepository {
  Future<List<LocationModel>> searchLocations(
    String query, {
    int page = 1,
    int pageSize = 10,
  });
}

class OpenStreetMapLocationRepository implements LocationRepository {
  final String baseUrl = 'https://nominatim.openstreetmap.org/search';

  @override
  Future<List<LocationModel>> searchLocations(
    String query, {
    int page = 1,
    int pageSize = 10,
  }) async {
    if (query.isEmpty) {
      return [];
    }

    try {
      final response = await http.get(
        Uri.parse(
          '$baseUrl?q=$query&format=json&addressdetails=1&limit=$pageSize&offset=${(page - 1) * pageSize}',
        ),
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

class LocationRepoisitoryProvider {
  static LocationRepository getRepository() {
    return OpenStreetMapLocationRepository();
  }
}
