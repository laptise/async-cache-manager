# Cached Promise (日本語)

`Promise`結果を簡単に最利用できるようにするライブラリ。

これは、計算処理や非同期通信の結果をキャッシュさせる用途で活用できます。

同じタスクかどうかの判定は`文字列のID`で判定します。

## 複数の同時リクエスト

以下では同じ HTTP リクエストを４回実行する例で説明をしていきます。

```ts
import CachedPromise from "cached-promise";
const store = new CachedPromise(); //①

//②
store.withTask("simple id", () => fetch("very-heavy-api"));
store.withTask("simple id", () => fetch("very-heavy-api"));
store.withTask("another id", () => fetch("very-heavy-api")); //③
store.withTask("simple id", () => fetch("very-heavy-api"));
```

### ① マネージャー（仮称）のインスタンス化

すべての結果は、このマネージャーの中で結果が保持されます。

このインスタンスは何度も生成することができますが、異なるインスタンス間では結果が共有されません。

### ② タスクの実行

`withTask`メソッドを利用し非同期実行を登録します。

第１引数は、タスクの識別`id`です。第２引数には`Promise`ではなく、`Promise`を返すコールバックを入れていることに注意してください。
これは、マネージャーがその処理を実行するかどうかを判断してから、実行できるようにする為です。

### ③ 結果物が共有されるのは同じ id のタスクのみ

③ の処理にはリクエスト対象は同じですが、`another id`という名前で id が設定されています。
同じ`id`でしか結果物が共有されないので、③ のものは、独自に実行されることになります。

### 実行結果

一番目の`simple id`のタスクが終了した時点で、同じ id を持つ残り３つのタスクが同時に解決します。

`anothter id`のタスクは上述の通り、再利用はされず、独自で実行され、独自で解決されます。
