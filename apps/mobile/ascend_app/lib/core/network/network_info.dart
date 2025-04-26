import 'package:internet_connection_checker/internet_connection_checker.dart';

/// Abstract class for network information
abstract class NetworkInfo {
  /// Checks if the device is connected to the internet
  Future<bool> get isConnected;
}

/// Implementation of [NetworkInfo] using [InternetConnectionChecker]
class NetworkInfoImpl implements NetworkInfo {
  final InternetConnectionChecker connectionChecker;
  
  NetworkInfoImpl(this.connectionChecker);
  
  @override
  Future<bool> get isConnected => connectionChecker.hasConnection;
}