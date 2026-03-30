import 'dart:convert';

import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PremiumPlansPage extends StatefulWidget {
  const PremiumPlansPage({super.key});

  @override
  _PremiumPlansPageState createState() => _PremiumPlansPageState();
}

class _PremiumPlansPageState extends State<PremiumPlansPage> {
  List<Map<String, dynamic>> plans = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSubscriptionPlans();
  }

  void fetchSubscriptionPlans() async {
    setState(() {
      isLoading = true;
    });

    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final url = Uri.parse(
        'https://api.ascendx.tech/payment/payments/subscriptions',
      );

      final response = await http.get(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final datarr = jsonDecode(response.body);
        final datar = datarr['data'];
        final data = datar['subscription_plans'];
        print("Dataaaaaaaaaaaaaa: $data");
        setState(() {
          plans = List<Map<String, dynamic>>.from(data);
        });
      } else {
        throw Exception(
          'Failed to fetch plans: ${response.statusCode}, ${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching subscription plans: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text("Premium Plans"), centerTitle: true),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (plans.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text("Premium Plans"), centerTitle: true),
        body: Center(
          child: Text(
            "No plans available at the moment.",
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text("Premium Plans"), centerTitle: true),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Compare Plans",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Table(
              border: TableBorder.all(color: Colors.grey.shade300),
              columnWidths: {
                0: FlexColumnWidth(3),
                1: FlexColumnWidth(2),
                2: FlexColumnWidth(2),
              },
              children: [
                _buildTableRow([
                  "Feature",
                  "Basic Plan",
                  "Premium Plan",
                ], isHeader: true),
                _buildTableRow(["Messaging", "Limited", "Unlimited"]),
                _buildTableRow(["Connections", "Up to 50", "500+"]),
                _buildTableRow([
                  "Job Applications",
                  "5 per month",
                  "Unlimited",
                ]),
                _buildTableRow([
                  "Price",
                  "Free",
                  "${plans[0]['price']} ${plans[0]['currency'].toUpperCase()}",
                ]),
              ],
            ),
            SizedBox(height: 32),
            Text(
              "Available Plans",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Table(
              border: TableBorder.all(color: Colors.grey.shade300),
              columnWidths: {
                0: FlexColumnWidth(3),
                1: FlexColumnWidth(2),
                2: FlexColumnWidth(2),
              },
              children: [
                _buildTableRow(["Feature", "Price", "Action"], isHeader: true),
                ...plans.map(
                  (plan) => _buildTableRow(
                    [
                      plan['name'],
                      "${plan['price']} ${plan['currency'].toUpperCase()}",
                      "Select",
                    ],
                    onActionPressed: () {
                      print("Selected plan: ${plan['id']}");
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  TableRow _buildTableRow(
    List<String> cells, {
    bool isHeader = false,
    VoidCallback? onActionPressed,
  }) {
    return TableRow(
      children:
          cells.map((cell) {
            if (cell == "Select" && onActionPressed != null) {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: ElevatedButton(
                  onPressed: onActionPressed,
                  child: Text(cell),
                ),
              );
            } else {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  cell,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: isHeader ? FontWeight.bold : FontWeight.normal,
                    fontSize: isHeader ? 16 : 14,
                  ),
                ),
              );
            }
          }).toList(),
    );
  }
}
