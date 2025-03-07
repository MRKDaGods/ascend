import 'package:ascend_app/features/home/presentation/widgets/post.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/home/presentation/models/post_model.dart';

import '../../../../shared/widgets/custom_sliver_appbar.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final List<PostModel> _posts = List.generate(
    20,
    (index) => PostModel(
      title: 'Title $index',
      description: 'Description of Title $index',
      images: [
        "assets/images_posts/Screenshot 2023-08-06 150447.png",
        "assets/images_posts/Screenshot 2023-12-31 100011.png",
        "assets/images_posts/Screenshot 2024-05-01 174349.png",
        "assets/images_posts/Screenshot 2024-09-20 152333.png",
        "assets/images_posts/Screenshot 2024-10-04 102509.png",
      ],
    ),
  );
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _loadMoreItems();
    }
  }

  void _loadMoreItems() {
    setState(() {
      _posts.addAll(
        List.generate(
          20,
          (index) => PostModel(
            title: 'Title ${_posts.length + index}',
            description:
                """Description of Title ${_posts.length + index} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac orci lorem. Donec consectetur ac arcu a elementum. In justo elit, sollicitudin id nulla vitae, finibus consequat mauris. Donec quis arcu sed nibh dapibus euismod. Phasellus scelerisque, arcu non convallis pharetra, elit elit dictum justo, in finibus erat metus a velit. Aenean aliquet neque at est eleifend viverra. Quisque sed turpis enim. Praesent ex nisl, fringilla eu nulla et, tempus dictum lorem. Nam sed nulla mi. Aenean ut sollicitudin massa.

In non lectus eu diam porta rutrum. Ut volutpat magna non quam congue, quis semper dui pellentesque. Suspendisse a sapien pellentesque, tincidunt nibh in, maximus nisi. Nullam viverra, libero sit amet viverra pulvinar, arcu turpis consequat ligula, sed pretium elit odio ut metus. Fusce imperdiet tortor metus, sed ultricies lacus auctor sed. Vivamus dolor sapien, semper vel fermentum sit amet, porta eu erat. Nunc egestas mauris fringilla urna eleifend, at hendrerit nisi pellentesque. Praesent erat erat, suscipit sed arcu ut, suscipit efficitur nulla. Curabitur consectetur diam eros, vitae vehicula libero rutrum sed.

Quisque ultrices tincidunt faucibus. Nulla dui augue, pretium at pretium sit amet, euismod sit amet mi. Donec vitae tortor ut lorem vehicula suscipit sit amet sed lectus. In finibus scelerisque libero mattis tempus. Suspendisse finibus ipsum in ex aliquet, sed pellentesque nunc pulvinar. Sed fringilla sollicitudin purus mattis porta. Sed in fermentum ligula. In hac habitasse platea dictumst. Vestibulum justo mi, condimentum eget mi ut, congue scelerisque ex. Aliquam id venenatis enim. Suspendisse molestie ante id turpis dignissim, a finibus dolor sodales. Vestibulum sagittis aliquet diam, vel placerat lacus consectetur eget. Cras a interdum quam. Nam aliquet erat tellus, sit amet rhoncus turpis commodo in. Ut nulla augue, condimentum et faucibus non, ullamcorper venenatis lorem.

Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur id diam lorem. Etiam vitae tellus gravida, porttitor diam et, varius tortor. Vestibulum lobortis luctus diam, at efficitur lectus ultrices eu. Quisque quis ipsum ut lacus volutpat sollicitudin. In posuere eget nulla a lobortis. Morbi id suscipit felis. Sed fermentum, dui at molestie convallis, nisi quam hendrerit nibh, sed pharetra lectus mi at enim. Ut ut nunc nunc.

Vivamus ut vehicula turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam mauris mauris, porta ac nisi non, aliquet commodo mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed egestas faucibus urna, id mattis dolor gravida vel. Maecenas iaculis convallis diam egestas molestie. Quisque nec tincidunt dolor, eu interdum urna. Nam dictum dui viverra, aliquet metus nec, egestas orci. Morbi cursus leo ipsum, vitae feugiat quam porta a. Pellentesque viverra neque et nulla varius condimentum eu id metus. Phasellus consequat elit vitae leo gravida, sed malesuada eros aliquet. """,
            images: [
              "assets/images_posts/Screenshot 2023-08-06 150447.png",
              "assets/images_posts/Screenshot 2024-10-04 102509.png",
              "assets/images_posts/Screenshot 2024-09-20 152333.png",
              "assets/images_posts/Screenshot 2023-12-31 100011.png",
            ],
          ),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      controller: _scrollController,
      slivers: [
        const CustomSliverAppBar(pinned: false, floating: false, addpost: true),
        SliverList(
          delegate: SliverChildBuilderDelegate((context, index) {
            final post = _posts[index];
            return Post(
              title: post.title,
              description: post.description,
              images: post.images,
            );
          }, childCount: _posts.length),
        ),
      ],
    );
  }
}
