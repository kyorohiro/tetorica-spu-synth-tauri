# SPU desktop：メニューを1つに統合（2026-11-12）

- [x] 最新Web版にあるImport／Exportメニューを丸ごとタイトル左上へ移し、DesktopのAudio output／Reloadを同じメニューへ追加する。
- [x] 同じIDのメニューを2個生成しない。既存DOM・input・イベントとPinを保ち、Code拡大中も操作可能にする。
- [x] 旧Web版でメニューがない場合のfallbackを保つ。現行distとrelease.lock.jsonは変更しない。
- [x] 既存Desktopテスト、配布物照合、Rustビルド確認と、無音headless Chromium／WebKitでメニュー・Import／Export・Pin・閉じる操作・Code拡大を検証する。
- [x] READMEと検証記録を更新する。commit／push／署名・公開はしない。

通常browser／native app／OS音量は操作しない。headlessはアプリ起動前からdestinationをgain 0へ遮断し、Chromiumはmuteを併用する。native IPCは検証用stubを使い実音を出さない。

完了：Python 14件＋Node 42件、Cargo check、Tauri debug build（bundle作成なし）成功。headless Chromium／WebKit各5領域で1メニュー・既存DOMと全Import／Export項目の保持・Pin・VAB／PSF・Code拡大／640px・旧UI fallbackを確認。実AudioContext／native音声は起動していない。dist／release.lock.jsonは元の341ファイルを保持。

検証記録：[unified_menu_20261112.json](./unified_menu_20261112.json)。任意のheadless再確認はPlaywright導入済み環境で `node scripts/check-desktop-menu.cjs`。変更したDesktop scriptはRustへの埋め込みなので、反映にはTauriアプリの再ビルド・再起動が必要。
