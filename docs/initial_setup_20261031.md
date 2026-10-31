# 初期構成 — 2026-10-31

FM2612 SynthのTauriシェルを再利用し、SPU Synthを自己完結した配布物として取り込んだ。
初期版0.1.0、アプリ識別子`net.tetorica.spu-synth`。
新repositoryのfirst commit・push・タグ・公開は行っていない。

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
- [ ] Windows／LinuxのActionsと実機動作を確認する。
- [ ] README、dist、release.lock.jsonを含めてfirst commitを作り、push後にBuild Desktopを手動実行する。

デバッグappは`src-tauri/target/debug/bundle/macos/Tetorica SPU Synth.app`。
通常の起動は`npm run dev`、配布用ビルドは`npm run build`。
