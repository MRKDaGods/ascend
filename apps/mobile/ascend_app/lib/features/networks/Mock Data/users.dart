import 'package:ascend_app/features/networks/model/user_model.dart';

UserModel getUser(String id) {
  return generateUsers().firstWhere((element) => element.id == id);
}

List<UserModel> generateUsers() {
  return [
    UserModel(
      id: '1',
      name: 'John Doe',
      company: 'Company A',
      industry: 'Industry A',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pexels-karymefranca-1535907.jpg',
      bio: 'Engineer at Company A',
    ),
    UserModel(
      id: '2',
      name: 'Jane Doe',
      company: 'Company B',
      industry: 'Industry B',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pexels-karymefranca-1535907.jpg',
      bio: 'Manager at Company B',
    ),
    UserModel(
      id: '3',
      name: 'Alice',
      company: 'Company C',
      industry: 'Industry C',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Developer at Company C',
    ),
    UserModel(
      id: '4',
      name: 'Bob',
      company: 'Company D',
      industry: 'Industry D',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Designer at Company D',
    ),
    UserModel(
      id: '5',
      name: 'Charlie',
      company: 'Company E',
      industry: 'Industry E',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Analyst at Company E',
    ),
    UserModel(
      id: '6',
      name: 'David',
      company: 'Company F',
      industry: 'Industry F',
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Consultant at Company F',
    ),
    UserModel(
      id: '7',
      name: 'Eve',
      company: 'Company G',
      industry: 'Industry G',
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'HR at Company G',
    ),
    UserModel(
      id: '8',
      name: 'Frank',
      company: 'Company H',
      industry: 'Industry H',
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'Marketing at Company H',
    ),
    UserModel(
      id: '9',
      name: 'Grace',
      company: 'Company I',
      industry: 'Industry I',
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'Sales at Company I',
    ),
    UserModel(
      id: '10',
      name: 'Henry',
      company: 'Company J',
      industry: 'Industry J',
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/logo.jpg',
      bio: 'Engineer at Company J',
    ),
  ];
}
