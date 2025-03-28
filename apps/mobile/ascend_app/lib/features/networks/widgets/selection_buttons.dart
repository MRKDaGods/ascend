import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/model/connection_request_model.dart';
import 'package:ascend_app/features/networks/utils/overlay_builder.dart';

class SelectionButtons extends StatelessWidget {
  final Function(String) onAccept;
  final Function(String) onDecline;
  final ConnectionRequestModel connectionRequest;

  const SelectionButtons({
    super.key,
    required this.onAccept,
    required this.onDecline,
    required this.connectionRequest,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Decline Button with Circular Border
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.grey,
              width: 2,
            ), // Grey circular border
          ),
          child: IconButton(
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.close, color: Colors.grey),
            onPressed: () => onDecline(connectionRequest.requestId),
            tooltip: 'Decline',
          ),
        ),
        const SizedBox(width: 8), // Spacing between the two buttons
        // Accept Button with Circular Border
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.blue,
              width: 2,
            ), // Blue circular border
          ),
          child: IconButton(
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.check, color: Colors.lightBlue),
            onPressed: () {
              onAccept(connectionRequest.requestId);
              showSnackBar(context);
            },
            tooltip: 'Accept',
          ),
        ),
      ],
    );
  }
}
