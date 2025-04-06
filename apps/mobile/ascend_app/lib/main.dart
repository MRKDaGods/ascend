import 'package:ascend_app/theme.dart';
import 'package:flutter/material.dart';
import 'package:ascend_app/features/StartPages/welcome.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'features/profile/bloc/user_profile_bloc.dart';
import 'features/profile/bloc/user_profile_event.dart';
import 'features/home/bloc/post_bloc/post_bloc.dart';
import 'features/home/bloc/post_bloc/post_event.dart';
import 'features/home/repositories/post_repository.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<UserProfileBloc>(
          create: (context) => UserProfileBloc()..add(const LoadUserProfile()),
        ),
        BlocProvider<PostBloc>(
          create: (context) => PostBloc(
            PostRepository(),  // Change to positional parameter
          )..add(const LoadPosts()),
        ),
        // Add other BLoCs here as needed
      ],
      child: MaterialApp(
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        debugShowCheckedModeBanner: false,
        home: const Welcome(),
      ),
    );
  }
}
