# macOS desktop GUI review — 2026-10-31

対象: ローカルdebug app、コード`46cc9ea`、frontendはrelease.lockの固定配布物。
CUAで実際のmacOSウィンドウを操作。ソースコード変更や再ビルドは行っていない。

## 確認した動作

- Pinを押し、`Unpin window / on`を確認。再度押し、`Pin window on top / off`を確認。
  これはnativeコマンドの返却値を含むUI状態の確認であり、他ウィンドウとの重なりの目視試験とは別。
- Enable audio後、Web Audio → Native → Web Audioを往復。
  Nativeは`System default (48,000 Hz)`で開始。
- NativeとWeb Audioの双方でPC鍵盤`6`を送信。C4の発音状態と離鍵後の`0 held`を確認。
- 両出力でSustainのC4を保持し、出力RMS表示の約`-30.1 dBFS`を目視確認。
  モニターは出力デバイス前の信号なので、スピーカーの音質・音切れは判定していない。
- Reloadの確認ダイアログを承認。`Enable audio`の初期画面へ戻り、音源を再初期化できた。
- Triangleへ変更して名前を変更後、Load presetのmacOSファイル選択から
  `/private/tmp/spu-tauri-gui-check-20261031.spu.json`（以前Save presetで保存した7,292 bytes）を選択。
  `Loaded Sine.`、名前Sine、Morph wave A=Sine、Morph enabledを確認。
- Reload／読み戻し後もNative出力の再開とWeb Audioへの復帰が成功。
- 最後はWeb Audio、Pin off、Sustain off、`0 held`、停止状態。

## 制限と残りの確認

複数操作をまとめた20秒のCUA呼び出しは2回timeoutした。再取得で操作完了を確認でき、
アプリ再起動や強制終了は不要だった。timeoutだけでアプリのハングとは判断していない。

Nativeの診断表示は初回`underruns: 0 / capture drops: 128 frames`、再接続後は
`underruns: 4 / capture drops: 2936 frames`まで増加した。
GUI自動操作との因果関係、通常負荷での再現性、実際の音切れは未確認。
連続出力の実聴・負荷試験をTODOへ追加した。音質が正常と結論していない。

VAB／PSF・長い音声の読み込み、上下Pitch／Morphのnative実アプリ操作、
Windows／Linux実機確認は引き続き未完了。既存のブラウザ回帰試験・CIとは区別する。
