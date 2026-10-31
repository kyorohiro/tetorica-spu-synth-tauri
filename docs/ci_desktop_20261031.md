# 初回Build Desktop — 2026-10-31

ソースcommit `46cc9ead3e7274cef6583bef4be4efccc17ab41b`をmainへpushし、
[Build Desktop](https://github.com/kyorohiro/tetorica-spu-synth-tauri/actions/runs/41167689558)を手動実行。
全5ジョブが成功し、対応するArtifactsがすべて非空・有効期限内であることを確認した。
今回CIを通すためのコード／workflow修正は不要だった。

| 環境 | Artifacts名 | 形式 |
| --- | --- | --- |
| macOS ARM64 | `tetorica-spu-synth-macos-arm64` | DMG |
| macOS Intel | `tetorica-spu-synth-macos-x86_64` | DMG |
| Windows x86_64 | `tetorica-spu-synth-windows-x86_64` | NSIS EXE |
| Linux x86_64 | `tetorica-spu-synth-linux-x86_64` | DEB／AppImage |
| Linux ARM64 | `tetorica-spu-synth-linux-arm64` | DEB／AppImage |

[run／job／成果物ID・サイズ・GitHub提供SHA-256](ci_desktop_20261031.json)。
Artifactsは上記runからダウンロードできる。アプリ版番号は0.1.0。
公開Releaseとタグは作成していない。

これはCIでの自動テスト・ビルドの検証。Windows／Linuxのインストール・音声出力の実機確認や、
macOSのPin・出力往復の未確認項目は`initial_setup_20261031.md`のTODOに残す。
