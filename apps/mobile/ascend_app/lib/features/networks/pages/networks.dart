import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/grow.dart';
import 'package:ascend_app/features/networks/widgets/catchup.dart';

import '../../../shared/widgets/custom_sliver_appbar.dart';

class Networks extends StatelessWidget {
  const Networks({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: DefaultTabController(
        length: 2,
        child: CustomScrollView(
          slivers: [
            const CustomSliverAppBar(floating: false, showTabBar: true),
            SliverFillRemaining(
              child: TabBarView(children: [Grow(), CatchUp()]),
            ),
          ],
        ),
      ),
    );
  }
}
