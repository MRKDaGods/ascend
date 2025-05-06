import 'package:ascend_app/features/StartPages/Bloc/bloc/auth_bloc.dart';
import 'package:ascend_app/features/admin/bloc/analytics/bloc/analytics_bloc.dart';
import 'package:ascend_app/features/admin/data/services/admin_api_client.dart';
import 'package:ascend_app/features/admin/data/services/user_api_client.dart';
import 'package:ascend_app/features/admin/repository/admin_repository.dart';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AnalyticsPage extends StatefulWidget {
  const AnalyticsPage({super.key});

  @override
  State<AnalyticsPage> createState() => _AnalyticsPageState();
}

class _AnalyticsPageState extends State<AnalyticsPage> {
  String selectedDuration = 'day';

  Widget buildStatCard(String title, int value, Color color) {
    double percent = value > 0 ? (value / 100).clamp(0.1, 1.0) : 0.05;

    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 60,
              height: 60,
              child: PieChart(
                PieChartData(
                  startDegreeOffset: -90,
                  sectionsSpace: 1,
                  centerSpaceRadius: 18,
                  sections: [
                    PieChartSectionData(
                      color: color,
                      value: percent,
                      radius: 10,
                      showTitle: false,
                    ),
                    PieChartSectionData(
                      color: Colors.grey.shade200,
                      value: 1 - percent,
                      radius: 10,
                      showTitle: false,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              '$value',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.read<AuthBloc>().state;

    // Debug the current state of AuthBloc
    debugPrint('AuthBloc State: $authState');

    // Proceed with the rest of the widget
    return BlocProvider(
      create:
          (context) => AnalyticsBloc(
            repository: AdminRepository(
              apiClient: AdminApiClient(
                baseUrl: 'https://api.ascendx.tech/admin',
              ),
              userApiClient: UserApiClient(
                baseUrl: 'https://api.ascendx.tech/user',
              ),
            ),
          )..add(const FetchAnalyticsEvent('day')), // Default duration
      child: BlocBuilder<AnalyticsBloc, AnalyticsState>(
        builder: (context, state) {
          return Scaffold(
            body: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Analytics Overview',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      DropdownButton<String>(
                        value:
                            [
                                  'day',
                                  'Week',
                                  'Month',
                                  'Year',
                                ].contains(selectedDuration)
                                ? selectedDuration
                                : 'day', // Fallback to a default value if mismatch occurs
                        items:
                            ['day', 'Week', 'Month', 'Year']
                                .map(
                                  (duration) => DropdownMenuItem(
                                    value: duration,
                                    child: Text(duration),
                                  ),
                                )
                                .toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() {
                              selectedDuration = value;
                            });
                            context.read<AnalyticsBloc>().add(
                              FetchAnalyticsEvent(value.toLowerCase()),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: Builder(
                      builder: (context) {
                        if (state is AnalyticsLoading) {
                          return const Center(
                            child: CircularProgressIndicator(),
                          );
                        } else if (state is AnalyticsLoaded) {
                          final analyticsData =
                              state.analyticsData.entries.toList();
                          final colors = [
                            Colors.blue,
                            Colors.red,
                            Colors.green,
                            Colors.orange,
                            Colors.purple,
                            Colors.teal,
                            Colors.yellow,
                          ]; // Define a list of colors

                          return GridView.count(
                            crossAxisCount: 2,
                            children:
                                analyticsData.asMap().entries.map((entry) {
                                  final index = entry.key;
                                  final data = entry.value;
                                  final color =
                                      colors[index %
                                          colors
                                              .length]; // Cycle through colors
                                  return buildStatCard(
                                    data.key,
                                    data.value,
                                    color,
                                  );
                                }).toList(),
                          );
                        } else if (state is AnalyticsError) {
                          return Center(
                            child: Text('Error: ${state.errorMessage}'),
                          );
                        }
                        return const Center(
                          child: Text('Select a duration to fetch analytics.'),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
