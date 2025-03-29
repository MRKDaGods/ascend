import 'package:flutter/material.dart';
import 'profile_entry.dart';

class EditEntryPage extends StatefulWidget {
  final ProfileEntryWidget entry;

  const EditEntryPage({super.key, required this.entry});

  @override
  _EditEntryPageState createState() => _EditEntryPageState();
}

class _EditEntryPageState extends State<EditEntryPage> {
  late TextEditingController titleController;
  late TextEditingController subtitleController;
  late TextEditingController descriptionController;

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController(text: widget.entry.title);
    subtitleController = TextEditingController(text: widget.entry.subtitle);
    descriptionController = TextEditingController(
      text: widget.entry.description,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black87,
      appBar: AppBar(title: Text('Edit Entry')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: InputDecoration(labelText: 'Title'),
            ),
            TextField(
              controller: subtitleController,
              decoration: InputDecoration(labelText: 'Subtitle'),
            ),
            TextField(
              controller: descriptionController,
              decoration: InputDecoration(labelText: 'Description'),
              maxLines: 3,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Save the changes and go back
                Navigator.pop(
                  context,
                  ProfileEntryWidget(
                    title: titleController.text,
                    subtitle: subtitleController.text,
                    description: descriptionController.text,
                  ),
                );
              },
              child: Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}
