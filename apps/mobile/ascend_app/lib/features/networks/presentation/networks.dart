import 'package:flutter/material.dart';

import '../../../shared/widgets/custom_sliver_appbar.dart';

class Networks extends StatelessWidget {
  const Networks({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        body: SafeArea(
          child: NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                CustomSliverAppBar(
                  pinned: true,
                  
                  showTabBar: true,
                ),
              ];
            },
            body: TabBarView(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text('Grow', style: TextStyle(fontSize: 18)),
                    ],
                  ),
                ),
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text('Catchup', style: TextStyle(fontSize: 18)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
