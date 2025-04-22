import 'package:flutter/material.dart';

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
    // Using Wrap for flexibility, adjust spacing as needed
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Wrap(
        spacing: 24.0, // Horizontal space between items
        runSpacing: 24.0, // Vertical space between rows
        alignment: WrapAlignment.spaceAround, // Adjust alignment
        children: <Widget>[
          _buildIconButton(context, Icons.photo_library_outlined, 'Media', () {
            // TODO: Implement Media action - Cannot directly open local Windows paths.
            // This should typically open an image picker.
            print('Media tapped - Intended action: Open image picker');
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Media button tapped - Implement image picker here.')),
            );
          }),
          _buildIconButton(context, Icons.calendar_today_outlined, 'Event', () {
            // TODO: Implement Event action
            print('Event tapped');
          }),
          _buildIconButton(context, Icons.celebration_outlined, 'Celebrate', () {
            // TODO: Implement Celebrate action
            print('Celebrate tapped');
          }),
          _buildIconButton(context, Icons.work_outline, 'Job', () {
            // TODO: Implement Job action
            print('Job tapped');
          }),
          _buildIconButton(context, Icons.poll_outlined, 'Poll', () {
            // TODO: Implement Poll action
            print('Poll tapped');
          }),
          _buildIconButton(context, Icons.description_outlined, 'Document', () {
            // TODO: Implement Document action
            print('Document tapped');
          }),
          _buildIconButton(context, Icons.business_center_outlined, 'Services', () {
            // TODO: Implement Services action
            print('Services tapped');
          }),
          // Add more buttons if needed
        ],
      ),
    );
  }
}
