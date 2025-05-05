import 'dart:convert';

import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// ignore: must_be_immutable
class ManagePurchasePage extends StatelessWidget {
  String subscriptionPlan; // Example subscription plan
  String firstPaymentDate;
  double amountPaid;
  String currency;
  int subscriptionId = 0;

  ManagePurchasePage({
    super.key,
    this.subscriptionPlan = "Basic Plan",
    this.firstPaymentDate = "2023-10-01",
    this.amountPaid = 9.99,
    this.currency = "USD",
  });
  void getDetails() async {
    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final url = Uri.parse(
        'https://api.ascendx.tech/payment/payments/subscriptions/purchased',
      );

      final response = await http.get(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        subscriptionPlan = data['data']['subscription_plan'];
        firstPaymentDate = data['data']['first_payment_date'];
        amountPaid = data['data']['amount_paid'];
        currency = data['data']['currency'];
        currency = currency.toUpperCase();
        subscriptionId = data['data']['subscription_id'];
        print("Dataaaaaaaaaaaaaa: $data");
      } else {
        throw Exception(
          'Failed to fetch plans: ${response.statusCode}, ${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching subscription plans: $e');
    }
  }

  void cancelSubscription() async {
    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final url = Uri.parse(
        'https://api.ascendx.tech/payment/payments/subscriptions/$subscriptionId',
      );

      final response = await http.delete(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);

        print("Dataaaaaaaaaaaaaa: $data");
      } else {
        throw Exception(
          'Failed to fetch plans: ${response.statusCode}, ${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching subscription plans: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    getDetails();
    return Scaffold(
      appBar: AppBar(title: Text('Manage Purchase')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Subscription Plan:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text(subscriptionPlan, style: TextStyle(fontSize: 16)),
              SizedBox(height: 16),
              Text(
                'First Payment Date:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text(firstPaymentDate, style: TextStyle(fontSize: 16)),
              SizedBox(height: 16),
              Text(
                'Amount Paid:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text('$amountPaid $currency', style: TextStyle(fontSize: 16)),
              Spacer(),
              ElevatedButton(
                onPressed: () {
                  // Add cancel subscription logic here
                  showDialog(
                    context: context,
                    builder:
                        (context) => AlertDialog(
                          title: Text('Cancel Subscription'),
                          content: Text(
                            'Are you sure you want to cancel your subscription?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: Text('No'),
                            ),
                            TextButton(
                              onPressed: () {
                                // Add confirmation logic here
                                Navigator.pop(context);
                                cancelSubscription();
                              },
                              child: Text('Yes'),
                            ),
                          ],
                        ),
                  );
                },
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                child: Text('Cancel Subscription'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
