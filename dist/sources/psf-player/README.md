# PSF1 song preview source

The song machine uses Play!, Framework and CodeGen for PSF1 CPU/HLE under BSD-2-Clause. Their notices, pinned revisions, original hashes and local changes are under third_party/play-psf/. Its active SPU bus and audio use the same fixed MAME-derived DSP sources as the keyboard Synth, under BSD-3-Clause, at third_party/tetorica-soundchip-native/vendor/mame-ps1-spu/. The pinned DSP files on disk are unchanged. For selected-channel Dry listening, scripts/build_psf_player.mjs checks the pinned spu.cpp SHA-256 and unique insertion anchors, then compiles a temporary copy with one passive voice-output callback. No DSP expression is replaced. ABI 4 returns the original full stereo mix plus all 24 dry stereo stems from the same rendering pass; the selected output excludes shared reverb, while every voice and the original reverb continue processing. Main volume and SPUCNT mute also apply to the dry stems. No Sony BIOS or game assets are included. Song rendering uses hardware mixing without the keyboard software headroom or click guard. HLE CPU timing is not cycle-exact; unsupported volume sweeps, 8-byte-only voice addresses and transfer modes fail explicitly.

With Emscripten installed, run from this directory:

```sh
node scripts/build_psf_player.mjs --out-dir=/tmp/tetorica-psf-player
cp /tmp/tetorica-psf-player/psf_player.js ../../generated/psf-player/
cp /tmp/tetorica-psf-player/psf_player.wasm ../../generated/psf-player/
```

The editable browser loader, bounded read-only channel snapshot decoder and audible-position transport are ../../synth-spu/psf_playback_core.js, ../../synth-spu/psf_live_snapshot.js and ../../synth-spu/psf_song_preview.js. Live observation does not advance the CPU or write SPU RAM; the private ABI includes gate / active status observers. The JS wrapper copySpuRam() reads a detached 512 KiB image at the same native boundary. The transport retains only bounded lookahead RAM images for instant paused Capture. The pure conversion helper is ../../synth-spu/psf_capture.js; no PCM encoding or sample-byte rewriting is involved. Reload the served page after changing JavaScript; rebuild WASM after changing C++.
