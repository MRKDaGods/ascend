import 'package:flutter/material.dart';

class AdvertisingDataPage extends StatefulWidget {
  const AdvertisingDataPage({super.key});

  @override
  State<AdvertisingDataPage> createState() => _AdvertisingDataPageState();
}

class _AdvertisingDataPageState extends State<AdvertisingDataPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advertising Data')),
      body: const Center(child: Text('Advertising Data Page')),
    );
  }
}
