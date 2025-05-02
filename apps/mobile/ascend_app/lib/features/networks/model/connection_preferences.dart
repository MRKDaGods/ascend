// ignore_for_file: non_constant_identifier_names

class ConnectionPreferences {
  final String? user_id;
  bool? allow_connection_requests;
  String? allow_messages_from;
  bool? visible_to_public;
  bool? visible_to_connections;
  bool? visible_to_network;
  bool? show_followers;

  ConnectionPreferences({
    this.user_id,
    this.allow_connection_requests,
    this.allow_messages_from,
    this.visible_to_public,
    this.visible_to_connections,
    this.visible_to_network,
    this.show_followers,
  });

  ConnectionPreferences copyWith({
    String? user_id,
    bool? allow_connection_requests,
    String? allow_messages_from,
    bool? visible_to_public,
    bool? visible_to_connections,
    bool? visible_to_network,
    bool? show_followers,
  }) {
    return ConnectionPreferences(
      user_id: user_id ?? this.user_id,
      allow_connection_requests:
          allow_connection_requests ?? this.allow_connection_requests,
      allow_messages_from: allow_messages_from ?? this.allow_messages_from,
      visible_to_public: visible_to_public ?? this.visible_to_public,
      visible_to_connections:
          visible_to_connections ?? this.visible_to_connections,
      visible_to_network: visible_to_network ?? this.visible_to_network,
      show_followers: show_followers ?? this.show_followers,
    );
  }

  factory ConnectionPreferences.fromJson(Map<String, dynamic> json) {
    return ConnectionPreferences(
      user_id: json['user_id'],
      allow_connection_requests: json['allow_connection_requests'],
      allow_messages_from: json['allow_messages_from'],
      visible_to_public: json['visible_to_public'],
      visible_to_connections: json['visible_to_connections'],
      visible_to_network: json['visible_to_network'],
      show_followers: json['show_followers'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': user_id,
      'allow_connection_requests': allow_connection_requests,
      'allow_messages_from': allow_messages_from,
      'visible_to_public': visible_to_public,
      'visible_to_connections': visible_to_connections,
      'visible_to_network': visible_to_network,
      'show_followers': show_followers,
    };
  }
}
