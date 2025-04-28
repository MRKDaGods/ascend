import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart'; // Import image_picker

class PostTypeSelectionGrid extends StatelessWidget {
  const PostTypeSelectionGrid({super.key});

  Widget _buildIconButton(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(40), // For splash effect
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.grey[200],
            child: Icon(icon, size: 28, color: Colors.grey[700]),
          ),
          const SizedBox(height: 8),
          Text(label, style: TextStyle(color: Colors.grey[700], fontSize: 12)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ImagePicker picker = ImagePicker(); // Instantiate the picker

    // Using Wrap for flexibility, adjust spacing as needed
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Wrap(
        spacing: 24.0, // Horizontal space between items
        runSpacing: 24.0, // Vertical space between rows
        alignment: WrapAlignment.spaceAround, // Adjust alignment
        children: <Widget>[
          _buildIconButton(context, Icons.photo_library_outlined, 'Media', () async { // Make the callback async
            try {
              // Pick multiple images from the gallery.
              final List<XFile> images = await picker.pickMultiImage();

              if (images.isNotEmpty) {
                print('${images.length} images picked from grid.');
                if (context.mounted) { // Check if the widget is still mounted
                  // Pop the bottom sheet and return the selected images
                  Navigator.pop(context, images);
                }
              } else {
                print('Image picking cancelled or no images selected.');
                if (context.mounted) { // Check if the widget is still mounted
                  // Optionally pop without returning anything if cancelled
                  // Navigator.pop(context);
                }
              }
            } catch (e) {
              print('Error picking images: $e');
              if (context.mounted) { // Check if the widget is still mounted
                 ScaffoldMessenger.of(context).showSnackBar(
                   SnackBar(content: Text('Error picking images: $e')),
                 );
                 // Optionally pop on error
                 // Navigator.pop(context);
              }
            }
          }),
          _buildIconButton(context, Icons.calendar_today_outlined, 'Event', () {
            print('Event tapped');
          }),
          _buildIconButton(context, Icons.celebration_outlined, 'Celebrate', () {
            print('Celebrate tapped');
          }),
          _buildIconButton(context, Icons.work_outline, 'Job', () {
            print('Job tapped');
          }),
          _buildIconButton(context, Icons.poll_outlined, 'Poll', () {
            print('Poll tapped');
          }),
          _buildIconButton(context, Icons.description_outlined, 'Document', () {
            print('Document tapped');
          }),
          _buildIconButton(context, Icons.business_center_outlined, 'Services', () {
            print('Services tapped');
          }),
          // Add more buttons if needed
        ],
      ),
    );
  }
}