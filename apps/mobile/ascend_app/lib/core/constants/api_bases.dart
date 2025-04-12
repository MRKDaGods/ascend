// API bases used throughout the application
class ApiBases {
  // Base APIBASE URL for development
  static const String APIBase = 'https://localhost';

  // Base paths
  static const String Auth_Base = '{{API_BASE}}:3001';
  static const String User_Base = '{{API_BASE}}:3002';
  static const String Notif_Base = '{{API_BASE}}:3004';
  static const String Post_Base = '{{API_BASE}}:3005';
  static const String Connection_Base = '{{API_BASE}}:3006';
  static const String Admin_Base = '{{API_BASE}}:3007';
  static const String Job_Base = '{{API_BASE}}:3008';
  static const String Company_Base = '{{API_BASE}}:3009';
  static const String Messaging_Base = '{{API_BASE}}:3010';

  //Static Auth_Token
  static const String Auth_Token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0Mjk3MDkwOSwiZXhwIjoxNzQyOTc0NTA5fQ.rWr8KyRXn0wAAmuMm0qQ5tPpjtm8kw0DoqGclckM_1E';
}
