import 'package:flutter/material.dart';

class PremiumSection extends StatelessWidget {
  final bool isDarkMode;
  const PremiumSection({super.key, required this.isDarkMode});
  @override
  Widget build(BuildContext context) {
    bool isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDarkMode ? Colors.black : Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.workspace_premium, color: Colors.amber, size: 20),
              SizedBox(width: 4),
              Text(
                'PREMIUM',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color:
                      isDarkMode ? Colors.grey.shade400 : Colors.grey.shade700,
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            "Jobs where you're more likely to hear back",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.white : Colors.black,
            ),
          ),
          SizedBox(height: 4),
          Text(
            "Apply to jobs where you'd be a top applicant",
            style: TextStyle(
              fontSize: 14,
              color: isDarkMode ? Colors.grey.shade400 : Colors.grey.shade600,
            ),
          ),
          SizedBox(height: 12),
          Row(
            children: [
              CircleAvatar(
                backgroundImage: AssetImage(
                  'assets/logo.jpg',
                ), // Change this to your asset
                radius: 20,
              ),
              SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "See the full list of jobs where you'd be a top applicant",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: isDarkMode ? Colors.white : Colors.black,
                      ),
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        CircleAvatar(
                          backgroundImage: NetworkImage(
                            "https://picsum.photos/200/300",
                          ),
                          radius: 10,
                        ),
                        CircleAvatar(
                          backgroundImage: NetworkImage(
                            "https://picsum.photos/200/200",
                          ),
                          radius: 10,
                        ),
                        SizedBox(width: 4),
                        Text(
                          "Mohamed and millions of other members use Premium",
                          style: TextStyle(
                            fontSize: 12,
                            color:
                                isDarkMode
                                    ? Colors.grey.shade400
                                    : Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 12),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Text(
                "Try Premium for EGP0",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
            ),
          ),
          SizedBox(height: 8),
          Text(
            "Free 1-month trial with 24/7 support. Cancel anytime.",
            style: TextStyle(
              fontSize: 12,
              color: isDarkMode ? Colors.grey.shade500 : Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }
}
