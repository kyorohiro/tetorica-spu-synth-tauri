# 初期構成 — 2026-10-31

FM2612 SynthのTauriシェルを再利用し、SPU Synthを自己完結した配布物として取り込んだ。
初期版0.1.0、アプリ識別子`net.tetorica.spu-synth`。
初期構成作成後、ユーザーのfirst commitをmainへpushし、全5環境のBuild Desktop成功まで確認した。
詳細は末尾と[CI記録](ci_desktop_20261031.md)を参照。タグ作成・Release公開は行っていない。

保存ダイアログ、Pin、Reload、最終PCMのRust／CPAL出力、デバイス選択、
rate変換、送信クレジット、失敗時復帰を持つ。音源自体は既存WASM／AudioWorklet。
Native音源化・音色の自動保存・演奏録音の追加は行っていない。
SPUの対応ソースとlicenseはdistの配布物へ含まれる。

## 検証

[検証の要約とfrontend hash](initial_setup_20261031.json)。

- Python6／Node35／Rust21件成功。音声機器を開くRust test1件はignored。
- npm ci、SPUアイコン生成、npm run build -- --debug --bundles app成功。
- macOS実アプリで起動、SPU WASM初期化、Native既定デバイス48kHz出力の開始を確認。
- Save presetでmacOS保存ダイアログを開き、一時領域へ7,292 bytesの有効なSPU presetを保存した。
  Native出力は無音状態で開始し、GUI検証で音を鳴らしてはいない。
- Pin／Web Audioへ戻すGUI確認は自動操作のtimeoutで完了扱いにしていない。
  アプリ本体のsampleではmain loopがイベント待ちで、デッドロックを特定できなかった。
  対応するオフライン切替・エラー復帰・Pin確認のunit testsは成功している。
- 親ブラウザ版のdesktop bridge追加後のNode70件成功。
- 最終distの[Chromium／WebKit限定回帰](browser_review_20261031.json)も成功。
  初期Sine、鍵盤横Pitch／Morphの実PCM変化、上下同期、離鍵、Reset、
  RAM不足時のPMON拒否後の離鍵を確認。デスクトップIPCの実機検証とは区別する。

## 次の確認

- [ ] 実アプリでWeb Audio → Native → Web Audioを往復して、演奏とmonitorを確認する。
- [ ] PinのOn／OffとReload、保存したpresetの読み戻しを実アプリで確認する。
- [ ] VAB／PSFと長い音声の読み込み、PC鍵盤と上下Pitch／Morphを実アプリで確認する。
- [x] 5環境のBuild Desktop成功を確認。macOS ARM64／Intel、Windows x86_64、Linux x86_64／ARM64。
- [ ] Windows／Linuxの実機動作を確認する（CIの成功とは別）。
- [x] first commitを作る。後続確認でローカル`46cc9ea`（`v0.0.0`）を確認。
- [x] `46cc9ea`をmainへpushし、[Build Desktop](https://github.com/kyorohiro/tetorica-spu-synth-tauri/actions/runs/41167689558)を手動実行。全ジョブ成功、5個のArtifactsを確認。

[CI対象コミット・各ジョブ・成果物のサイズとSHA-256](ci_desktop_20261031.json)。
この結果はビルド・自動テスト・成果物アップロードの成功であり、各OSでのインストール・実聴を完了した記録ではない。
タグ作成・Release公開は行っていない。最初のHTTPS pushはHTTP 400で失敗したため、
コマンド限定の`http.version=HTTP/1.1`／`http.postBuffer=52428800`で再試行して成功。
Gitの永続設定は変更していない。

デバッグappは`src-tauri/target/debug/bundle/macos/Tetorica SPU Synth.app`。
通常の起動は`npm run dev`、配布用ビルドは`npm run build`。
