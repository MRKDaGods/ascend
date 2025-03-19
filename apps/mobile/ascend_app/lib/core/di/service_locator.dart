import 'package:ascend_app/features/home/data/datasources/post_data_source.dart';
import 'package:ascend_app/features/home/data/repositories/post_repository_impl.dart';
import 'package:ascend_app/features/home/domain/repositories/post_repository.dart';
import 'package:get_it/get_it.dart';

final serviceLocator = GetIt.instance;

void setupServiceLocator() {
  // Data sources
  serviceLocator.registerLazySingleton<PostDataSource>(
    () => LocalPostDataSource(),
  );

  // Repositories
  serviceLocator.registerLazySingleton<PostRepository>(
    () => PostRepositoryImpl(dataSource: serviceLocator()),
  );
}