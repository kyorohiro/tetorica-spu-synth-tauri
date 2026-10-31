# Native PCM転送のまとめ送り — 2026-10-31

## 実装と確認範囲

未送信のPCMが溜まった場合、順序を保ったまま最大8パケットを1回のIPCで送る。
最初のパケットは即送信し、まとめるための待ち時間は追加しない。
送信枠・再生開始条件は従来のまま（48kHzで約43ms、上限約85ms）。
Rust側ではバッチ全体の長さ・有限値・creditを検査してからqueueへ追加する。
切替後の古いsessionの未送信データは破棄する。

診断tooltipにRust応答時間とservice処理時間を追加した。
表示値はsession内の個別の最大値であり、同一packetの内訳として差し引くことはできない。

[オフライン再現結果とソースSHA](audio_transport_batch_20261031.json)では、
各IPC応答を13ms遅らせた場合、逐次1packet送信に生じる欠落をまとめ送りで回避できた。
これはcapture Workletを使ったモデル試験で、実WebViewやCPALの測定ではない。

Python6件、Node42件、Rust24件成功（device test2件ignored）。macOS Release app build成功。
実デバイスへ30秒間無音を送るRelease testも成功した（WebView IPCは通らない）。
25msのproducer停止を29回注入し、underruns 0、最長write間隔58.891666ms、
消費1,440,256 frames、受信1,443,840 frames、終了queue 3,584 frames、経過30.006499333秒。
過去のDebug試験とはbuild条件・送信方法が異なるので、改善全部をまとめ送りの効果とは断定しない。

## GUI計測の制約と残る確認

v0.1.0のmacOS ARM64 DMGはSHA照合・hdiutil verify・実起動を確認。
そこからのNative出力では最終観測underruns 3 / dropped frames 4,501だった。
ローカルReleaseのまとめ送り版はPin操作と短い鍵盤操作の直後には0 / 0だったが、
後の観測で4 / 6,767、最大write間隔98msとなった。これらは同一条件・時間を揃えた比較ではない。

ユーザーから、非Pin状態や背景への移動ではWebKit側の音声生成が遅くなるとの指摘があった。
AIの許可画面や操作によってアプリが背景へ移るため、今回のGUI値にはその影響が含まれ得る。
**背景移行の影響と実装上の欠落を、この計測だけで分離できていない。**
長時間の連続動作試験としては合格・不合格を判定せず、参考記録として扱う。

Native選択でも音源生成はWebKit内のWASM／AudioWorkletで、最終出力だけがRust／CPAL。
Pinは最前面表示の操作であり、音声生成の継続を保証する仕組みではない。

追加でTauriの`backgroundThrottling: disabled`を設定した。
[公式仕様](https://v2.tauri.app/reference/config/#backgroundthrottling)ではmacOS14以降が対象で、
Windows／Linuxは非対応。この設定を含むbuildは成功したが、背景での音声継続への効果は未検証。
上記GUI計測はこの設定を追加する前のものであり、設定の効果を示すものではない。

## 再開TODO

- [ ] Pin On・前景維持で、実聴を伴う長時間確認をする。途中の背景移行や許可操作は別の条件として記録する。
- [ ] Pin Onのまま別アプリを前景にする場合と、非Pin／最小化を別々に確認し、背景停止抑制の効果を調べる。
- [ ] 必要なら物理loopbackで音声生成の遅れと出力欠落を区別する。
- [ ] 背景でも確実な継続が必要なら、WebView経由の転送を減らす構成や音源処理のNative化を別途検討する。

v0.1.0 PreviewのDraft・タグ・配布バイナリは今回の変更に差し替えていない。
