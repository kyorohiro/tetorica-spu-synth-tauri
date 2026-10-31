# FM2612 Synthに合わせたMenu / Pin — 2026-10-31

SPU Tauri側のdesktop extensionでUIを変更した。
FM2612側、親ブラウザ版、固定配布物distとrelease.lockは変更していない。

- タイトル横に36pxの丸いMenu、Pinを並べる。FM2612と同じSVGと19pxのglyph。
- SPUの明るい背景と青いaccentに合わせ、Pin Onではpin-headを塗る。
- FM2612と同じImport／Export区切りでSPU presetの読み書きをまとめる。
  既存ボタンとfile inputそのものを移動し、元のイベント処理を使う。
- Audio outputとReloadもMenuへ移動。音色名とReset instrumentは元の欄に残す。
- pointer操作で演奏focusを奪わず、外側clickとEscapeで閉じる。
  Import／Export／Reloadは選択時にMenuを閉じる。
- タイトルとのグループは折り返しを許容し、panel幅と高さをviewport内に制限する。

検証: Python6件・Node40件成功。macOS debug app build成功。
実アプリのAXとscreenshotで配置・SVG・panel表示を確認。
PinのOn／Off、Escapeで閉じる、Importのnative file dialogとcancel、
Menu内Audio output展開、展開中のPC鍵盤C4発音と0 heldへの離鍵、
Reload確認dialogとcancelを確認した。
最後はMenu closed、Pin off、Web Audio、0 held。

音声転送や先行調査で残った長いIPC停止の問題は、このUI変更の対象外。
