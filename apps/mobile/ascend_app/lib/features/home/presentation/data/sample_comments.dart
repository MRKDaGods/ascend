import 'package:ascend_app/features/home/presentation/models/comment_model.dart';

class SampleComments {
  // Private constructor to prevent instantiation
  SampleComments._();
  
  // Sample comments for regular posts
  static List<Comment> getDefaultComments() {
    return [
      Comment(
        id: '1',
        authorName: 'Jane Doe',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Product Manager',
        text: 'Great post! Thanks for sharing.',
        timePosted: '1h ago',
        likes: 5,
        isLiked: false,
      ),
      Comment(
        id: '2',
        authorName: 'John Smith',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Software Engineer',
        text: 'I found this very helpful.',
        timePosted: '30m ago',
        likes: 3,
        isLiked: false,
      ),
    ];
  }
  
  // Sample comments for specific post types
  static List<Comment> getTechnicalPostComments() {
    return [
      Comment(
        id: '1',
        authorName: 'Tech Enthusiast',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Frontend Developer',
        text: 'The implementation details here are really interesting.',
        timePosted: '45m ago',
        likes: 8,
        isLiked: false,
      ),
      Comment(
        id: '2',
        authorName: 'Developer',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Senior Engineer',
        text: 'Have you considered using a different approach?',
        timePosted: '20m ago',
        likes: 2,
        isLiked: false,
        replies: [
          Comment(
            id: '2-1',
            authorName: 'Original Poster',
            authorImage: 'assets/logo.jpg',
            authorOccupation: 'Project Lead',
            text: 'Yes, I tried that but found this more efficient.',
            timePosted: '15m ago',
            parentId: '2',
            likes: 1,
            isLiked: false,
          ),
        ],
      ),
    ];
  }
  
  // Sample comments for business posts
  static List<Comment> getBusinessPostComments() {
    return [
      Comment(
        id: '1',
        authorName: 'Business Analyst',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Financial Advisor',
        text: 'These insights align with market trends we\'re seeing.',
        timePosted: '2h ago',
        likes: 4,
        isLiked: false,
      ),
      Comment(
        id: '2',
        authorName: 'Entrepreneur',
        authorImage: 'assets/logo.jpg',
        authorOccupation: 'Startup Founder',
        text: 'I\'ve implemented similar strategies with success.',
        timePosted: '1h ago',
        likes: 6,
        isLiked: false,
      ),
    ];
  }
  
  // Generate a random comment for testing
  static Comment getRandomComment() {
    final commentId = DateTime.now().millisecondsSinceEpoch.toString();
    return Comment(
      id: commentId,
      authorName: 'Random User',
      authorImage: 'assets/logo.jpg',
      authorOccupation: 'Guest',
      text: 'This is a randomly generated comment for testing.',
      timePosted: 'Just now',
      likes: 0,
      isLiked: false,
    );
  }
}