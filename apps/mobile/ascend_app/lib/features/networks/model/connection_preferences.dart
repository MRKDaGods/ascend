class ConnectionPreferences {
  bool? allow_connection_requests;
  String? allow_message_requests;
  bool? visible_to_public;
  bool? visible_to_connections;
  bool? visible_to_network;

  ConnectionPreferences({
    this.allow_connection_requests,
    this.allow_message_requests,
    this.visible_to_public,
    this.visible_to_connections,
    this.visible_to_network,
  });

  ConnectionPreferences copyWith({
    bool? allow_connection_requests,
    String? allow_message_requests,
    bool? visible_to_public,
    bool? visible_to_connections,
    bool? visible_to_network,
  }) {
    return ConnectionPreferences(
      allow_connection_requests:
          allow_connection_requests ?? this.allow_connection_requests,
      allow_message_requests:
          allow_message_requests ?? this.allow_message_requests,
      visible_to_public: visible_to_public ?? this.visible_to_public,
      visible_to_connections:
          visible_to_connections ?? this.visible_to_connections,
      visible_to_network: visible_to_network ?? this.visible_to_network,
    );
  }

  factory ConnectionPreferences.fromJson(Map<String, dynamic> json) {
    return ConnectionPreferences(
      allow_connection_requests: json['allow_connection_requests'],
      allow_message_requests: json['allow_message_requests'],
      visible_to_public: json['visible_to_public'],
      visible_to_connections: json['visible_to_connections'],
      visible_to_network: json['visible_to_network'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'allow_connection_requests': allow_connection_requests,
      'allow_message_requests': allow_message_requests,
      'visible_to_public': visible_to_public,
      'visible_to_connections': visible_to_connections,
      'visible_to_network': visible_to_network,
    };
  }
}
