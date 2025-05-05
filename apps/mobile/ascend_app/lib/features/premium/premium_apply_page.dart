import 'dart:convert';

import 'package:ascend_app/features/StartPages/storage/secure_storage_helper.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:step_progress_indicator/step_progress_indicator.dart';
import 'package:url_launcher/url_launcher.dart';

class PremiumApplyPage extends StatefulWidget {
  @override
  _PremiumApplyPageState createState() => _PremiumApplyPageState();
}

class _PremiumApplyPageState extends State<PremiumApplyPage> {
  int _currentStep = 1;
  final int _totalSteps = 4;
  String priceId = "";
  int Price = 0;
  String currency = "";
  String purchaseUrl = "";
  int messagePerDay = 5;
  int jobApplications = 5;
  int connections = 50;

  final List<Map<String, bool>> _stepsOptions = [
    {"For my personal goals": false, "For my jobs": false, "Other": false},
    {
      "Grow my network": false,
      "Get hired faster": false,
      "Stand out to recruiters": false,
    },
    {
      "Explore more job posts": false,
      "Send more messages": false,
      "Track applications better": false,
    },
  ];

  bool get _isNextEnabled {
    if (_currentStep <= 3) {
      return _stepsOptions[_currentStep - 1].containsValue(true);
    }
    return true;
  }

  void _goNext() {
    if (_currentStep < _totalSteps) {
      setState(() {
        _currentStep++;
      });
    } else {
      if (purchaseUrl.isNotEmpty) {
        _launchPurchaseUrl();
      } else {
        print("Purchase URL is not available.");
      }
    }
  }

  void _launchPurchaseUrl() async {
    if (await canLaunch(purchaseUrl)) {
      await launch(purchaseUrl);
    } else {
      print("Could not launch $purchaseUrl");
    }
  }

  void fetchSubscription() async {
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
        final data = jsonDecode(response.body);
        priceId = data['data']['subscription_plans'][0]['price_id'];
        Price = data['data']['subscription_plans'][0]['price'];
        currency = data['data']['subscription_plans'][0]['currency'];
        currency = currency.toUpperCase();
      } else {
        throw Exception(
          'Failed to fetch plans: ${response.statusCode}, ${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching subscription plans: $e');
    }
  }

  void fetchserData() async {
    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final url = Uri.parse('https://api.ascendx.tech/payment/payments/usage');

      final response = await http.get(url, headers: headers);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        messagePerDay = data['data']['messages_per_day'];
        jobApplications = data['data']['job_applications_per_month'];
        connections = data['data']['connections'];
      } else {
        throw Exception(
          'Failed to fetch plans: ${response.statusCode}, ${response.body}',
        );
      }
    } catch (e) {
      print('Error fetching subscription plans: $e');
    }
  }

  void startPurchase() async {
    try {
      final token = await SecureStorageHelper.getAuthToken();
      final headers = {
        if (token != null) 'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      final url = Uri.parse(
        'https://api.ascendx.tech/payment/payments/subscriptions/process',
      );
      final body = jsonEncode({
        "subscription_price_id": priceId,
        "relative_return_url": "profile/premium/success",
      });
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        purchaseUrl = data['data']['url'];
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
    fetchSubscription();
    startPurchase();
    fetchserData();
    return Scaffold(
      appBar: AppBar(
        title: Text("Premium Onboarding"),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _currentStep = _totalSteps;
              });
            },
            child: Text("Skip"),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            StepProgressIndicator(
              totalSteps: _totalSteps,
              currentStep: _currentStep,
              selectedColor: Colors.amber,
              unselectedColor: Colors.grey.shade300,
            ),
            const SizedBox(height: 24),
            Expanded(child: SingleChildScrollView(child: _buildStepContent())),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isNextEnabled ? _goNext : null,
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    _isNextEnabled ? Colors.blue : Colors.grey.shade400,
              ),
              child: Text(
                _currentStep == _totalSteps ? "Join Premium" : "Next",
                style: TextStyle(
                  color: _isNextEnabled ? Colors.white : Colors.grey.shade700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    if (_currentStep < _totalSteps) {
      final options = _stepsOptions[_currentStep - 1];
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _getQuestionForStep(_currentStep),
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 20),
          ...options.keys.map(
            (option) => Row(
              children: [
                Checkbox(
                  value: options[option],
                  onChanged: (value) {
                    setState(() {
                      options[option] = value!;
                    });
                  },
                ),
                Text(option),
              ],
            ),
          ),
        ],
      );
    } else {
      return _buildComparisonPage();
    }
  }

  String _getQuestionForStep(int step) {
    switch (step) {
      case 1:
        return "What is your main reason for using Premium?";
      case 2:
        return "What would you like to achieve?";
      case 3:
        return "What features are most valuable to you?";
      default:
        return "";
    }
  }

  Widget _buildComparisonPage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Choose your plan",
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        Table(
          border: TableBorder.all(color: Colors.grey.shade300),
          columnWidths: {
            0: FlexColumnWidth(2),
            1: FlexColumnWidth(2),
            2: FlexColumnWidth(2),
            3: FlexColumnWidth(2),
          },
          children: [
            _buildTableRow([
              "Feature",
              "Free",
              "Premium",
              "Your Usage",
            ], isHeader: true),
            _buildTableRow(["Create profile", "✓", "✓", "✓"]),
            _buildTableRow([
              "Connections",
              "Up to 50",
              "500+",
              connections.toString(),
            ]),
            _buildTableRow([
              "Job applications/month",
              "5",
              "Unlimited",
              jobApplications.toString(),
            ]),
            _buildTableRow([
              "Messages/day",
              "5",
              "Unlimited",
              messagePerDay.toString(),
            ]),
            _buildTableRow(["Premium badge & insights", "✗", "✓", "✗"]),
            _buildTableRow(["Cost", "0", "$Price $currency", "N/A"]),
          ],
        ),
        const SizedBox(height: 20),
        Text(
          "Upgrade to unlock more opportunities and grow your career faster.",
          style: TextStyle(color: Colors.grey.shade700),
        ),
      ],
    );
  }

  TableRow _buildTableRow(List<String> cells, {bool isHeader = false}) {
    return TableRow(
      children:
          cells.map((cell) {
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
          }).toList(),
    );
  }
}
