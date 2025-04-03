import 'package:ascend_app/features/networks/model/user_model.dart';

UserModel getUser(String id) {
  return generateUsers().firstWhere((element) => element.id == id);
}

List<UserModel> generateUsers() {
  return [
    UserModel(
      id: '1',
      name: 'John Doe',
      companyId: '1', // Google
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pexels-karymefranca-1535907.jpg',
      bio: 'Software Engineer at Google',
      firstFollow: false,
      firstConnect: true,
    ),
    UserModel(
      id: '2',
      name: 'Jane Doe',
      companyId: '2', // Facebook
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pexels-karymefranca-1535907.jpg',
      bio: 'Product Manager at Facebook',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '3',
      name: 'Alice',
      companyId: '1', // Google
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Frontend Developer at Google',
      firstConnect: false,
      firstFollow: true,
    ),
    UserModel(
      id: '4',
      name: 'Bob',
      companyId: '2', // Facebook
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 2.jpg',
      bio: 'UI/UX Designer at Facebook',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '5',
      name: 'Charlie Ronaldo',
      companyId: '3', // Amazon
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Data Analyst at Amazon',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '6',
      name: 'David',
      companyId: '4', // Apple
      profilePic: 'assets/logo.jpg',
      coverpic: 'assets/pic 3.jpg',
      bio: 'iOS Developer at Apple',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '7',
      name: 'Eve',
      companyId: '5', // Microsoft
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'HR Specialist at Microsoft',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '8',
      name: 'Frank',
      companyId: '4', // Apple
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'Marketing Manager at Apple',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '9',
      name: 'Grace',
      companyId: '6', // Netflix
      profilePic: 'assets/pexels-karymefranca-1535907.jpg',
      coverpic: 'assets/image 4.jpg',
      bio: 'Content Strategist at Netflix',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '10',
      name: 'Henry',
      companyId: '7', // Tesla
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/logo.jpg',
      bio: 'Mechanical Engineer at Tesla',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '11',
      name: 'Ivy',
      companyId: '1', // Google
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/logo.jpg',
      bio: 'AI Researcher at Google',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '12',
      name: 'Jack',
      companyId: '2', // Facebook
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Backend Developer at Facebook',
      firstConnect: true,
      firstFollow: false,
    ),
    UserModel(
      id: '13',
      name: 'Kate',
      companyId: '3', // Amazon
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Cloud Solutions Architect at Amazon',
      firstConnect: false,
      firstFollow: true,
    ),
    UserModel(
      id: '14',
      name: 'Liam',
      companyId: '4', // Apple
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Financial Analyst at Apple',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '15',
      name: 'Mia',
      companyId: '5', // Microsoft
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Product Manager at Microsoft',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '16',
      name: 'Nathan',
      companyId: '6', // Netflix
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/image 4.jpg',
      bio: 'Data Scientist at Netflix',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '17',
      name: 'Olivia',
      companyId: '7', // Tesla
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/image 4.jpg',
      bio: 'Electrical Engineer at Tesla',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '18',
      name: 'Peter',
      companyId: '1', // Google
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/image 4.jpg',
      bio: 'Product Marketing Manager at Google',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '19',
      name: 'Quinn',
      companyId: '2', // Facebook
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/logo.jpg',
      bio: 'Security Engineer at Facebook',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '20',
      name: 'Rose',
      companyId: '3', // Amazon
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/logo.jpg',
      bio: 'UX Researcher at Amazon',
      firstFollow: true,
      firstConnect: false,
    ),
    UserModel(
      id: '21',
      name: 'Sam',
      companyId: '4', // Apple
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Machine Learning Engineer at Apple',
      firstFollow: false,
      firstConnect: true,
    ),
    UserModel(
      id: '22',
      name: 'Tina',
      companyId: '5', // Microsoft
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 2.jpg',
      bio: 'Software Engineer at Microsoft',
      firstFollow: false,
      firstConnect: true,
    ),
    UserModel(
      id: '23',
      name: 'Umar',
      companyId: '6', // Netflix
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Performance Engineer at Netflix',
      firstFollow: false,
      firstConnect: true,
    ),
    UserModel(
      id: '24',
      name: 'Vivian',
      companyId: '7', // Tesla
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/pic 3.jpg',
      bio: 'Design Engineer at Tesla',
      firstFollow: false,
      firstConnect: true,
    ),
    UserModel(
      id: '25',
      name: 'Will',
      companyId: '1', // Google
      profilePic: 'assets/facebook.png',
      coverpic: 'assets/image 4.jpg',
      bio: 'Network Engineer at Google',
      firstFollow: false,
      firstConnect: true,
    ),
  ];
}
