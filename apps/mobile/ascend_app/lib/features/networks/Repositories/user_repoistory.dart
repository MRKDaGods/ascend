import 'package:ascend_app/features/networks/Mock%20Data/users.dart';
import 'package:ascend_app/features/networks/model/user_model.dart';

class UserRepoistory {
  final List<UserModel> users = generateUsers();

  Future<UserModel> getUser(String userId) async {
    // Mock API delay
    await Future.delayed(Duration(milliseconds: 500));
    return users.firstWhere((element) => element.id == userId);
  }
}
