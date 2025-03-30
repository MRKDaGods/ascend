import 'package:ascend_app/features/home/models/post_model.dart';
import 'package:ascend_app/features/home/models/comment_model.dart';

/// Sample data for posts used throughout the app
class SamplePosts {
  /// Sample comments that can be applied to posts
  static final List<Comment> sampleComments = [
    Comment(
      id: 'comment_1',
      authorName: 'Alex Thompson',
      authorImageUrl: 'assets/EmptyUser.png',
      authorOccupation: 'Product Manager',
      text: 'This is really insightful! I love how you approached this problem.',
      timePosted: '2h ago',
      likesCount: 8,
      isLiked: false,
      replies: [
        Comment(
          id: 'reply_1_1',
          authorName: 'Jamie Wilson',
          authorImageUrl: 'assets/pic 2.jpg',
          authorOccupation: 'Digital Marketer',
          text: 'I agree! Very well thought out approach.',
          timePosted: '1h ago',
          likesCount: 3,
          isLiked: false,
        ),
        Comment(
          id: 'reply_1_2',
          authorName: 'Sarah Chen',
          authorImageUrl: 'assets/pic 3.jpg',
          authorOccupation: 'UX Designer',
          text: 'Would love to know more about your research process for this.',
          timePosted: '45m ago',
          likesCount: 1,
          isLiked: false,
        ),
      ],
    ),
    Comment(
      id: 'comment_2',
      authorName: 'Michael Brown',
      authorImageUrl: 'assets/image 4.jpg',
      authorOccupation: 'Software Engineer',
      text: 'Have you considered using a different framework for this? I found that React works better for similar cases.',
      timePosted: '3h ago',
      likesCount: 5,
      isLiked: false,
      replies: [],
    ),
    Comment(
      id: 'comment_3',
      authorName: 'Priya Sharma',
      authorImageUrl: 'assets/pexels-karymefranca-1535907.jpg',
      authorOccupation: 'Product Designer',
      text: 'The UI for this looks clean and intuitive. Great work!',
      timePosted: '5h ago',
      likesCount: 12,
      isLiked: false,
      replies: [
        Comment(
          id: 'reply_3_1',
          authorName: 'David Miller',
          authorImageUrl: 'assets/EmptyUser.png',
          authorOccupation: 'UI Developer',
          text: 'I especially like the color scheme you chose.',
          timePosted: '4h ago',
          likesCount: 2,
          isLiked: false,
        ),
      ],
    ),
    Comment(
      id: 'comment_4',
      authorName: 'Emily Zhang',
      authorImageUrl: 'assets/pic 2.jpg',
      authorOccupation: 'UX Researcher',
      text: 'I ran a similar user study last month, and our findings align perfectly with your approach!',
      timePosted: '1d ago',
      likesCount: 15,
      isLiked: false,
      replies: [],
    ),
    Comment(
      id: 'comment_5',
      authorName: 'Marcus Johnson',
      authorImageUrl: 'assets/pic 3.jpg',
      authorOccupation: 'Tech Lead',
      text: 'The performance optimizations here are impressive. How much of an improvement did you see?',
      timePosted: '2d ago',
      likesCount: 7,
      isLiked: false,
      replies: [
        Comment(
          id: 'reply_5_1',
          authorName: 'Sophia Lee',
          authorImageUrl: 'assets/image 4.jpg',
          authorOccupation: 'Frontend Developer',
          text: 'I\'m curious about this too. We\'ve been working on similar optimizations.',
          timePosted: '1d ago',
          likesCount: 3,
          isLiked: false,
        ),
      ],
    ),
  ];

  /// Pre-defined sponsored post example for marketing
  static Post getSponsoredMarketingPost() {
    return Post(
      id: 'sponsored_marketing',
      title: '✨ Sponsored: Premium Content',
      description: 'Check out our featured products and services tailored just for you! Our team of experts has curated special offers exclusive to Ascend users.',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2024-05-01 174349.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-09-20 152333.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 102509.png"),
      ],
      isSponsored: true,
      useCarousel: true,
      ownerName: 'Ascend Marketing',
      ownerImageUrl: 'assets/logo.jpg',
      ownerOccupation: 'Marketing Agency',
      timePosted: 'Sponsored',
      likesCount: 128,
      commentsCount: 32,
      followers: 58700,
      isLiked: false,
      comments: _getRandomComments(2),
    );
  }

  /// Pre-defined sponsored post example for fitness
  static Post getSponsoredFitnessPost() {
    return Post(
      id: 'sponsored_fitness',
      title: '💪 Transform Your Fitness Journey',
      description: 'Discover our new workout programs designed for busy professionals. Get in shape without spending hours at the gym!',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2023-08-06 150447.png"),
        safeImagePath("assets/images_posts/Screenshot 2023-12-31 100011.png"),
      ],
      isSponsored: true,
      useCarousel: true,
      ownerName: 'FitLife Pro',
      ownerImageUrl: 'assets/logo/logo1.png',
      ownerOccupation: 'Fitness Brand',
      timePosted: 'Sponsored',
      likesCount: 422,
      commentsCount: 57,
      followers: 245000,
      isLiked: false,
      comments: _getRandomComments(3),
    );
  }

  /// Pre-defined sponsored post example for technology
  static Post getSponsoredTechPost() {
    return Post(
      id: 'sponsored_tech',
      title: '🚀 The Future of AI is Here',
      description: 'Introducing our latest AI-powered tools that will revolutionize how you work. Boost productivity and creativity with one simple platform.',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 190255.png"),
      ],
      isSponsored: true,
      useCarousel: false,
      ownerName: 'TechFuture Labs',
      ownerImageUrl: 'assets/logo/logo12.png',
      ownerOccupation: 'Technology Company',
      timePosted: 'Sponsored',
      likesCount: 786,
      commentsCount: 104,
      followers: 1240000,
      isLiked: false, 
      comments: _getRandomComments(4),
    );
  }

  /// Get default posts for the app
  static List<Post> getDefaultPosts() {
    List<Post> posts = [];
    
    // Add text-only posts
    posts.add(Post(
      id: 'post_1',
      title: 'Morning Thoughts on Design',
      description: 'I\'ve been thinking about the evolution of UI/UX over the past decade. The shift from skeuomorphic designs to flat interfaces and now to more nuanced approaches with subtle depth cues is fascinating. What design trends do you think will emerge next?',
      ownerName: 'Sarah Chen',
      ownerImageUrl: 'assets/pic 3.jpg',
      ownerOccupation: 'UX Designer',
      timePosted: '3h ago',
      likesCount: 42,
      commentsCount: 7,
      followers: 3450,
      isLiked: false,
      comments: _getRandomComments(2),
      images: [],
    ));
    
    posts.add(Post(
      id: 'post_2',
      title: 'Career Reflections',
      description: 'After 5 years in the industry, I\'ve learned that technical skills only get you so far. The ability to communicate effectively, especially with non-technical stakeholders, has been the most valuable skill I\'ve developed.',
      ownerName: 'Marcus Johnson',
      ownerImageUrl: 'assets/image 4.jpg',
      ownerOccupation: 'Software Engineer',
      timePosted: '7h ago',
      likesCount: 128,
      commentsCount: 23,
      followers: 2180,
      isLiked: false,
      comments: _getRandomComments(3),
      images: [],
    ));
    
    // Add single image posts
    posts.add(Post(
      id: 'post_3',
      title: 'My Latest Project',
      description: 'Just finished this dashboard design for a fintech client. Focused on clarity and data visualization while maintaining brand identity.',
      images: [safeImagePath("assets/images_posts/Screenshot 2024-05-01 174349.png")],
      ownerName: 'Alex Rivera',
      ownerImageUrl: 'assets/EmptyUser.png',
      ownerOccupation: 'Product Designer',
      timePosted: '1d ago',
      likesCount: 89,
      commentsCount: 12,
      followers: 5200,
      isLiked: false,
      comments: _getRandomComments(2),
    ));
    
    posts.add(Post(
      id: 'post_4',
      title: 'Office Views Today',
      description: 'Working remotely has its perks. This is my office for the day!',
      images: [safeImagePath("assets/images_posts/Screenshot 2023-08-06 150447.png")],
      ownerName: 'Jamie Wilson',
      ownerImageUrl: 'assets/pic 2.jpg',
      ownerOccupation: 'Digital Nomad',
      timePosted: '5h ago',
      likesCount: 67,
      commentsCount: 9,
      followers: 1850,
      isLiked: false,
      comments: _getRandomComments(1),
    ));
    
    // Add multi-image grid posts
    posts.add(Post(
      id: 'post_5',
      title: 'Design Exploration',
      description: 'Some explorations for our new mobile app. We\'re trying different color schemes and typography combinations.',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2023-08-06 150447.png"),
        safeImagePath("assets/images_posts/Screenshot 2023-12-31 100011.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-05-01 174349.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-09-20 152333.png"),
      ],
      useCarousel: false,
      ownerName: 'Priya Sharma',
      ownerImageUrl: 'assets/pexels-karymefranca-1535907.jpg',
      ownerOccupation: 'UI Designer',
      timePosted: '2d ago',
      likesCount: 156,
      commentsCount: 28,
      followers: 4730,
      isLiked: false,
      comments: _getRandomComments(4),
    ));
    
    posts.add(Post(
      id: 'post_6',
      title: 'Team Building Event',
      description: 'Had an amazing time with the team yesterday. Games, food, and great conversations!',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2024-09-20 152333.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 102509.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 190255.png"),
      ],
      useCarousel: false,
      ownerName: 'David Miller',
      ownerImageUrl: 'assets/EmptyUser.png',
      ownerOccupation: 'Team Lead',
      timePosted: '1d ago',
      likesCount: 94,
      commentsCount: 15,
      followers: 2630,
      isLiked: false,
      comments: _getRandomComments(2),
    ));
    
    // Add carousel image posts
    posts.add(Post(
      id: 'post_7',
      title: 'Product Design Process',
      description: 'A glimpse into our design process for the new feature. From sketches to wireframes to high-fidelity prototypes.',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2023-08-06 150447.png"),
        safeImagePath("assets/images_posts/Screenshot 2023-12-31 100011.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-05-01 174349.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-09-20 152333.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 102509.png"),
      ],
      useCarousel: true,
      ownerName: 'Emily Zhang',
      ownerImageUrl: 'assets/pic 2.jpg',
      ownerOccupation: 'Product Designer',
      timePosted: '2d ago',
      likesCount: 212,
      commentsCount: 34,
      followers: 8950,
      isLiked: false,
      comments: _getRandomComments(3),
    ));
    
    posts.add(Post(
      id: 'post_8',
      title: 'Conference Highlights',
      description: 'Some highlights from the UX Conference 2024. So many inspiring talks and great networking opportunities!',
      images: [
        safeImagePath("assets/images_posts/Screenshot 2023-12-31 100011.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 102509.png"),
        safeImagePath("assets/images_posts/Screenshot 2024-10-04 190255.png"),
      ],
      useCarousel: true,
      ownerName: 'Michael Brown',
      ownerImageUrl: 'assets/image 4.jpg',
      ownerOccupation: 'UX Researcher',
      timePosted: '3d ago',
      likesCount: 176,
      commentsCount: 22,
      followers: 3840,
      isLiked: false,
      comments: _getRandomComments(2),
    ));
    
    return posts;
  }

  /// Generate a list of random posts combining different types
  static List<Post> generateMixedPosts(int count) {
    List<Post> basePosts = getDefaultPosts();
    List<Post> result = [];
    
    for (int i = 0; i < count; i++) {
      int index = i % basePosts.length;
      // Create a variant to avoid direct references
      result.add(basePosts[index].copyWith(
        id: 'post_${basePosts.length + i}',
        likesCount: basePosts[index].likesCount + (i * 3) % 50,
        commentsCount: basePosts[index].commentsCount + (i * 2) % 10,
        comments: _getRandomComments(1 + (i % 3)),
      ));
    }
    
    return result;
  }

  /// Sponsored posts rotation - returns different sponsored posts in sequence
  static Post getNextSponsoredPost(int index) {
    List<Post> sponsoredPosts = [
      getSponsoredMarketingPost(),
      getSponsoredFitnessPost(),
      getSponsoredTechPost(),
    ];
    
    return sponsoredPosts[index % sponsoredPosts.length];
  }
  
  /// Helper to get random comments
  static List<Comment> _getRandomComments(int count) {
    if (count <= 0) return [];
    
    List<Comment> result = [];
    for (int i = 0; i < count && i < sampleComments.length; i++) {
      result.add(sampleComments[i]);
    }
    return result;
  }
}

// Use a safe image function when creating posts
String safeImagePath(String path) {
  // Ensure path is trimmed and valid
  return path.trim();
}