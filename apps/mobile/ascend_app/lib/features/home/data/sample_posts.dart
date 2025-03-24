import 'package:ascend_app/features/home/models/post_model.dart';

/// Sample data for posts used throughout the app
class SamplePosts {
  /// Pre-defined sponsored post example for marketing
  static final PostModel sponsoredMarketingPost = PostModel(
    title: '✨ Sponsored: Premium Content',
    description: 'Check out our featured products and services tailored just for you! Our team of experts has curated special offers exclusive to Ascend users.',
    images: [
      "assets/images_posts/Screenshot 2024-05-01 174349.png",
      "assets/images_posts/Screenshot 2024-09-20 152333.png",
      "assets/images_posts/Screenshot 2024-10-04 102509.png",
    ],
    isSponsored: true,
    useCarousel: true,
    ownerName: 'Ascend Marketing',
    ownerImageUrl: 'assets/logo.jpg', // Using the available logo
    ownerOccupation: 'Marketing Agency',
    timePosted: 'Sponsored',
    initialLikes: 128,
    initialComments: 32,
    followers: 58700, // Will display as "58.7K followers"
  );

  /// Pre-defined sponsored post example for fitness
  static final PostModel sponsoredFitnessPost = PostModel(
    title: '💪 Transform Your Fitness Journey',
    description: 'Discover our new workout programs designed for busy professionals. Get in shape without spending hours at the gym!',
    images: [
      "assets/images_posts/Screenshot 2023-08-06 150447.png",
      "assets/images_posts/Screenshot 2023-12-31 100011.png",
    ],
    isSponsored: true,
    useCarousel: true,
    ownerName: 'FitLife Pro',
    ownerImageUrl: 'assets/logo.jpg', // Using the available logo
    ownerOccupation: 'Fitness Brand',
    timePosted: 'Sponsored',
    initialLikes: 422,
    initialComments: 57,
    followers: 245000, // Will display as "245K followers"
  );

  /// Pre-defined sponsored post example for technology
  static final PostModel sponsoredTechPost = PostModel(
    title: '🚀 The Future of AI is Here',
    description: 'Introducing our latest AI-powered tools that will revolutionize how you work. Boost productivity and creativity with one simple platform.',
    images: [
      "assets/images_posts/Screenshot 2024-10-04 190255.png",
    ],
    isSponsored: true,
    useCarousel: false,
    ownerName: 'TechFuture Labs',
    ownerImageUrl: 'assets/logo.jpg', // Using the available logo
    ownerOccupation: 'Technology Company',
    timePosted: 'Sponsored',
    initialLikes: 786,
    initialComments: 104,
    followers: 1240000, // Will display as "1.2M followers"
  );

  /// Regular post examples (without images)
  static final List<PostModel> textOnlyPosts = [
    PostModel(
      title: 'Morning Thoughts on Design',
      description: 'I\'ve been thinking about the evolution of UI/UX over the past decade. The shift from skeuomorphic designs to flat interfaces and now to more nuanced approaches with subtle depth cues is fascinating. What design trends do you think will emerge next?',
      ownerName: 'Sarah Chen',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'UX Designer',
      timePosted: '3h ago',
      initialLikes: 42,
      initialComments: 7,
    ),
    PostModel(
      title: 'Career Reflections',
      description: 'After 5 years in the industry, I\'ve learned that technical skills only get you so far. The ability to communicate effectively, especially with non-technical stakeholders, has been the most valuable skill I\'ve developed.',
      ownerName: 'Marcus Johnson',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'Software Engineer',
      timePosted: '7h ago',
      initialLikes: 128,
      initialComments: 23,
    ),
  ];

  /// Posts with single images
  static final List<PostModel> singleImagePosts = [
    PostModel(
      title: 'My Latest Project',
      description: 'Just finished this dashboard design for a fintech client. Focused on clarity and data visualization while maintaining brand identity.',
      images: ["assets/images_posts/Screenshot 2024-05-01 174349.png"],
      ownerName: 'Alex Rivera',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'Product Designer',
      timePosted: '1d ago',
      initialLikes: 89,
      initialComments: 12,
    ),
    PostModel(
      title: 'Office Views Today',
      description: 'Working remotely has its perks. This is my office for the day!',
      images: ["assets/images_posts/Screenshot 2023-08-06 150447.png"],
      ownerName: 'Jamie Wilson',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'Digital Nomad',
      timePosted: '5h ago',
      initialLikes: 67,
      initialComments: 9,
    ),
  ];

  /// Posts with multiple images (grid view)
  static final List<PostModel> multiImageGridPosts = [
    PostModel(
      title: 'Design Exploration',
      description: 'Some explorations for our new mobile app. We\'re trying different color schemes and typography combinations.',
      images: [
        "assets/images_posts/Screenshot 2023-08-06 150447.png",
        "assets/images_posts/Screenshot 2023-12-31 100011.png",
        "assets/images_posts/Screenshot 2024-05-01 174349.png",
        "assets/images_posts/Screenshot 2024-09-20 152333.png",
      ],
      useCarousel: false,
      ownerName: 'Priya Sharma',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'UI Designer',
      timePosted: '2d ago',
      initialLikes: 156,
      initialComments: 28,
    ),
    PostModel(
      title: 'Team Building Event',
      description: 'Had an amazing time with the team yesterday. Games, food, and great conversations!',
      images: [
        "assets/images_posts/Screenshot 2024-09-20 152333.png",
        "assets/images_posts/Screenshot 2024-10-04 102509.png",
        "assets/images_posts/Screenshot 2024-10-04 190255.png",
      ],
      useCarousel: false,
      ownerName: 'David Miller',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'Team Lead',
      timePosted: '1d ago',
      initialLikes: 94,
      initialComments: 15,
    ),
  ];

  /// Posts with carousel images
  static final List<PostModel> carouselImagePosts = [
    PostModel(
      title: 'Product Design Process',
      description: 'A glimpse into our design process for the new feature. From sketches to wireframes to high-fidelity prototypes.',
      images: [
        "assets/images_posts/Screenshot 2023-08-06 150447.png",
        "assets/images_posts/Screenshot 2023-12-31 100011.png",
        "assets/images_posts/Screenshot 2024-05-01 174349.png",
        "assets/images_posts/Screenshot 2024-09-20 152333.png",
        "assets/images_posts/Screenshot 2024-10-04 102509.png",
      ],
      useCarousel: true,
      ownerName: 'Emily Zhang',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'Product Designer',
      timePosted: '2d ago',
      initialLikes: 212,
      initialComments: 34,
    ),
    PostModel(
      title: 'Conference Highlights',
      description: 'Some highlights from the UX Conference 2024. So many inspiring talks and great networking opportunities!',
      images: [
        "assets/images_posts/Screenshot 2023-12-31 100011.png",
        "assets/images_posts/Screenshot 2024-10-04 102509.png",
        "assets/images_posts/Screenshot 2024-10-04 190255.png",
      ],
      useCarousel: true,
      ownerName: 'Michael Brown',
      ownerImageUrl: 'assets/logo.jpg', // Using the available logo
      ownerOccupation: 'UX Researcher',
      timePosted: '3d ago',
      initialLikes: 176,
      initialComments: 22,
    ),
  ];

  /// Generate a list of random posts combining different types
  static List<PostModel> generateMixedPosts(int count) {
    List<PostModel> allSamplePosts = [
      ...textOnlyPosts,
      ...singleImagePosts,
      ...multiImageGridPosts,
      ...carouselImagePosts,
    ];
    
    List<PostModel> result = [];
    
    for (int i = 0; i < count; i++) {
      int index = i % allSamplePosts.length;
      result.add(allSamplePosts[index]);
    }
    
    return result;
  }

  /// Sponsored posts rotation - returns different sponsored posts in sequence
  static PostModel getNextSponsoredPost(int index) {
    List<PostModel> sponsoredPosts = [
      sponsoredMarketingPost,
      sponsoredFitnessPost,
      sponsoredTechPost,
    ];
    
    return sponsoredPosts[index % sponsoredPosts.length];
  }
}