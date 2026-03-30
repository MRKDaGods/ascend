class LocationModel {
  final String id;
  final String name;
  final String country;
  final String countryCode;
  final double? latitude;
  final double? longitude;

  LocationModel({
    required this.id,
    required this.name,
    required this.country,
    required this.countryCode,
    this.latitude,
    this.longitude,
  });

  factory LocationModel.fromJson(Map<String, dynamic> json) {
    return LocationModel(
      id: json['id'] ?? json['place_id']?.toString() ?? '',
      name:
          json['name'] ??
          json['display_name']?.toString().split(',').first ??
          '',
      country: json['country'] ?? json['address']?['country'] ?? '',
      countryCode:
          json['countryCode'] ??
          json['address']?['country_code']?.toUpperCase() ??
          '',
      latitude:
          json['lat'] != null ? double.tryParse(json['lat'].toString()) : null,
      longitude:
          json['lon'] != null ? double.tryParse(json['lon'].toString()) : null,
    );
  }

  @override
  String toString() {
    return country.isNotEmpty ? '$name, $country' : name;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LocationModel &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
