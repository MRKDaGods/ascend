import 'dart:convert';

import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

class SubscriptionPlan {
  final String id;
  final String name;
  final String description;
  final double price;
  final String priceId;

  SubscriptionPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.priceId,
  });
  Map<String, dynamic> toMap() {
    return {'name': name, 'price': price, 'description': description};
  }

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) {
    return SubscriptionPlan(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      priceId: json['price_id'],
    );
  }
}

Future<http.Response?> postSurvey(
  String question,
  List<String> answers,
  int choice,
) async {
  final token = await SecureStorageHelper.getAuthToken();

  final headers = {
    if (token != null) 'Authorization': 'Bearer $token',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  final url = Uri.parse('https://api.ascendx.tech/payments/survey');
  final body = jsonEncode({
    "question": question,
    "answers": answers,
    "user_choice": choice,
  });
  final response = await http.post(url, headers: headers, body: body);

  _handleResponse(response);
  return response;
}

Future<List<Map<String, dynamic>>> fetchSubscriptionPlans() async {
  final token = await SecureStorageHelper.getAuthToken();

  final headers = {
    if (token != null) 'Authorization': 'Bearer $token',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  final url = Uri.parse('https://api.ascendx.tech/payments/subscriptions');

  try {
    final response = await http.get(url, headers: headers);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final datar = jsonDecode(response.body);
      final data = datar['data'];
      if (data is Map<String, dynamic> && data['subscription_plans'] is List) {
        return List<Map<String, dynamic>>.from(data['subscription_plans']);
      } else {
        throw Exception('Invalid response structure: ${response.body}');
      }
    } else {
      throw Exception(
        'Failed to fetch plans: ${response.statusCode}, ${response.body}',
      );
    }
  } catch (e) {
    print('Error fetching subscription plans: $e');
    rethrow;
  }
}

Widget _buildComparisonPage() {
  return FutureBuilder<List<SubscriptionPlan>>(
    future: fetchSubscriptionPlans().then(
      (plans) => plans.map((plan) => SubscriptionPlan.fromJson(plan)).toList(),
    ),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return Center(child: CircularProgressIndicator());
      } else if (snapshot.hasError) {
        return Text('Failed to load plans');
      }

      final plans = snapshot.data!;
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Choose your plan",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          ...plans.map(
            (plan) => ListTile(
              title: Text(plan.name),
              subtitle: Text(plan.description),
              trailing: Text("\$${plan.price.toStringAsFixed(2)}"),
              onTap: () => _startSubscriptionCheckout(context, plan.priceId),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            "Upgrade to unlock more opportunities and grow your career faster.",
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ],
      );
    },
  );
}

void _startSubscriptionCheckout(BuildContext context, String priceId) async {
  final response = await http.post(
    Uri.parse('https://your.api.url/payments/subscriptions/process'),
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      "subscription_price_id": priceId,
      "relative_return_url": "/premium/thank-you",
    }),
  );

  if (response.statusCode == 302) {
    // Handle Stripe redirect if needed
    final url = response.headers['location'];
    if (url != null) {
      // Open in browser or WebView
      launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  } else {
    final error = jsonDecode(response.body)['error'];
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
  }
}

void _handleResponse(http.Response response) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    print('Request successful: ${response.body}');
    return;
  } else {
    print('Request failed: ${response.statusCode}, ${response.body}');
    throw Exception('Error: ${response.statusCode}, ${response.body}');
  }
}
