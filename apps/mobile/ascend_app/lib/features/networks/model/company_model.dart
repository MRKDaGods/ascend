import 'package:flutter/material.dart';

class CompanyModel {
  final String companyId;
  final String companyName;
  final String companyLogoUrl;
  final String companyDescription;
  final String companyLocation;
  final String companyIndustry;
  final DateTime companyCreatedAt;
  final String companyCreatedBy;

  CompanyModel({
    required this.companyId,
    required this.companyName,
    required this.companyLogoUrl,
    required this.companyDescription,
    required this.companyLocation,
    required this.companyIndustry,
    required this.companyCreatedAt,
    required this.companyCreatedBy,
  });

  CompanyModel copyWith({
    String? companyId,
    String? companyName,
    String? companyLogoUrl,
    String? companyDescription,
    String? companyLocation,
    String? companyIndustry,
    DateTime? companyCreatedAt,
    String? companyCreatedBy,
  }) {
    return CompanyModel(
      companyId: companyId ?? this.companyId,
      companyName: companyName ?? this.companyName,
      companyLogoUrl: companyLogoUrl ?? this.companyLogoUrl,
      companyDescription: companyDescription ?? this.companyDescription,
      companyLocation: companyLocation ?? this.companyLocation,
      companyIndustry: companyIndustry ?? this.companyIndustry,
      companyCreatedAt: companyCreatedAt ?? this.companyCreatedAt,
      companyCreatedBy: companyCreatedBy ?? this.companyCreatedBy,
    );
  }

  factory CompanyModel.fromJson(Map<String, dynamic> json) {
    return CompanyModel(
      companyId: json["companyId"],
      companyName: json["companyName"],
      companyLogoUrl: json["companyLogoUrl"],
      companyDescription: json["companyDescription"],
      companyLocation: json["companyLocation"],
      companyIndustry: json["companyIndustry"],
      companyCreatedAt: DateTime.parse(json["companyCreatedAt"]),
      companyCreatedBy: json["companyCreatedBy"],
    );
  }

  Map<String, dynamic> toJson() => {
    "companyId": companyId,
    "companyName": companyName,
    "companyLogoUrl": companyLogoUrl,
    "companyDescription": companyDescription,
    "companyLocation": companyLocation,
    "companyIndustry": companyIndustry,
    "companyCreatedAt": companyCreatedAt.toIso8601String(),
    "companyCreatedBy": companyCreatedBy,
  };
}
