import 'package:ascend_app/features/networks/bloc/bloc/follow/bloc/follow_bloc.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/networks/widgets/grow.dart';
import 'package:ascend_app/features/networks/widgets/catchup.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/connection_request/bloc/connection_request_bloc.dart';
import 'package:ascend_app/features/networks/bloc/bloc/search_filters/bloc/search_filters_bloc.dart';
import 'package:ascend_app/features/networks/model/search_model.dart';

import '../../../shared/widgets/custom_sliver_appbar.dart';

class Networks extends StatelessWidget {
  const Networks({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<ConnectionRequestBloc>(
          create: (requestsContext) {
            final bloc = ConnectionRequestBloc();
            bloc.add(FetchConnectionRequests());
            return bloc;
          },
        ),
        BlocProvider<FollowBloc>(
          create: (followContext) => FollowBloc()..add(FetchFollowing()),
        ),
        BlocProvider<SearchFiltersBloc>(
          create: (searchContext) {
            final bloc = SearchFiltersBloc();
            bloc.add(SearchFiltersFetch());
            return bloc;
          },
        ),
      ],
      child: Scaffold(
        body: DefaultTabController(
          length: 2,
          child: CustomScrollView(
            slivers: [
              const CustomSliverAppBar(floating: false, showTabBar: true),
              SliverFillRemaining(
                hasScrollBody: true,
                child: SizedBox(
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                  child: TabBarView(children: [Grow(), CatchUp()]),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
