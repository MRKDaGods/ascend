import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

class MessageList extends StatelessWidget {
  const MessageList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Sample data for demonstration
    final List<Map<String, dynamic>> messages = [
      {
        'sender': 'Jean Philippe A.',
        'subject': 'Sponsored • Teach AI Math for extra income from home',
        'date': 'Mar 18',
        'avatar': 'https://via.placeholder.com/40', // Placeholder for avatar
      },
      {
        'sender': 'LinkedIn',
        'subject': 'LinkedIn Offer • Hi there, Mohamed! We’d like to offer...',
        'date': 'Mar 12',
        'avatar': 'https://via.placeholder.com/40',
        'isLinkedIn': true,
      },
      {
        'sender': 'Mohamed Ammar',
        'subject': 'Hi',
        'date': 'Feb 8',
        'avatar': 'https://via.placeholder.com/40',
      },
      {
        'sender': 'Seif Heakal',
        'subject':
            'Congrats on starting your new role at The Egyptian Credit B...',
        'date': 'Aug 6, 2024',
        'avatar': 'https://via.placeholder.com/40',
      },
      {
        'sender': 'Ibrahim Muhamm...',
        'subject': 'InMail • Offer!',
        'date': 'Jun 5, 2024',
        'avatar': 'https://via.placeholder.com/40',
      },
    ];

    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[index];
        return ListTile(
          leading: CircleAvatar(
            radius: 20,
            backgroundImage: NetworkImage(message['avatar']),
          ),
          title: Row(
            children: [
              if (message['isLinkedIn'] == true) ...[
                const Icon(Icons.link, color: Colors.blue, size: 20),
                const SizedBox(width: 4),
              ],
              Expanded(
                child: Text(
                  message['sender'],
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          subtitle: Text(
            message['subject'],
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 14),
          ),
          trailing: Text(
            message['date'],
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
          onTap: () {
            // Handle message tap
          },
        );
      },
    );
  }
}
