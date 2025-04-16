// This file is automatically generated, so please do not edit it.
// @generated by `flutter_rust_bridge`@ 2.9.0.

// ignore_for_file: unused_import, unused_element, unnecessary_import, duplicate_ignore, invalid_use_of_internal_member, annotate_overrides, non_constant_identifier_names, curly_braces_in_flow_control_structures, prefer_const_literals_to_create_immutables, unused_field

// Static analysis wrongly picks the IO variant, thus ignore this
// ignore_for_file: argument_type_not_assignable

import 'bindings/ffi.dart';
import 'dart:async';
import 'dart:convert';
import 'frb_generated.dart';
import 'lib.dart';
import 'models/notification.dart';
import 'models/profile.dart';
import 'package:flutter_rust_bridge/flutter_rust_bridge_for_generated_web.dart';
import 'services/auth.dart';

abstract class RustLibApiImplPlatform extends BaseApiImpl<RustLibWire> {
  RustLibApiImplPlatform({
    required super.handler,
    required super.wire,
    required super.generalizedFrbRustBinding,
    required super.portManager,
  });

  CrossPlatformFinalizerArg
  get rust_arc_decrement_strong_count_FfiApiClientPtr =>
      wire.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient;

  CrossPlatformFinalizerArg get rust_arc_decrement_strong_count_ValuePtr =>
      wire.rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue;

  @protected
  FfiApiClient
  dco_decode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    dynamic raw,
  );

  @protected
  Value
  dco_decode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    dynamic raw,
  );

  @protected
  FfiApiClient
  dco_decode_Auto_RefMut_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    dynamic raw,
  );

  @protected
  FfiApiClient
  dco_decode_Auto_Ref_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    dynamic raw,
  );

  @protected
  DateTime dco_decode_Chrono_Utc(dynamic raw);

  @protected
  FfiApiClient
  dco_decode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    dynamic raw,
  );

  @protected
  Value
  dco_decode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    dynamic raw,
  );

  @protected
  String dco_decode_String(dynamic raw);

  @protected
  bool dco_decode_bool(dynamic raw);

  @protected
  Value
  dco_decode_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    dynamic raw,
  );

  @protected
  DateTime dco_decode_box_autoadd_Chrono_Utc(dynamic raw);

  @protected
  bool dco_decode_box_autoadd_bool(dynamic raw);

  @protected
  ContactInfo dco_decode_box_autoadd_contact_info(dynamic raw);

  @protected
  int dco_decode_box_autoadd_i_32(dynamic raw);

  @protected
  PhoneType dco_decode_box_autoadd_phone_type(dynamic raw);

  @protected
  Profile dco_decode_box_autoadd_profile(dynamic raw);

  @protected
  ContactInfo dco_decode_contact_info(dynamic raw);

  @protected
  Course dco_decode_course(dynamic raw);

  @protected
  Education dco_decode_education(dynamic raw);

  @protected
  Experience dco_decode_experience(dynamic raw);

  @protected
  int dco_decode_i_32(dynamic raw);

  @protected
  PlatformInt64 dco_decode_i_64(dynamic raw);

  @protected
  Interest dco_decode_interest(dynamic raw);

  @protected
  List<Course> dco_decode_list_course(dynamic raw);

  @protected
  List<Education> dco_decode_list_education(dynamic raw);

  @protected
  List<Experience> dco_decode_list_experience(dynamic raw);

  @protected
  List<Interest> dco_decode_list_interest(dynamic raw);

  @protected
  List<Notification> dco_decode_list_notification(dynamic raw);

  @protected
  List<int> dco_decode_list_prim_u_8_loose(dynamic raw);

  @protected
  Uint8List dco_decode_list_prim_u_8_strict(dynamic raw);

  @protected
  List<Project> dco_decode_list_project(dynamic raw);

  @protected
  List<Skill> dco_decode_list_skill(dynamic raw);

  @protected
  LoginResponse dco_decode_login_response(dynamic raw);

  @protected
  Notification dco_decode_notification(dynamic raw);

  @protected
  NotificationType dco_decode_notification_type(dynamic raw);

  @protected
  String? dco_decode_opt_String(dynamic raw);

  @protected
  Value?
  dco_decode_opt_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    dynamic raw,
  );

  @protected
  DateTime? dco_decode_opt_box_autoadd_Chrono_Utc(dynamic raw);

  @protected
  bool? dco_decode_opt_box_autoadd_bool(dynamic raw);

  @protected
  ContactInfo? dco_decode_opt_box_autoadd_contact_info(dynamic raw);

  @protected
  int? dco_decode_opt_box_autoadd_i_32(dynamic raw);

  @protected
  PhoneType? dco_decode_opt_box_autoadd_phone_type(dynamic raw);

  @protected
  List<Course>? dco_decode_opt_list_course(dynamic raw);

  @protected
  List<Education>? dco_decode_opt_list_education(dynamic raw);

  @protected
  List<Experience>? dco_decode_opt_list_experience(dynamic raw);

  @protected
  List<Interest>? dco_decode_opt_list_interest(dynamic raw);

  @protected
  List<Project>? dco_decode_opt_list_project(dynamic raw);

  @protected
  List<Skill>? dco_decode_opt_list_skill(dynamic raw);

  @protected
  PhoneType dco_decode_phone_type(dynamic raw);

  @protected
  Profile dco_decode_profile(dynamic raw);

  @protected
  Project dco_decode_project(dynamic raw);

  @protected
  RegisterResponse dco_decode_register_response(dynamic raw);

  @protected
  Skill dco_decode_skill(dynamic raw);

  @protected
  int dco_decode_u_8(dynamic raw);

  @protected
  void dco_decode_unit(dynamic raw);

  @protected
  BigInt dco_decode_usize(dynamic raw);

  @protected
  FfiApiClient
  sse_decode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    SseDeserializer deserializer,
  );

  @protected
  Value
  sse_decode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    SseDeserializer deserializer,
  );

  @protected
  FfiApiClient
  sse_decode_Auto_RefMut_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    SseDeserializer deserializer,
  );

  @protected
  FfiApiClient
  sse_decode_Auto_Ref_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    SseDeserializer deserializer,
  );

  @protected
  DateTime sse_decode_Chrono_Utc(SseDeserializer deserializer);

  @protected
  FfiApiClient
  sse_decode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    SseDeserializer deserializer,
  );

  @protected
  Value
  sse_decode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    SseDeserializer deserializer,
  );

  @protected
  String sse_decode_String(SseDeserializer deserializer);

  @protected
  bool sse_decode_bool(SseDeserializer deserializer);

  @protected
  Value
  sse_decode_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    SseDeserializer deserializer,
  );

  @protected
  DateTime sse_decode_box_autoadd_Chrono_Utc(SseDeserializer deserializer);

  @protected
  bool sse_decode_box_autoadd_bool(SseDeserializer deserializer);

  @protected
  ContactInfo sse_decode_box_autoadd_contact_info(SseDeserializer deserializer);

  @protected
  int sse_decode_box_autoadd_i_32(SseDeserializer deserializer);

  @protected
  PhoneType sse_decode_box_autoadd_phone_type(SseDeserializer deserializer);

  @protected
  Profile sse_decode_box_autoadd_profile(SseDeserializer deserializer);

  @protected
  ContactInfo sse_decode_contact_info(SseDeserializer deserializer);

  @protected
  Course sse_decode_course(SseDeserializer deserializer);

  @protected
  Education sse_decode_education(SseDeserializer deserializer);

  @protected
  Experience sse_decode_experience(SseDeserializer deserializer);

  @protected
  int sse_decode_i_32(SseDeserializer deserializer);

  @protected
  PlatformInt64 sse_decode_i_64(SseDeserializer deserializer);

  @protected
  Interest sse_decode_interest(SseDeserializer deserializer);

  @protected
  List<Course> sse_decode_list_course(SseDeserializer deserializer);

  @protected
  List<Education> sse_decode_list_education(SseDeserializer deserializer);

  @protected
  List<Experience> sse_decode_list_experience(SseDeserializer deserializer);

  @protected
  List<Interest> sse_decode_list_interest(SseDeserializer deserializer);

  @protected
  List<Notification> sse_decode_list_notification(SseDeserializer deserializer);

  @protected
  List<int> sse_decode_list_prim_u_8_loose(SseDeserializer deserializer);

  @protected
  Uint8List sse_decode_list_prim_u_8_strict(SseDeserializer deserializer);

  @protected
  List<Project> sse_decode_list_project(SseDeserializer deserializer);

  @protected
  List<Skill> sse_decode_list_skill(SseDeserializer deserializer);

  @protected
  LoginResponse sse_decode_login_response(SseDeserializer deserializer);

  @protected
  Notification sse_decode_notification(SseDeserializer deserializer);

  @protected
  NotificationType sse_decode_notification_type(SseDeserializer deserializer);

  @protected
  String? sse_decode_opt_String(SseDeserializer deserializer);

  @protected
  Value?
  sse_decode_opt_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    SseDeserializer deserializer,
  );

  @protected
  DateTime? sse_decode_opt_box_autoadd_Chrono_Utc(SseDeserializer deserializer);

  @protected
  bool? sse_decode_opt_box_autoadd_bool(SseDeserializer deserializer);

  @protected
  ContactInfo? sse_decode_opt_box_autoadd_contact_info(
    SseDeserializer deserializer,
  );

  @protected
  int? sse_decode_opt_box_autoadd_i_32(SseDeserializer deserializer);

  @protected
  PhoneType? sse_decode_opt_box_autoadd_phone_type(
    SseDeserializer deserializer,
  );

  @protected
  List<Course>? sse_decode_opt_list_course(SseDeserializer deserializer);

  @protected
  List<Education>? sse_decode_opt_list_education(SseDeserializer deserializer);

  @protected
  List<Experience>? sse_decode_opt_list_experience(
    SseDeserializer deserializer,
  );

  @protected
  List<Interest>? sse_decode_opt_list_interest(SseDeserializer deserializer);

  @protected
  List<Project>? sse_decode_opt_list_project(SseDeserializer deserializer);

  @protected
  List<Skill>? sse_decode_opt_list_skill(SseDeserializer deserializer);

  @protected
  PhoneType sse_decode_phone_type(SseDeserializer deserializer);

  @protected
  Profile sse_decode_profile(SseDeserializer deserializer);

  @protected
  Project sse_decode_project(SseDeserializer deserializer);

  @protected
  RegisterResponse sse_decode_register_response(SseDeserializer deserializer);

  @protected
  Skill sse_decode_skill(SseDeserializer deserializer);

  @protected
  int sse_decode_u_8(SseDeserializer deserializer);

  @protected
  void sse_decode_unit(SseDeserializer deserializer);

  @protected
  BigInt sse_decode_usize(SseDeserializer deserializer);

  @protected
  void
  sse_encode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    FfiApiClient self,
    SseSerializer serializer,
  );

  @protected
  void
  sse_encode_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    Value self,
    SseSerializer serializer,
  );

  @protected
  void
  sse_encode_Auto_RefMut_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    FfiApiClient self,
    SseSerializer serializer,
  );

  @protected
  void
  sse_encode_Auto_Ref_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    FfiApiClient self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_Chrono_Utc(DateTime self, SseSerializer serializer);

  @protected
  void
  sse_encode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    FfiApiClient self,
    SseSerializer serializer,
  );

  @protected
  void
  sse_encode_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    Value self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_String(String self, SseSerializer serializer);

  @protected
  void sse_encode_bool(bool self, SseSerializer serializer);

  @protected
  void
  sse_encode_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    Value self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_box_autoadd_Chrono_Utc(
    DateTime self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_box_autoadd_bool(bool self, SseSerializer serializer);

  @protected
  void sse_encode_box_autoadd_contact_info(
    ContactInfo self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_box_autoadd_i_32(int self, SseSerializer serializer);

  @protected
  void sse_encode_box_autoadd_phone_type(
    PhoneType self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_box_autoadd_profile(Profile self, SseSerializer serializer);

  @protected
  void sse_encode_contact_info(ContactInfo self, SseSerializer serializer);

  @protected
  void sse_encode_course(Course self, SseSerializer serializer);

  @protected
  void sse_encode_education(Education self, SseSerializer serializer);

  @protected
  void sse_encode_experience(Experience self, SseSerializer serializer);

  @protected
  void sse_encode_i_32(int self, SseSerializer serializer);

  @protected
  void sse_encode_i_64(PlatformInt64 self, SseSerializer serializer);

  @protected
  void sse_encode_interest(Interest self, SseSerializer serializer);

  @protected
  void sse_encode_list_course(List<Course> self, SseSerializer serializer);

  @protected
  void sse_encode_list_education(
    List<Education> self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_list_experience(
    List<Experience> self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_list_interest(List<Interest> self, SseSerializer serializer);

  @protected
  void sse_encode_list_notification(
    List<Notification> self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_list_prim_u_8_loose(List<int> self, SseSerializer serializer);

  @protected
  void sse_encode_list_prim_u_8_strict(
    Uint8List self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_list_project(List<Project> self, SseSerializer serializer);

  @protected
  void sse_encode_list_skill(List<Skill> self, SseSerializer serializer);

  @protected
  void sse_encode_login_response(LoginResponse self, SseSerializer serializer);

  @protected
  void sse_encode_notification(Notification self, SseSerializer serializer);

  @protected
  void sse_encode_notification_type(
    NotificationType self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_String(String? self, SseSerializer serializer);

  @protected
  void
  sse_encode_opt_box_autoadd_Auto_Owned_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    Value? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_box_autoadd_Chrono_Utc(
    DateTime? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_box_autoadd_bool(bool? self, SseSerializer serializer);

  @protected
  void sse_encode_opt_box_autoadd_contact_info(
    ContactInfo? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_box_autoadd_i_32(int? self, SseSerializer serializer);

  @protected
  void sse_encode_opt_box_autoadd_phone_type(
    PhoneType? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_list_course(List<Course>? self, SseSerializer serializer);

  @protected
  void sse_encode_opt_list_education(
    List<Education>? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_list_experience(
    List<Experience>? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_list_interest(
    List<Interest>? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_list_project(
    List<Project>? self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_opt_list_skill(List<Skill>? self, SseSerializer serializer);

  @protected
  void sse_encode_phone_type(PhoneType self, SseSerializer serializer);

  @protected
  void sse_encode_profile(Profile self, SseSerializer serializer);

  @protected
  void sse_encode_project(Project self, SseSerializer serializer);

  @protected
  void sse_encode_register_response(
    RegisterResponse self,
    SseSerializer serializer,
  );

  @protected
  void sse_encode_skill(Skill self, SseSerializer serializer);

  @protected
  void sse_encode_u_8(int self, SseSerializer serializer);

  @protected
  void sse_encode_unit(void self, SseSerializer serializer);

  @protected
  void sse_encode_usize(BigInt self, SseSerializer serializer);
}

// Section: wire_class

class RustLibWire implements BaseWire {
  RustLibWire.fromExternalLibrary(ExternalLibrary lib);

  void
  rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    int ptr,
  ) => wasmModule
      .rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
        ptr,
      );

  void
  rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    int ptr,
  ) => wasmModule
      .rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
        ptr,
      );

  void
  rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    int ptr,
  ) => wasmModule
      .rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
        ptr,
      );

  void
  rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    int ptr,
  ) => wasmModule
      .rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
        ptr,
      );
}

@JS('wasm_bindgen')
external RustLibWasmModule get wasmModule;

@JS()
@anonymous
extension type RustLibWasmModule._(JSObject _) implements JSObject {
  external void
  rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    int ptr,
  );

  external void
  rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerFfiApiClient(
    int ptr,
  );

  external void
  rust_arc_increment_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    int ptr,
  );

  external void
  rust_arc_decrement_strong_count_RustOpaque_flutter_rust_bridgefor_generatedRustAutoOpaqueInnerValue(
    int ptr,
  );
}
