// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String videoUrl;

  const VideoPlayerScreen({required this.videoUrl, Key? key}) : super(key: key);

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late VideoPlayerController _controller;
  bool _isInitialized = false;
  bool _isError = false;
  bool _showControls = true;

  @override
  void initState() {
    super.initState();
    debugPrint('Initializing video player with videoUrl: ${widget.videoUrl}');

    _controller = VideoPlayerController.network(widget.videoUrl)
      ..initialize()
          .then((_) {
            setState(() {
              _isInitialized = true;
            });
            _controller.play();

            // Auto-hide controls
            Future.delayed(const Duration(seconds: 3), () {
              if (mounted) {
                setState(() {
                  _showControls = false;
                });
              }
            });
          })
          .catchError((error) {
            debugPrint('Error initializing video: $error');
            setState(() {
              _isError = true;
            });
          });

    _controller.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body:
          _isError
              ? _buildErrorWidget()
              : _isInitialized
              ? _buildVideoPlayer()
              : const Center(
                child: CircularProgressIndicator(color: Colors.white),
              ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 60),
          const SizedBox(height: 16),
          const Text(
            'Failed to load video',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Go Back'),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoPlayer() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _showControls = !_showControls;
        });

        if (_showControls) {
          Future.delayed(const Duration(seconds: 3), () {
            if (mounted) {
              setState(() {
                _showControls = false;
              });
            }
          });
        }
      },
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Video
          AspectRatio(
            aspectRatio: _controller.value.aspectRatio,
            child: VideoPlayer(_controller),
          ),

          // Play/pause button
          if (_showControls)
            AnimatedOpacity(
              opacity: _showControls ? 1.0 : 0.0,
              duration: const Duration(milliseconds: 300),
              child: IconButton(
                icon: Icon(
                  _controller.value.isPlaying
                      ? Icons.pause_circle_filled
                      : Icons.play_circle_filled,
                  color: Colors.white,
                  size: 60,
                ),
                onPressed: () {
                  setState(() {
                    if (_controller.value.isPlaying) {
                      _controller.pause();
                    } else {
                      _controller.play();
                    }
                  });
                },
              ),
            ),

          // Video progress controls
          if (_showControls)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                  ),
                ),
                child: Column(
                  children: [
                    // Progress bar
                    VideoProgressIndicator(
                      _controller,
                      allowScrubbing: true,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      colors: const VideoProgressColors(
                        playedColor: Colors.blue,
                        bufferedColor: Colors.grey,
                        backgroundColor: Colors.white24,
                      ),
                    ),

                    // Time display
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _formatDuration(_controller.value.position),
                            style: const TextStyle(color: Colors.white),
                          ),
                          Text(
                            _formatDuration(_controller.value.duration),
                            style: const TextStyle(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }
}
