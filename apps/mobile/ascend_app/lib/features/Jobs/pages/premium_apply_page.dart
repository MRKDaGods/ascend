import 'package:flutter/material.dart';
import 'package:step_progress_indicator/step_progress_indicator.dart';

class PremiumApplyPage extends StatefulWidget {
  @override
  _PremiumApplyPageState createState() => _PremiumApplyPageState();
}

class _PremiumApplyPageState extends State<PremiumApplyPage> {
  int _currentStep = 1;
  final Map<String, bool> _options = {
    "For my personal goals": false,
    "For my jobs": false,
    "Other": false,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Premium Apply"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text("Skip", style: TextStyle()),
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            StepProgressIndicator(
              totalSteps: 6,
              currentStep: _currentStep,
              selectedColor: Colors.amber,
              unselectedColor: Colors.grey,
            ),
            SizedBox(height: 20),
            Expanded(child: _buildStepContent()),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _options.containsValue(true) ? () {} : null,
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    _options.containsValue(true) ? Colors.blue : Colors.grey,
              ),
              child: Text("Next"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Which of these best describes your primary goal for using premium?",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 18),
        ),
        SizedBox(height: 20),
        ..._options.keys
            .map(
              (option) => buildCheckboxOption(option, _options, (key, value) {
                setState(() {
                  _options[key] = value;
                });
              }),
            )
            .toList(),
      ],
    );
  }
}

Widget buildCheckboxOption(
  String title,
  Map<String, bool> options,
  Function(String, bool) onChanged,
) {
  return Row(
    children: [
      Checkbox(
        value: options[title],
        onChanged: (value) {
          onChanged(title, value!);
        },
      ),
      Text(title),
    ],
  );
}
