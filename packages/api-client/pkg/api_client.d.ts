/* tslint:disable */
/* eslint-disable */
export class WasmApiClient {
  free(): void;
  constructor(base_url: string);
  set_auth_token(token: string): void;
  get_auth_token(): string;
  get_gateway_health(): Promise<string>;
  login(email: string, password: string): Promise<any>;
  register(first_name: string, last_name: string, email: string, password: string): Promise<any>;
  resend_confirm_email(email: string): Promise<any>;
  update_password(old_password: string, new_password: string): Promise<any>;
  update_email(new_email: string): Promise<any>;
  forget_password(email: string): Promise<any>;
  reset_password(token: string, new_password: string): Promise<any>;
  delete_account(): Promise<any>;
  logout(): Promise<any>;
  get_local_user_profile(): Promise<any>;
  update_local_user_profile(profile: any): Promise<any>;
  upload_profile_picture(name: string, mime: string, buffer: Uint8Array): Promise<any>;
  delete_profile_picture(): Promise<any>;
  upload_cover_photo(name: string, mime: string, buffer: Uint8Array): Promise<any>;
  delete_cover_photo(): Promise<any>;
  upload_resume(name: string, mime: string, buffer: Uint8Array): Promise<any>;
  delete_resume(): Promise<any>;
  get_notifications(page?: number | null): Promise<any>;
  mark_notification_as_read(notification_id: number): Promise<any>;
  delete_notification(notification_id: number): Promise<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmapiclient_free: (a: number, b: number) => void;
  readonly wasmapiclient_new: (a: number, b: number) => number;
  readonly wasmapiclient_set_auth_token: (a: number, b: number, c: number) => void;
  readonly wasmapiclient_get_auth_token: (a: number) => [number, number, number, number];
  readonly wasmapiclient_get_gateway_health: (a: number) => any;
  readonly wasmapiclient_login: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly wasmapiclient_register: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => any;
  readonly wasmapiclient_resend_confirm_email: (a: number, b: number, c: number) => any;
  readonly wasmapiclient_update_password: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly wasmapiclient_update_email: (a: number, b: number, c: number) => any;
  readonly wasmapiclient_forget_password: (a: number, b: number, c: number) => any;
  readonly wasmapiclient_reset_password: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly wasmapiclient_delete_account: (a: number) => any;
  readonly wasmapiclient_logout: (a: number) => any;
  readonly wasmapiclient_get_local_user_profile: (a: number) => any;
  readonly wasmapiclient_update_local_user_profile: (a: number, b: any) => any;
  readonly wasmapiclient_upload_profile_picture: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
  readonly wasmapiclient_delete_profile_picture: (a: number) => any;
  readonly wasmapiclient_upload_cover_photo: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
  readonly wasmapiclient_delete_cover_photo: (a: number) => any;
  readonly wasmapiclient_upload_resume: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => any;
  readonly wasmapiclient_delete_resume: (a: number) => any;
  readonly wasmapiclient_get_notifications: (a: number, b: number) => any;
  readonly wasmapiclient_mark_notification_as_read: (a: number, b: number) => any;
  readonly wasmapiclient_delete_notification: (a: number, b: number) => any;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_export_5: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3360e2c19bacbc8b: (a: number, b: number) => void;
  readonly closure258_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure306_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
