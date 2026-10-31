# Native出力の遅延耐性と残る欠落 — 2026-10-31

## 変更

送信creditを4から8へ増やした。48kHzでは半分の2,048 frames（約43ms）を
蓄えて再生し、送信中を含めた上限は4,096 frames（約85ms）。
従来より開始待ち時間が約21ms増える。無制限な古い音の蓄積はしない。
発音・音源WASM・dist・release.lock・音色ファイルは変更していない。

初回credit前のグラフ稼働をcapture dropと数えないよう修正。
最初のcredit以降の欠落は従来どおり数える。出力statusのtooltipに、
セッション内の最長write間隔、write IPC往復時間、poll間隔を追加した。
切り替えで診断値はリセットされる。

## オフライン試験

[再現結果とソースSHA](audio_transport_stress_20261031.json)。
実際のcapture AudioWorkletを使い、native queueとIPC schedulingはモデル化。
2秒ごとにUI配送を25ms停止、IPC配送1ms、poll間隔4ms、device callbackは512 frames。
これはCPALや実WebViewの測定ではない。

30秒の比較:

| 入力Hz / burst frames | 旧4credit: underruns / dropped frames | 新8credit |
| --- | --- | --- |
| 44,100 / 128 | 9 / 8,397 | 0 / 0 |
| 44,100 / 512 | 14 / 9,073 | 0 / 0 |
| 53,267 / 128 | 8 / 8,410 | 0 / 0 |
| 53,267 / 512 | 13 / 9,952 | 0 / 0 |

device clock ±0.1%の各60秒試験でも新8creditは欠落0。
200msの長いUI停止では欠落し、上限内で復帰することもtestに含めた。

## 実デバイス試験: 未達の条件がある

新しいignored test `native_device_continuous`は既定deviceへ30秒の無音を送り、
1秒ごとにproducerを25ms停止する厳格な診断試験。通常のCIではdeviceを開かない。

- sandbox内: device列挙が空で開始不可。sandbox外で再試験した。
- 1回目（並行buildあり）: 1,439,744 frames消費、underruns **1**。ゼロを要求するtestは失敗。
- 2回目（並行buildなし）: 30.0065秒、29回の遅延注入、1,435,648 frames消費、underruns **2**。
  最長write間隔は **93.64125ms**。約1.556秒と1.645秒でunderrun増加を観測。
  約85msの全送信枠を超える停止があり、ゼロを要求するtestは失敗した。

この結果を成功へ読み替えていない。25msの固定遅延だけでなく、実際のthread schedulingにも
大きな遅れがある。音切れのない連続動作や実聴は完了していない。

## 実アプリと標準検証

8creditのmacOS debug appをbuildし、Native開始、PC鍵盤、Pin往復、Web Audioへの復帰を確認。
診断追加前のGUI試験でも欠落は残り、最終観測はunderruns 7 / dropped frames 11,144。
操作を止めた一部の観測期間はunderrun回数が同じだったが、無欠落を保証する試験ではない。
最終の診断追加版では、underruns 3 / dropped frames 5,030、最長write間隔76.0ms、
write IPC往復76.0ms、poll間隔80.0msを観測した。全て同一sessionの累積最大値で、
どのUI操作と同時だったかまでは記録していない。最後はWeb Audio／0 heldへ戻した。

Python 6件、Node 40件成功。Rust標準testは21件成功、device test2件はignored。
macOS debug app build成功。最終PCMを物理loopback録音して評価した試験ではない。

## 次に切り分けること

- [x] tooltipでwrite IPC往復76ms、poll間隔80msまで遅れる実例を確認。
- [ ] UI負荷とIPC／producer schedulingの停止時刻を対応づけて調べる。
- [ ] Nativeの実聴と物理loopbackによる連続性確認。負荷条件と停止時間を一緒に記録する。
- [ ] 長い停止への対策は、演奏latencyとの交換条件を明示して検討する。大きいbufferで無条件に隠さない。
- [ ] 必要ならUI thread経由のPCM転送を避ける構成を調査する。SPU音源自体のnative化とは別課題。

再現コマンドはREADMEの検証節を参照。
