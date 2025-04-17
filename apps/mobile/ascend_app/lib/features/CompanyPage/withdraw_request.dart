import 'package:flutter/material.dart';

class WithdrawRequest extends StatelessWidget {
  const WithdrawRequest({this.toggleIspending, super.key});

  final Function? toggleIspending;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Center(
        child: Text(
          "Withdraw invitation",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      content: Text(
        "If you withdraw now, you won’t be able to resend to this person for up to 3 weeks.",
        textAlign: TextAlign.center,
      ),
      actions: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly, // Even spacing
          children: [
            Expanded(
              child: TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: TextButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 12),
                ),
                child: Text("Cancel"),
              ),
            ),
            SizedBox(width: 10), // Space between buttons
            Expanded(
              child: TextButton(
                onPressed: () {
                  toggleIspending?.call(); // Safely call function
                  Navigator.pop(context);
                },
                style: TextButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 12),
                ),
                child: Text("Withdraw", style: TextStyle(color: Colors.red)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
