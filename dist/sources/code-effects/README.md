# Code software effects

This original Tetorica C effect rack is BSD-3-Clause; see LICENSE. It runs in host software after the SPU, separately from the chip's shared reverb. The editable host is js/native_fx_rack.js and the served WASM is js/native_audio_effect.wasm.

With Emscripten installed, run from this directory:

```sh
sh scripts/build_native_audio_effect.sh /tmp/tetorica-spu-code-effects
cp /tmp/tetorica-spu-code-effects/gain.wasm ../../js/native_audio_effect.wasm
```

An explicit output directory keeps this standalone rebuild independent of repository artifact-sync tools.
