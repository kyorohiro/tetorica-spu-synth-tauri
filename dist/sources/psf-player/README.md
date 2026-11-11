# PSF1 song preview source

The separate song machine uses Play!, Framework and CodeGen under BSD-2-Clause. Their notices, pinned revisions, original hashes and local changes are under third_party/play-psf/. No Sony BIOS or game assets are included. The keyboard SPU remains a separate BSD-3-Clause core.

With Emscripten installed, run from this directory:

```sh
node scripts/build_psf_player.mjs --out-dir=/tmp/tetorica-psf-player
cp /tmp/tetorica-psf-player/psf_player.js ../../generated/psf-player/
cp /tmp/tetorica-psf-player/psf_player.wasm ../../generated/psf-player/
```

The editable browser loader and transport are ../../synth-spu/psf_playback_core.js and ../../synth-spu/psf_song_preview.js. Reload the served page after changing JavaScript; rebuild WASM after changing C++.
