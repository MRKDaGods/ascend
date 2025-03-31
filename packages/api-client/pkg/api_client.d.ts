/* tslint:disable */
/* eslint-disable */
export class WasmApiClient {
  free(): void;
  constructor(base_url: string);
  set_auth_token(token: string): void;
  get_auth_token(): string;
  get_gateway_health(): Promise<string>;
  login(email: string, password: string): Promise<any>;
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
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_export_5: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h2ade3ec9598a0224: (a: number, b: number) => void;
  readonly closure117_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure162_externref_shim: (a: number, b: number, c: any, d: any) => void;
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
