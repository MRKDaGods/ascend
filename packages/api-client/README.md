# API Client (Rust)

Cross-platform API client written in Rust. Compiles to WASM for the web app (via wasm-bindgen) and to native code for Flutter (via flutter_rust_bridge). One codebase, two targets.

## Why Rust

Type-safe API calls across both platforms without duplicating HTTP client code in TypeScript and Dart. The request logic and data models are defined once in Rust and compiled to each target.

## Structure

```
src/
  lib.rs              # Crate root, conditional exports
  client.rs           # Core ApiClient (reqwest HTTP client + auth token)
  errors.rs           # Error types
  utils.rs            # Helpers
  models/
    user.rs           # User and profile types
    file.rs           # File metadata
    notification.rs   # Notification types
  services/
    auth.rs           # Login, register, logout, OAuth
    user.rs           # Profile CRUD, photo uploads, resume
    notification.rs   # List, mark read, delete notifications
  bindings/
    wasm.rs           # WasmApiClient with #[wasm_bindgen]
    ffi.rs            # FfiApiClient with #[frb] annotations
```

## How It Works

`ApiClient` is the core struct. It wraps a `reqwest::Client` with a base URL and an optional auth token. Service modules (`services/auth.rs`, `services/user.rs`, etc.) add typed methods on `ApiClient` for each API endpoint.

Two binding layers expose `ApiClient` to each platform:

- **`bindings/wasm.rs`**: Wraps `ApiClient` in `WasmApiClient` with `#[wasm_bindgen]` attributes. Serializes Rust types to/from `JsValue` via `serde-wasm-bindgen`. Only compiled when `target_arch = "wasm32"`.
- **`bindings/ffi.rs`**: Wraps `ApiClient` in `FfiApiClient` with `#[frb]` attributes for flutter_rust_bridge code generation. Compiled for non-WASM targets.

## Building

### For Web (WASM)

```bash
cd packages/api-client
wasm-pack build --target web
```

Output goes to `pkg/`. The web app imports it as `@ascend/api-client` via a webpack alias.

### For Flutter (FFI)

```bash
cd packages/api-client
# flutter_rust_bridge codegen (run from the mobile app)
cargo build
```

The Flutter app links to the compiled native library through flutter_rust_bridge's generated Dart bindings.

## Dependencies

| Crate | Purpose |
|-------|---------|
| reqwest | HTTP client (rustls-tls, JSON, multipart) |
| serde / serde_json | Serialization |
| wasm-bindgen | WASM bindings for browser |
| flutter_rust_bridge | FFI bindings for Flutter/Dart |
| chrono | Date/time handling |
| thiserror | Error type derivation |

## Supported Endpoints

| Service | Methods |
|---------|---------|
| Auth | Login, register, logout, refresh token |
| User | Get/update profile, upload/delete profile picture, cover photo, resume |
| Notification | List notifications, mark read, delete |
