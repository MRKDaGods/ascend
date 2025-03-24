import 'package:ascend_app/features/networks/model/user_model.dart';
import 'package:ascend_app/features/networks/widgets/mutual_connection.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/Mock%20Data/connections_request.dart';
import 'package:ascend_app/features/networks/managers/connection_manager.dart';

class SingleConnection extends StatefulWidget {
  final UserModel user;
  final List<UserModel> mutualUsers;
  final List<UserModel> acceptedConnections;
  final Function(String) onSend;
  final bool ShowAll;
  final bool isConnected;
  final Function(String) onHide;

  const SingleConnection({
    Key? key,
    required this.user,
    required this.mutualUsers,
    required this.acceptedConnections,
    required this.onSend,
    required this.ShowAll,
    required this.isConnected,
    required this.onHide,
  }) : super(key: key);

  @override
  _SingleConnectionState createState() => _SingleConnectionState();
}

class _SingleConnectionState extends State<SingleConnection> {
  bool _isVisible = true;

  void _HideWidget() {
    setState(() {
      _isVisible = false;
      widget.onHide(widget.user.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isVisible) return const SizedBox.shrink();

    return LayoutBuilder(
      builder: (context, constraints) {
        final double parentWidth = constraints.maxWidth;
        final double parentHeight = constraints.maxHeight;

        return ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Card(
            child: Stack(
              children: [
                // Cover picture
                Image.asset(
                  widget.user.coverpic,
                  fit: BoxFit.cover,
                  width: parentWidth,
                  height: parentHeight * 0.3,
                ),

                // Close button
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: _HideWidget,
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.5),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                ),

                // Profile picture
                Positioned(
                  top: parentHeight * 0.08,
                  left: parentWidth * 0.25,
                  right: parentWidth * 0.25,
                  child: CircleAvatar(
                    radius: parentWidth * 0.3,
                    backgroundImage: AssetImage(widget.user.profilePic),
                  ),
                ),

                // Content below the profile picture
                Positioned(
                  top: parentWidth * 0.6 + parentHeight * 0.07,
                  left: 0,
                  right: 0,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Name
                      Text(
                        widget.user.name,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),

                      // Bio
                      SizedBox(
                        width: parentWidth * 0.8,
                        height: 45,
                        child: Text(
                          widget.user.bio,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Mutual connections
                      MutualConnections(
                        mutualUsers: widget.mutualUsers,
                        numFollowers: widget.acceptedConnections.length,
                      ),
                      const SizedBox(height: 8),

                      // Connect button
                      SizedBox(
                        width: double.infinity,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: OutlinedButton(
                            onPressed:
                                widget.isConnected
                                    ? null
                                    : () {
                                      widget.onSend(widget.user.id);
                                    },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(
                                color:
                                    widget.isConnected
                                        ? Colors.grey
                                        : Colors.blue,
                              ),
                            ),
                            child: Text(
                              widget.isConnected ? 'pending' : 'Connect',
                              style: TextStyle(
                                color:
                                    widget.isConnected
                                        ? Colors.grey
                                        : Colors.blue,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
