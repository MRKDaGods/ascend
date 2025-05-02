import "dart:async";
import 'dart:io';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import "package:flutter/foundation.dart";
import "package:socket_io_client/socket_io_client.dart" as io;

enum ConnectionState {
  disconnected,
  connecting,
  connected,
  registered,
  registrationFailed,
}

class WebSocketService {
  static final WebSocketService _instance = WebSocketService._internal();
  factory WebSocketService() => _instance;
  WebSocketService._internal();

  // Socket.io client
  io.Socket? _socketClient;

  // Connection status
  bool _isConnected = false;
  bool _isRegistered = false;
  bool get isConnected => _isConnected;
  bool get isRegistered => _isRegistered;

  // Stream Controller for messages
  final StreamController<Map<String, dynamic>> _messageController =
      StreamController.broadcast();
  Stream<Map<String, dynamic>> get messageStream => _messageController.stream;

  // Stream Controller for connection status
  final StreamController<ConnectionState> _connectionStatusController =
      StreamController.broadcast();
  Stream<ConnectionState> get connectionStatusStream =>
      _connectionStatusController.stream;

  // Stream Controller for typing events
  final StreamController<Map<String, bool>> _typingStatusController =
      StreamController.broadcast();
  Stream<Map<String, bool>> get typingStatusStream =>
      _typingStatusController.stream;

  // Stream controller for read receipts
  final StreamController<Map<String, bool>> _readReceiptController =
      StreamController.broadcast();
  Stream<Map<String, bool>> get readReceiptStream =>
      _readReceiptController.stream;

  //Reconnection attempts
  bool _reconnectEnabled = true;
  int _reconnectAttempts = 0;
  final int _maxReconnectAttempts = 5;
  static final Duration _reconnectDelay = const Duration(seconds: 3);
  Timer? _reconnectTimer;
  Timer? _registrationTimer;

  // Typing State indicator
  final Map<String, DateTime> _typingUsers = {};

  // Add this method to your WebSocketService class
  Future<void> checkServerTlsInfo(String host, int port) async {
    try {
      debugPrint('🔒 Testing TLS connection to $host:$port');

      // Create a secure socket connection
      final socket = await SecureSocket.connect(
        host,
        port,
        onBadCertificate: (certificate) {
          debugPrint('🔒 Certificate details:');
          debugPrint('   - Subject: ${certificate.subject}');
          debugPrint('   - Issuer: ${certificate.issuer}');
          debugPrint('   - Start Validity: ${certificate.startValidity}');
          debugPrint('   - End Validity: ${certificate.endValidity}');
          return true; // Accept any certificate
        },
        timeout: Duration(seconds: 10),
      );

      // Get connection info
      debugPrint('🔒 TLS Connection established:');
      debugPrint('   - Protocol: ${socket.selectedProtocol}');

      // Close connection
      await socket.close();
      debugPrint('🔒 Connection closed successfully');
    } catch (e) {
      debugPrint('🔒 TLS connection error: $e');

      // Extract TLS version from error message
      if (e.toString().contains('WRONG_VERSION_NUMBER')) {
        debugPrint(
          '🔒 TLS Error: Server might be using an incompatible TLS version',
        );
        debugPrint(
          '   Try connecting with a different TLS version or use HTTP instead',
        );
      }
    }
  }

  void debugSocketConnection() {
    debugPrint('===== SOCKET CONNECTION DEBUG =====');
    debugPrint('Socket client initialized: ${_socketClient != null}');
    if (_socketClient != null) {
      debugPrint('Socket connected: ${_socketClient!.connected}');
      debugPrint('Our tracked connected state: $_isConnected');
      debugPrint('Socket ID: ${_socketClient!.id}');
      debugPrint('Socket options: ${_socketClient!.io.toString()}');
    }
    debugPrint('==================================');
  }

  // Connect to WebSocket Server
  Future<bool> connect(String url, String authToken) async {
    try {
      // Close existing channel if any
      await disconnect();

      _connectionStatusController.add(ConnectionState.connecting);

      // Setup socket client with appropriate options
      _socketClient = io.io(
        url,
        io.OptionBuilder()
            .setTransports(['websocket', 'polling']) // Use WebSocket transport
            .enableForceNew()
            .disableAutoConnect()
            .build(),
      );

      // Set up event listeners BEFORE connecting
      _setupSocketListeners();

      // Create a completer to wait for connection
      final Completer<bool> connectionCompleter = Completer<bool>();

      // Add one-time listeners for connection success or failure
      _socketClient!.once('connect', (_) {
        debugPrint('Socket.IO connected successfully');
        _isConnected = true;
        connectionCompleter.complete(true);
      });

      _socketClient!.once('connect_error', (error) {
        debugPrint('Socket.IO connect_error: $error');
        connectionCompleter.complete(false);
      });

      // Connect to the server
      debugPrint('Initiating Socket.IO connection to $url');
      _socketClient!.connect();

      // Wait for connection with timeout
      bool connected = await connectionCompleter.future.timeout(
        Duration(seconds: 10),
        onTimeout: () {
          debugPrint('Socket.IO connection timeout');
          return false;
        },
      );

      debugSocketConnection(); // Debugging connection status
      return connected;
    } catch (e) {
      debugPrint('Error connecting to WebSocket: $e');
      _connectionStatusController.add(ConnectionState.disconnected);
      _handleConnectionError();
      return false;
    }
  }

  // Set up socket event listeners
  void _setupSocketListeners() {
    _socketClient?.onConnect((_) {
      debugPrint('connected to WebSocket server');

      _isConnected = true;
      _connectionStatusController.add(ConnectionState.connected);
      _reconnectAttempts =
          0; // Reset reconnect attempts on successful connection
      _reconnectTimer?.cancel(); // Cancel any existing reconnect timer

      _sendRegistrationEvent();
    });

    _socketClient?.onDisconnect((_) {
      debugPrint('Disconnected from WebSocket server');
      _isConnected = false;
      _connectionStatusController.add(ConnectionState.disconnected);
      _handleConnectionClosed();
    });

    _socketClient?.onError((error) {
      debugPrint('WebSocket error: $error');
      _connectionStatusController.add(ConnectionState.disconnected);
      _handleConnectionError();
    });

    // handle registered
    _socketClient?.on('registered', (data) {
      _handleRegistered(data);
    });

    // handle Error
    _socketClient?.on('error', (data) {
      _handleError(data);
    });

    // handle message read receipt
    _socketClient?.on('message:read', (data) {
      _handleReadReceiptEvent(data);
    });

    // handle typing event
    _socketClient?.on('typing', (data) {
      _handleTypingEvent(data);
    });

    // handle message received
    _socketClient?.on('message:receive', (data) {
      _messageController.add({'event': 'message:receive', 'data': data});
    });

    // handle if I can't connect to the server
    _socketClient?.onConnectError((error) {
      debugPrint('WebSocket connection error: $error');
      _connectionStatusController.add(ConnectionState.disconnected);
      _handleConnectionError();
    });

    // debugging
    _socketClient?.onAny((event, data) {
      debugPrint('WebSocket event: $event, data: $data');
    });
  }

  // Set a timeout for registration response
  void _setRegistrationTimeout() {
    _registrationTimer?.cancel();
    _registrationTimer = Timer(Duration(seconds: 10), () {
      if (!_isRegistered) {
        debugPrint('WebSocket registration timed out');
        _connectionStatusController.add(ConnectionState.registrationFailed);
        disconnect();
      }
    });
  }

  // send registration event
  void _sendRegistrationEvent() async {
    _setRegistrationTimeout();

    final authToken = await SecureStorageHelper.getAuthToken();
    if (authToken == null) {
      debugPrint('No auth token available for registration');
      _connectionStatusController.add(ConnectionState.registrationFailed);
      disconnect();
      return;
    }

    debugPrint('Sending registration with token length: ${authToken.length}');

    // Send auth token as a simple string - this is what your server expects
    _socketClient?.emit('register', authToken);
  }

  // Handle registration event
  void _handleRegistered(dynamic data) {
    debugPrint('WebSocket registered successfully: $data');
    _isRegistered = true;
    _registrationTimer?.cancel(); // Cancel the registration timeout
    _connectionStatusController.add(ConnectionState.registered);
    _registrationTimer?.cancel(); // Cancel the registration timeout

    //Extract userId from the data
    //final userId = data['userId'];
    //if (userId != null) {
    //debugPrint('User ID not found in registration data');
    //}
  }

  // Handle typing events
  void _handleTypingEvent(dynamic data) {
    try {
      String? conversationId;

      // Handle different data formats
      if (data is Map<String, dynamic>) {
        conversationId = data['conversationId']?.toString();
      } else if (data is Map) {
        conversationId = data['conversationId']?.toString();
      } else if (data is String) {
        // Try to parse as JSON
        try {
          final parsed = jsonDecode(data);
          conversationId = parsed['conversationId']?.toString();
        } catch (_) {
          conversationId = data;
        }
      }

      if (conversationId == null || conversationId.isEmpty) {
        debugPrint('Invalid typing event data: $data');
        return;
      }

      final DateTime now = DateTime.now();
      _typingUsers[conversationId] = now;

      // Auto-expire typing indicator after 3 seconds
      Future.delayed(Duration(seconds: 3), () {
        final lastTypingTime = _typingUsers[conversationId];
        if (lastTypingTime != null && lastTypingTime == now) {
          _typingUsers.remove(conversationId);
          _typingStatusController.add({'conversationId': false});
        }
      });

      // Broadcast typing event locally
      _typingStatusController.add({conversationId: true});
    } catch (e) {
      debugPrint('Error handling typing event: $e');
    }
  }

  // Handle read receipt event
  void _handleReadReceiptEvent(dynamic data) {
    try {
      String? conversationId;

      // Handle different data formats
      if (data is Map<String, dynamic>) {
        conversationId = data['conversationId']?.toString();
      } else if (data is Map) {
        conversationId = data['conversationId']?.toString();
      } else if (data is String) {
        // Try to parse as JSON
        try {
          final parsed = jsonDecode(data);
          conversationId = parsed['conversationId']?.toString();
        } catch (_) {
          conversationId = data;
        }
      }

      if (conversationId == null || conversationId.isEmpty) {
        debugPrint('Invalid read receipt event data: $data');
        return;
      }

      // Broadcast read receipt event locally
      _readReceiptController.add({conversationId: true});
    } catch (e) {
      debugPrint('Error handling read receipt event: $e');
    }
  }

  // send Message
  void sendMessage(Map<String, dynamic> data) {
    if (!_isConnected || _socketClient == null) {
      debugPrint('WebSocket is not connected. Cannot send message.');
      return;
    }

    final String event = data['event'] ?? 'message';
    final String payload = data['data'] ?? '';

    _socketClient?.emit(event, payload);
    debugPrint('Message sent: $event, $payload');
  }

  // Send typing notfication
  Future<void> sendTypingNotification(String conversationId) async {
    if (!_isConnected || _socketClient == null || !_isRegistered) {
      debugPrint(
        'WebSocket is not connected. Cannot send typing notification.',
      );
      return;
    }

    final Map<String, dynamic> data = {'conversationId': conversationId};

    _socketClient?.emit('typing', data);
    debugPrint('Typing notification sent: $data');
  }

  // Mark message as read
  Future<void> markMessageAsRead(String conversationId) async {
    if (!_isConnected || _socketClient == null || !_isRegistered) {
      debugPrint('WebSocket is not connected. Cannot mark message as read.');
      return;
    }

    final Map<String, dynamic> data = {'conversationId': conversationId};

    _socketClient?.emit('message:read', data);
    debugPrint('Message marked as read: $data');
  }

  // Handle connection error
  void _handleConnectionError() {
    if (_reconnectEnabled) {
      _scheduleReconnect();
    }
  }

  void _handleConnectionClosed() {
    if (_reconnectEnabled) {
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    // cancel any existing timer
    _reconnectTimer?.cancel();

    // check if reconnection is enabled
    if (_reconnectEnabled) {
      _reconnectAttempts++;
      if (_reconnectAttempts <= _maxReconnectAttempts) {
        debugPrint('Attempting to reconnect... ($_reconnectAttempts)');
        _reconnectTimer = Timer(_reconnectDelay, () async {
          debugPrint('Attempting to reconnect to WebSocket...');

          // Get server URL and fresh auth token
          final authToken = await SecureStorageHelper.getAuthToken();
          final serverUrl =
              'https://ascendx.germanywestcentral.cloudapp.azure.com/';

          if (authToken != null && serverUrl.isNotEmpty) {
            // Try to reconnect with the fresh token
            await connect(serverUrl, authToken);
          }
        });
      } else {
        debugPrint('Max reconnect attempts reached. Giving up.');
      }
    }
  }

  // Disconnect from WebSocket
  Future<void> disconnect() async {
    _reconnectEnabled = false;
    _reconnectTimer?.cancel();
    _registrationTimer?.cancel();

    if (_socketClient != null) {
      _socketClient!.disconnect();
      _socketClient = null;
    }

    _isConnected = false;
    _isRegistered = false;
    _connectionStatusController.add(ConnectionState.disconnected);
  }

  // Get typing users for a conversation - since we don't have userIds, this isn't useful

  bool hasTypingActivity(String conversationId) {
    return _typingUsers.containsKey(conversationId);
  }

  // Check if anyone is typing in a conversation
  bool isAnyoneTyping(String conversationId) {
    return _typingUsers.containsKey(conversationId);
  }

  // Handle error event
  void _handleError(dynamic data) {
    debugPrint('WebSocket error: $data');

    // Handle different data formats
    String errorMessage = "Unknown error";

    if (data is Map<String, dynamic>) {
      errorMessage = data['message'] ?? "Unknown error";
    } else if (data is String) {
      errorMessage = data;
    }

    debugPrint('Error message: $errorMessage');

    // Handle specific error types
    if (errorMessage.contains('Authentication failed')) {
      _isRegistered = false;
      _connectionStatusController.add(ConnectionState.registrationFailed);
    }
  }

  void dispose() {
    _socketClient?.dispose();
    _messageController.close();
    _connectionStatusController.close();
    _typingStatusController.close();
    _readReceiptController.close();
  }
}
