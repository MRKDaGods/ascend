import 'package:ascend_app/features/home/presentation/pages/scheduled_posts_page.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Add intl package to pubspec.yaml

class SchedulePostBottomSheet extends StatefulWidget {
  final Function(DateTime?) onScheduleConfirmed;

  const SchedulePostBottomSheet({
    super.key,
    required this.onScheduleConfirmed,
  });

  @override
  State<SchedulePostBottomSheet> createState() => _SchedulePostBottomSheetState();
}

class _SchedulePostBottomSheetState extends State<SchedulePostBottomSheet> {
  DateTime? _selectedDateTime;
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Optionally pre-fill with a default time (e.g., 15 mins from now)
    _selectedDateTime = DateTime.now().add(const Duration(minutes: 15));
    _updateTextFields();
  }

  @override
  void dispose() {
    _dateController.dispose();
    _timeController.dispose();
    super.dispose();
  }

  void _updateTextFields() {
    if (_selectedDateTime != null) {
      _dateController.text = DateFormat.yMd().format(_selectedDateTime!); // e.g., 4/22/2025
      _timeController.text = DateFormat.jm().format(_selectedDateTime!); // e.g., 9:15 AM
    } else {
      _dateController.clear();
      _timeController.clear();
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDateTime ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)), // Allow scheduling up to a year ahead
    );
    if (picked != null) {
      setState(() {
        // Keep the time part if already selected, otherwise use current time
        final TimeOfDay currentTime = TimeOfDay.fromDateTime(_selectedDateTime ?? DateTime.now());
        _selectedDateTime = DateTime(
          picked.year,
          picked.month,
          picked.day,
          currentTime.hour,
          currentTime.minute,
        );
        _updateTextFields();
      });
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_selectedDateTime ?? DateTime.now()),
    );
    if (picked != null) {
      setState(() {
        // Keep the date part if already selected, otherwise use today's date
        final DateTime currentDate = _selectedDateTime ?? DateTime.now();
        _selectedDateTime = DateTime(
          currentDate.year,
          currentDate.month,
          currentDate.day,
          picked.hour,
          picked.minute,
        );
        // Ensure selected time is in the future if the date is today
        if (_selectedDateTime!.isBefore(DateTime.now())) {
           _selectedDateTime = DateTime.now().add(const Duration(minutes: 5)); // Default to 5 mins from now
           ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(content: Text('Scheduled time must be in the future.')),
           );
        }
        _updateTextFields();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 16.0,
        right: 16.0,
        top: 16.0,
      ),
      child: Wrap(
        children: <Widget>[
          Center(
            child: Container(
              width: 40,
              height: 5,
              margin: const EdgeInsets.only(bottom: 16.0),
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Schedule',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close the bottom sheet first
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ScheduledPostsPage()),
                  );
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text('View all'),
                    Icon(Icons.arrow_forward, size: 16),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _dateController,
            readOnly: true,
            decoration: InputDecoration(
              labelText: 'Date*',
              border: const OutlineInputBorder(),
              suffixIcon: IconButton(
                icon: const Icon(Icons.calendar_today),
                onPressed: () => _selectDate(context),
              ),
            ),
            onTap: () => _selectDate(context),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _timeController,
            readOnly: true,
            decoration: InputDecoration(
              labelText: 'Time*',
              border: const OutlineInputBorder(),
              suffixIcon: IconButton(
                icon: const Icon(Icons.access_time),
                onPressed: () => _selectTime(context),
              ),
            ),
            onTap: () => _selectTime(context),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _selectedDateTime != null
                    ? () {
                        widget.onScheduleConfirmed(_selectedDateTime);
                        Navigator.pop(context); // Close bottom sheet
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('Next'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
