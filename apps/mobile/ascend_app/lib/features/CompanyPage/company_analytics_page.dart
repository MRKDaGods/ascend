import 'package:flutter/material.dart';
import '../../core/di/dependency_injection.dart';
import 'dart:convert';

class CompanyAnalyticsPage extends StatefulWidget {
  final int companyId;

  const CompanyAnalyticsPage({required this.companyId, Key? key})
    : super(key: key);

  @override
  _CompanyAnalyticsPageState createState() => _CompanyAnalyticsPageState();
}

class _CompanyAnalyticsPageState extends State<CompanyAnalyticsPage> {
  Map<String, dynamic>? analyticsData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAnalytics();
  }

  Future<void> _fetchAnalytics() async {
    try {
      final endpoint = '/company/companies/${widget.companyId}/analytics';
      final response = await ServiceLocator().apiClient.get(endpoint);
      final data = jsonDecode(response.body)['data']['analytics'];
      print("analytics data: $data");
      setState(() {
        analyticsData = data;
        isLoading = false;
      });
    } catch (e) {
      debugPrint('Error fetching analytics: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Company Analytics'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context); // Navigate back to the member view
          },
        ),
      ),
      body:
          isLoading
              ? Center(child: CircularProgressIndicator())
              : analyticsData == null
              ? Center(child: Text('Failed to load analytics'))
              : Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView(
                  children: [
                    _buildSummarySection(),
                    const SizedBox(height: 20),
                    _buildJobAnalyticsSection(),
                  ],
                ),
              ),
    );
  }

  Widget _buildSummarySection() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Company Summary',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _buildSummaryRow(
              'Number of Job Applications',
              analyticsData!['number_of_job_applications']?.toString() ?? '0',
            ),
            _buildSummaryRow(
              'Number of Job Posts',
              analyticsData!['number_of_job_posts']?.toString() ?? '0',
            ),
            _buildSummaryRow(
              'Number of Followers',
              analyticsData!['number_of_followrs']?.toString() ??
                  '0', // Corrected field name
            ),
            _buildSummaryRow(
              'Number of Announcements',
              analyticsData!['number_of_announcements']?.toString() ?? '0',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 16)),
          Text(
            value,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildJobAnalyticsSection() {
    final jobAnalytics =
        analyticsData!['job_application_analytics'] as List<dynamic>;
    if (jobAnalytics.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text(
          'No job analytics available.',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      );
    }
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Job Analytics',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            ...jobAnalytics.map((jobData) {
              final jobMap = jobData as Map<String, dynamic>;
              return _buildJobCard(jobMap);
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildJobCard(Map<String, dynamic> jobData) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              jobData['name'] ?? 'Unnamed Job',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _buildSummaryRow('Pending', jobData['pending'].toString()),
            _buildSummaryRow('Viewed', jobData['viewed'].toString()),
            _buildSummaryRow('Accepted', jobData['accepted'].toString()),
            _buildSummaryRow('Rejected', jobData['rejected'].toString()),
          ],
        ),
      ),
    );
  }
}
