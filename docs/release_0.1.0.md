# Tetorica SPU Synth v0.1.0 — Preview

The first desktop preview of Tetorica SPU Synth, a PlayStation 1 SPU synthesizer / emulator.

- 24 SPU voices, PCM / ADPCM, editable ADSR, shared SPU reverb, pitch modulation and SPU Noise.
- Software morph, waveform drawing, audio sample loading and PSF / VAB instrument import.
- Computer keyboard performance with octave, Pitch and Morph controls.
- Native preset save dialogs, Pin and Reload, with a Menu / Pin toolbar matching FM2612 Synth.
- Web Audio output by default; optional final-PCM output through Rust / CPAL with device selection.

## Downloads

Choose the installer for your operating system and CPU:

- macOS: Apple Silicon (`aarch64`) or Intel (`x64`) DMG.
- Windows: x64 setup EXE.
- Linux: x86_64 or ARM64 DEB / AppImage.

Builds are unsigned; macOS builds are not notarized.

## Getting started

Open the app, click **Enable audio**, and play the computer keyboard or the on-screen keys.
Use **Menu → Import / Export** for SPU presets and the **PSF / VAB** tab for sound banks.
Save a preset before Reload or quitting: unsaved instrument changes are not restored automatically.

## Known limitations

- **Native (Rust) output is experimental.** Long UI / IPC or producer scheduling stalls can still cause audio gaps.
  The bounded buffer improves short-stall tolerance but does not eliminate this issue. Use the default **Web Audio** output for this preview.
- SPU synthesis runs in WASM / AudioWorklet in both output modes. Native selects the final device output; it does not replace synthesis with a native SPU engine.
- PSF import extracts supported standard VAB banks; it does not play PSF songs. PSF2 and custom / runtime-packed banks are not supported.
- Windows / Linux hardware testing and broader real-world import workflows remain to be checked. CI success is a build result, not a listening or installation test.
- No automatic update or automatic instrument recovery on restart.

This is a **Preview / pre-release**, with the remaining checks tracked in the repository documentation.

## Validation

All five desktop CI builds passed for tag `v0.1.0` (commit `208d766`). Seven installers were generated.
macOS debug-app smoke checks covered Menu / Pin, preset save / import, output switching,
a 20 MiB / 109-second synthetic WAV, a demo VAB Tone, and VAB extraction from a synthetic PSF.
Import and keyboard state checks do not replace physical listening or testing the downloaded installers.
