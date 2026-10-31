# Tetorica SPU Synth — Tauri

PlayStation 1 SPUシンセサイザーのデスクトップ版です。
SPUの24 voice、PCM／ADPCM、ADSR、Reverb、PMON、Noise、Software morph、
音声ファイルとPSF／VABの読み込みは、同梱したブラウザ版SPU Synthを使います。

## 起動

Node.js 22以上、Python 3、Rust、Tauri 2のビルド環境が必要です。

```sh
npm ci
npm run dev
```

`dist/`に自己完結した配布物を同梱しています。起動時のダウンロードはありません。
Enable audioを押し、PCキーまたは画面の鍵盤で演奏します。

- **Save preset**：`.spu.json`をネイティブの保存ダイアログで書き出します。
- **Pin**：ウィンドウの最前面表示を切り替えます。設定はアプリ起動中だけ保持します。
- **Reload**：確認後に画面を再読み込みします。音色を残すには先にpresetを保存してください。
- **Audio output**：Web Audio／Native (Rust)を選択します。

音声／VAB／PSFはWebView標準のファイル選択から読み込みます。フォルダー選択の可否は
OSのWebViewに依存します。PSFは必要なPSFLibも一緒に選択できます。
現在の音色はメモリ上にあり、アプリ終了・再読み込みで失われます。自動保存は未実装です。

## 音声出力

音源・ADSR・Reverb・Morph・表示は、どちらの出力でも同じWASM／AudioWorkletで処理します。
Native (Rust)は最終PCMをバイナリTauri IPCでRustへ渡し、CPALから音声機器へ出力します。
SPUのC++音源そのものをNativeで動かす方式ではありません。
Node sidecar・Audify・ローカル通信サーバーは使いません。

Native選択時は既定デバイスで開始します。別の機器はデバイス選択後にApply deviceで適用します。
切り替え時は発音・リバーブ残響を止め、現在のサンプルと音色設定を保持します。
エラー時は演奏を止めてWeb Audio出力へ戻し、理由を表示します。
SPUエンジン自体が終了した場合はEnable audioで再開します（新しいSineから開始）。
出力デバイスとのサンプルレート変換・時計補正・送信量制限はFM2612 SynthのTauri版と共通です。
WebViewの長い停止による欠音を完全に防ぐ構成ではありません。

## ブラウザ版を更新する

```sh
npm run import:release -- /path/to/tetorica_spu_synth_VERSION_itch.zip
npm test
npm run dev
```

root `index.html`と`synth-spu/synth.js`を含むStandalone SPU SynthのZIPを指定します。
`dist/`はZIPの内容を変更せず保持し、`release.lock.json`で全ファイルのSHA-256を照合します。
両方を同じコミットへ含めてください。元ZIPのGit登録は不要です。
不正なZIPは取り込み前に拒否し、以前のdistとlockを保持します。
Tauri用の保存・出力接続はローカル画面への追加scriptとして組み込みます。

## 検証・ビルド

```sh
npm test
python3 scripts/import_release.py --check
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run build
```

アプリ名はTetorica SPU Synth、識別子は`net.tetorica.spu-synth`です。
macOSのappは`src-tauri/target/release/bundle/macos/`に生成されます。
標準テストは音声機器を開きません。実機で低音量の出力を確認する場合だけ、次を明示的に実行します。

```sh
cargo test --locked --manifest-path src-tauri/Cargo.toml native_device_smoke -- --ignored --nocapture
```

ActionsのBuild DesktopはmacOS ARM64／x86_64、Windows x86_64、Linux x86_64／ARM64を対象にします。
手動実行はArtifactsへ、`v*`タグではDraft Releaseへ添付します。初期版は0.1.0です。
署名・公証・自動更新は未対応です。各OSのCI・実機確認はローカルmacOSの検証と区別してください。

## 構成とライセンス

- `dist/`：音源WASM、対応ソース、第三者ライセンスを含むSPU Synth配布物
- `desktop/`：ネイティブ保存、Pin、音声出力の接続
- `src-tauri/src/audio.rs`：Rust／CPALのデバイス出力・IPC・バッファ管理
- `scripts/import_release.py`：ZIPの取り込み・照合

デスクトップの土台は`tetorica-fm2612-synth-tauri`から再利用しています。
シェルはBSD-3-Clause（LICENSE）、SPU音源等は`dist/LICENSE`と`dist/licenses/`を参照してください。
