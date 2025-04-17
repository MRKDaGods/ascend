import 'package:flutter/material.dart';
import 'profile_entry.dart';

class EditEntryPage extends StatefulWidget {
  final ProfileEntryWidget entry;
  final void Function(ProfileEntryWidget) saveEntry;
  const EditEntryPage({
    super.key,
    required this.entry,
    required this.saveEntry,
  });

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
      appBar: AppBar(title: const Text('Edit Entry')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(labelText: 'Title'),
            ),
            const SizedBox(height: 15),
            TextField(
              controller: subtitleController,
              decoration: const InputDecoration(labelText: 'Subtitle'),
            ),
            const SizedBox(height: 15),
            TextField(
              controller: descriptionController,
              decoration: const InputDecoration(labelText: 'Description'),
              maxLines: 3,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Create a new ProfileEntryWidget with updated fields
                final updatedEntry = ProfileEntryWidget(
                  title:
                      titleController.text.isNotEmpty
                          ? titleController.text
                          : widget.entry.title, // Retain original if unchanged
                  subtitle:
                      subtitleController.text.isNotEmpty
                          ? subtitleController.text
                          : widget
                              .entry
                              .subtitle, // Retain original if unchanged
                  description:
                      descriptionController.text.isNotEmpty
                          ? descriptionController.text
                          : widget
                              .entry
                              .description, // Retain original if unchanged
                  imageUrl:
                      widget.entry.imageUrl, // Keep other fields unchanged
                  icon: widget.entry.icon,
                  extraContent: widget.entry.extraContent,
                );

                // Call saveEntry with the updated entry
                widget.saveEntry(updatedEntry);

                // Navigate back
                Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}
