#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "${BASH_SOURCE[0]}")"

show_menu() {
    echo "Choose a platform to build for:"
    echo "1) iOS (64-bit ARM) - aarch64-apple-ios"
    echo "2) Android (64-bit ARM) - aarch64-linux-android"
    echo "3) Android (32-bit ARM) - armv7-linux-androideabi"
    echo "4) Android (32-bit x86) - i686-linux-android"
    echo "5) WebAssembly - wasm"
    echo "q) Quit"
    echo
    read -p "[1-5 or q]: " chosenPlatform
}

# Check number of args
if [ $# -eq 0 ]; then
    show_menu
    
    case $chosenPlatform in
        1) platform="aarch64-apple-ios" ;;
        2) platform="aarch64-linux-android" ;;
        3) platform="armv7-linux-androideabi" ;;
        4) platform="i686-linux-android" ;;
        5) platform="wasm" ;;
        q|Q) echo "Exiting."; exit 0 ;;
        *) echo "Invalid choice. Exiting."; exit 1 ;;
    esac
else
    # Use the provided platform directly
    echo "Using provided platform: $1"
    platform=$1
fi

# Build selected platform
case "$platform" in
    "aarch64-apple-ios")
        echo "Building for iOS (64-bit ARM)..."
        ;;
    "aarch64-linux-android")
        echo "Building for Android (64-bit ARM)..."
        ;;
    "armv7-linux-androideabi")
        echo "Building for Android (32-bit ARM)..."
        ;;
    "i686-linux-android")
        echo "Building for Android (32-bit x86)..."
        ;;
    "wasm")
        echo "Building for WebAssembly..."
        ./build-wasm.sh
        ;;
    *)
        echo "Unsupported platform: $platform"
        exit 1
        ;;
esac

echo "Build completed for $platform"
