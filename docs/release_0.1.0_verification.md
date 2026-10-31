# v0.1.0 Preview 配布検証 — 2026-10-31

対象コミット: `208d76670d2422321ac631525a74e7633e7a23f0`、タグ`v0.1.0`。
package.json、npm lockfile、Tauri、Cargoのversionを0.1.0へ統一した。
以前のnpm lockfileに残っていた0.80.7はroot metadataのみ修正し、依存関係を変えていない。

[Build Desktop](https://github.com/kyorohiro/tetorica-spu-synth-tauri/actions/runs/41172028117)は
macOS ARM64／Intel、Windows x64、Linux x86_64／ARM64の全5環境で成功。
各jobのnpm ci、Python／Node tests、Rust tests、固定frontend照合、installer作成が成功。
物理audio deviceを開くignored testsはCI成功に含めない。

7個のinstallerをDraft Releaseへ添付。name、size、GitHubが返すSHA-256とjob情報は
[JSON記録](release_0.1.0_verification.json)に残す。
この記録はGitHub上のuploaded状態・digestの確認であり、各installerのdownload／install／実聴ではない。

## macOS debug appでの追加smoke check

- 20,971,564 bytesの合成stereo WAVをOSのfile dialogから読み込み。
  48kHz／PCM16、5,242,880 frames、109.2267秒、約-40dBFSの100Hz。
  SHA-256 `63984d9d570009b65d8fbbf73c442232ee009a6cc792e4cae463897792074f4b`。
  `Loaded spu-release-20mb.wav · Software audio · root C4`、109.2秒を確認。
- 元デモ`docs/playground/samples/spu-import/spu-synth-demo.vab`のcopyを読み込み。
  2 programs／3 tones／2 samples、P3 T0、64 ADPCM bytesのToneロードを確認。
- 元デモ`standalone.psf`のcopyを読み込み。PSF entry表示後、2 VAB banksを抽出。
  `VAB @0x80010000 P3 T0`をロードできた。
- 各ロード後、PC鍵盤6でC4の発音状態と離鍵後の0 heldを確認。
  大きいWAVの全109秒再生、loopback PCM測定、実聴は行っていない。
- native file dialogのGo To操作でCUA timeoutが1回あったが、再取得でWAVロード成功を確認。
  appの再起動や強制終了は不要だった。

debug appのdesktop UI／音声処理はタグ対象と同じ。タグ直前の変更はnpm lockfileとrelease notes。
配布されたDMG内のappを起動した確認とは区別する。

## 未完了

- Native出力: 長いUI／IPC・producer停止時の欠落。Previewでは標準Web Audioを推奨。
- macOS installerからの起動、Windows／Linux実機、実聴。
- Tauriでの上下Pitch／Morph、実ゲームbankやMiniPSF＋PSFLib一式の追加操作確認。

DraftにはPreview表示と既知問題を記載。公開は行っていない。
