# React + Vite プロジェクトの ファイル命名規則ガイド

## Git コミットのルール

- **コミットを実行する前に、必ずユーザーに確認を取ること**
- 確認なしに `git commit` を実行してはならない

## 基本方針

**コンポーネントは PascalCase、それ以外は kebab-case または camelCase** というのが最も一般的で扱いやすい組み合わせです。

```
src/
├── components/
│   ├── UserCard.tsx         ← コンポーネントは PascalCase
│   ├── UserCard.module.css  ← 対応する CSS も同名
│   └── UserCard.test.tsx
├── hooks/
│   └── use-auth.ts          ← フックは use- プレフィックス
├── utils/
│   └── format-date.ts       ← ユーティリティは kebab-case
├── pages/
│   └── home-page.tsx
└── types/
    └── user.ts
```

## ファイル種別ごとの推奨

| 種類                 | 命名規則                    | 例                                 |
| -------------------- | --------------------------- | ---------------------------------- |
| React コンポーネント | PascalCase                  | `UserProfile.tsx`                  |
| カスタムフック       | camelCase(`use` 始まり)     | `useAuth.ts`                       |
| ユーティリティ関数   | camelCase または kebab-case | `formatDate.ts` / `format-date.ts` |
| 型定義               | camelCase + `.types.ts`     | `user.types.ts`                    |
| 定数                 | camelCase + `.constants.ts` | `api.constants.ts`                 |
| テスト               | 対象ファイル + `.test.tsx`  | `UserCard.test.tsx`                |

## なぜ PascalCase を コンポーネントだけに限定するか

macOS/Windows は大文字小文字を区別しないファイルシステム(デフォルト)、Linux は区別します。Vercel や CI が Linux 環境で動くと、ローカルで動くのに本番でビルドが落ちる、という事故が起きがちです。コンポーネント(`.tsx`)以外を kebab-case に統一しておくと、import 文のタイポが大文字小文字のずれで埋もれにくくなります。

## ESLint で強制するなら

`eslint-plugin-check-file` を入れて `vite.config.ts` の隣に以下を追加すると、命名のブレを自動で防げます。

```js
// eslint.config.js
import checkFile from 'eslint-plugin-check-file'

export default [
  {
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/components/**/*.{tsx,ts}': 'PASCAL_CASE',
          '**/hooks/**/*.{ts,tsx}': 'CAMEL_CASE',
          '**/utils/**/*.{ts,tsx}': 'KEBAB_CASE',
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
    },
  },
]
```

## 1 コンポーネント 1 フォルダ

このプロジェクトではコンポーネントごとにフォルダを切るスタイルを採用しています。

```
components/
└── UserCard/
    ├── UserCard.tsx
    ├── UserCard.test.tsx
    └── UserCard.stories.tsx
```

### フォルダ内に `index.ts` は置かない

1ファイルで完結するコンポーネントには `index.ts` を作成しない。`export { UserCard } from './UserCard'` のみのパススルーは冗長なファイルを増やすだけです。

インポート側は直接 `.tsx` ファイルを指定します:

```ts
// ✅ Good — ファイルを直接参照
export { UserCard } from './components/UserCard/UserCard'

// ❌ Bad — パススルー index.ts に依存
export { UserCard } from './components/UserCard'
```

**例外:** コンポーネントが複数のサブファイルに分かれる場合（`UserCardHeader.tsx` + `UserCardBody.tsx` など）は `index.ts` を公開 API の入口として使ってよい。

## Feature-Based Pattern の採用

このプロジェクトでは、機能ベースのフォルダ構造 (Feature-Based Pattern) を採用しています。これにより、関連するコードを機能ごとにまとめて保守性を高めています。

### フォルダ構造

```
src/
  pages/              # ページコンポーネント (トップレベル)
    dashboard-page.tsx
  components/          # 共通コンポーネント
    ui/
      Button.tsx
      Modal.tsx
  features/           # 機能別フォルダ
    product/
      components/
        ProductCard.tsx
        ProductDetail.tsx
      hooks/
        useProduct.tsx
        useProductSearch.tsx
      types/
        product.types.ts
      utils/
        productUtils.ts
      index.ts          # 公開API
    cart/
      components/
        CartItem.tsx
        CartSummary.tsx
      hooks/
        useCart.tsx
      types/
        cart.types.ts
      index.ts
    auth/
      components/
        LoginForm.tsx
        SignupForm.tsx
      hooks/
        useAuth.tsx
      types/
        auth.types.ts
      index.ts
```

### 利点

- 機能ごとのコードがまとまって見つけやすい
- 機能の追加・削除が容易
- コードの依存関係が明確

### 命名規則の適用

各機能内のファイルも上記の命名規則に従ってください。

### index.ts を公開 API として扱うルール

各 feature フォルダの `index.ts` は、その feature の **公開 API** です。以下のルールを守ってください。

- **feature 外からのインポートは必ず `index.ts` 経由にすること**
  ```ts
  // ✅ Good
  import { episodePageApi, useSceneJobs } from '../../features/episode'

  // ❌ Bad — 内部構造に直接依存している
  import { episodePageApi } from '../../features/episode/api/episodePageApi'
  import { useSceneJobs } from '../../features/episode/hooks/useSceneJobs'
  ```

- **feature 内に新しいコンポーネント・フック・型を追加したら、`index.ts` へのエクスポートもセットで行うこと**

- **新しい feature フォルダを作成したら、必ず `index.ts` を用意すること**

この規則により、feature 内部のファイル移動やリネームの影響を `index.ts` の修正だけに留めることができます。

## まとめ

個人開発や中小規模なら最初の表の構成で十分、チーム開発や長期運用なら ESLint 強制 + 1 コンポーネント 1 フォルダ、という選び方で大きく外さないと思います。

## スタイリング方針

- スタイルは **Tailwind CSS** を使用する。インラインスタイル（`style` prop）は原則使わない（グラデーションや `textShadow` など Tailwind で表現が困難な値のみ許容）
- CSS変数（`var(--bg)` など）を参照する場合は Tailwind の任意値構文 `bg-[var(--bg)]` を使う

## 共通コンポーネント

- 引数は `interface` で定義すること。
- 複数画面で再利用できる UI パーツは **`src/components/ui/`** に配置する
- 現在の共通コンポーネント:
  - `ToggleButton` — 選択トグルチップ（ジャンル・性別・時代選択など）
  - `RequiredBadge` / `OptionalBadge` — フォームラベルの必須・任意バッジ
  - `Button` — アクションボタン（`variant="primary"` でグラデーション、デフォルトはアウトライン）
  - `ConfirmDialog` — 削除など破壊的操作の確認モーダル（`confirm()` は使わない）
- 新規画面を実装する際は、まず `src/components/ui/` に既存パーツがないか確認してから使うこと
- 同じ見た目のパーツが2箇所以上に出現したら、迷わず `components/ui/` に切り出す

## API エラーハンドリング

### 仕組み

`src/contexts/ApiErrorContext.tsx` にグローバルなエラー表示の仕組みを実装している。

- **`ApiError` クラス** (`src/lib/apiClient.ts`) — HTTP ステータスコードを持つカスタムエラー。`apiClient` がレスポンス非 OK のとき `throw new ApiError(status, message)` する
- **`ApiErrorProvider`** — `App.tsx` で全ルートをラップ。エラー発生時にモーダルをオーバーレイ表示する
- **モーダル表示内容** — ステータスコードバッジ（例: `404`）＋ BE から返ってきたエラーメッセージ

### 新規ページでの使い方

```tsx
import { useApiError } from '../../contexts/ApiErrorContext'

export default function SomePage() {
  const { showError } = useApiError()

  // useEffect のロード処理
  useEffect(() => {
    someApi.getData().then(setData).catch(showError)
  }, [showError])

  // 送信・保存ハンドラ
  async function handleSubmit() {
    try {
      await someApi.doSomething()
    } catch (e) {
      showError(e)
    } finally {
      setSubmitting(false)
    }
  }
}
```

### ルール

- **全ての API 呼び出しに `showError` を繋ぐこと**。`.then()` には `.catch(showError)`、`await` には `catch (e) { showError(e) }` を必ず追加する
- `useEffect` の依存配列に `showError` を含める（`[storyId, showError]` のように）
- フォームバリデーションエラー（クライアント側チェック）は従来通りローカルの `error` state で表示してよい。API エラーのみ `showError` を使う

## トースト通知

### 仕組み

`src/contexts/ToastContext.tsx` に成功時のトースト表示を実装している。

- **`ToastProvider`** — `App.tsx` で全ルートをラップ済み。画面右下にトーストをスタック表示し、3秒後に自動消去する
- **`useToast`** — `showToast(message)` を返すフック

### 新規ページでの使い方

```tsx
import { useToast } from '../../contexts/ToastContext'

export default function SomePage() {
  const { showToast } = useToast()

  async function handleSubmit() {
    try {
      await someApi.doSomething()
      showToast('保存しました') // ← 成功時に呼ぶ
      navigate('/somewhere')
    } catch (e) {
      showError(e)
    }
  }
}
```

### ルール

- **API の書き込み系処理（作成・更新・削除）が成功したら必ず `showToast` を呼ぶこと**
- `navigate` の直前で呼ぶ（遷移後のページにもトーストが表示される）
- 読み込み専用の処理（`GET`）では呼ばない
- 削除など破壊的操作の確認には `confirm()` を使わず `ConfirmDialog` コンポーネントを使う
