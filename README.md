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

- **Menu → Import**：SPU presetを読み込みます。
- **Menu → Export**：`.spu.json`をネイティブの保存ダイアログで書き出します。
- **Pin**：ウィンドウの最前面表示を切り替えます。設定はアプリ起動中だけ保持します。
- **Menu → Reload**：確認後に画面を再読み込みします。音色を残すには先にpresetを保存してください。
- **Menu → Audio output**：Web Audio／Native (Rust)を選択します。

タイトル横の丸いMenu／PinはFM2612 Synthと同じ配置・アイコン・操作です。
SPUの明るい配色に合わせています。

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
SPU版の送信枠は8パケットで、48kHzでは約43ms分を蓄えて再生を開始します（上限約85ms）。
待ちが発生した場合は、順序を保ったまま最大8パケットを一括送信して追いつきます。
新しい音声を待ってまとめる処理はなく、再生バッファ容量も増やしません。
WebViewの長い停止による欠音を完全に防ぐ構成ではありません。
macOS14以降では背景でのWebView停止を抑制する設定も有効にしていますが、音声継続への効果は未検証です。
Nativeでも音源生成はWebView内で行います。[転送改善と計測上の制約](docs/native_audio_batch_20261031.md)。

## ブラウザ版を更新する

```sh
npm run import:release -- /path/to/tetorica_spu_synth_VERSION_itch.zip
npm test
npm run dev
```

root `index.html`と`synth-spu/synth.js`を含むStandalone SPU SynthのZIPを指定します。
取り込み直後の`dist/`はZIPの原本です。`release.lock.json`はその全ファイルのSHA-256を保持します。
両方を同じコミットへ含めてください。元ZIPのGit登録は不要です。
不正なZIPは取り込み前に拒否し、以前のdistとlockを保持します。
Tauri用の保存・出力接続はローカル画面への追加scriptとして組み込みます。

## ソースを編集・再利用する

`dist/synth-spu/synth.js`がアプリの入口です。同じフォルダーの`spu_synth_panel.js`などのモジュールと、`dist/js/`の共有APIを直接編集できます。
source-copy版では元のモジュールをそのまま実行し、編集後のbundle／minifyは不要です。以前のZIPがbundle済みの場合は、先にsource-copy版を取り込んでください。
`dist/generated/*_wasm.js`はWASM用の生成loaderなので、コンパイラーが出力した短縮コードです。
音源の元ソースとライセンスは同梱のsources／ライセンス案内を参照してください。

```sh
# dist/synth-spu/synth.js や関連モジュール、CSSを編集する
npm run record:edits
npm run dev
# 追加編集後は、dev/buildの前にもう一度記録する
npm run record:edits
npm run build
```

`record:edits`は変更・追加ファイルのSHA-256と任意ファイルの削除を、
取り込みZIPのSHA-256に紐づく **local-changes.json** へ記録します。
`index.html`と`synth-spu/synth.js`は残してください。
`release.lock.json`と元ソースのreceiptは変更しません。原本の記録と改造の記録を分けています。

起動・ビルド時は原本と記録済み変更を合成して照合します。後から加えた未記録の変更、
別ZIP用のmanifest、不正な相対パス、symlinkは拒否します。すべて原本へ戻して記録するとmanifestを削除します。
改造版を共有するときは、編集した`dist/`と`local-changes.json`を一緒に保存してください。
新しいZIPの取り込みに成功すると`dist/`を置き換えてmanifestを消すので、先に改造をcommitまたはコピーしてください。
不正なZIPでは現在のファイルとmanifestを保持します。`desktop/`の接続コードも通常どおり編集できます。

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

UI／IPCの25ms遅延を再現するオフライン試験と、30秒の実デバイス無音試験もあります。
後者はCPAL側の確認であり、WebView IPCや音質の実聴は別途必要です。

```sh
node scripts/check-audio-transport.cjs /tmp/spu-audio-transport.json
cargo test --locked --manifest-path src-tauri/Cargo.toml native_device_continuous -- --ignored --nocapture
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
