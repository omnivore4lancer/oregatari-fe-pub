# oregatari-fe

マンガ制作支援アプリ「俺語り」のフロントエンド。React + Vite + TypeScript で構築。

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| UI フレームワーク | React 19 + TypeScript |
| ビルド | Vite |
| スタイリング | Tailwind CSS |
| ルーティング | React Router v7 |
| 認証 | Supabase Auth |
| テスト | Vitest + Testing Library |
| コンポーネントカタログ | Storybook |

## 開発コマンド

```sh
# 開発サーバー起動
npm run dev

# 型チェック
npx tsc --noEmit

# テスト（ウォッチモード）
npm test

# テスト（一回実行）
npm run test:run

# Storybook 起動
npm run storybook

# ビルド
npm run build
```

## フォルダ構成

```
src/
├── pages/               # ページコンポーネント（ルートと 1:1）
│   ├── auth/            # ログイン
│   ├── character/       # キャラクター一覧・作成・編集
│   ├── dashboard/       # ダッシュボード
│   ├── episode/         # エピソード一覧・作成・編集・シーン管理
│   ├── jobs/            # ジョブ一覧
│   ├── materials/       # 素材管理
│   ├── publish/         # 公開設定
│   └── story/           # ストーリー編集・キャスト・本文
├── features/            # 機能別モジュール（公開 API は index.ts 経由）
│   ├── character/       # キャラクター関連コンポーネント・フック・API
│   ├── episode/         # エピソード・シーン関連
│   ├── jobs/            # ジョブポーリング
│   ├── materials/       # 素材
│   ├── publish/         # 公開設定・カバー画像
│   └── story/           # ストーリー・関係性グラフ
├── components/
│   └── ui/              # 全機能共通 UI パーツ（Button, ConfirmDialog など）
├── contexts/            # React Context（ApiError, Toast, Auth）
└── lib/                 # apiClient など低レベルユーティリティ
```

## 参考ページ

- [公開作品サンプル](https://oregatari-fe.vercel.app/works/1)

## 主要ページ

| ページ | パス |
|--------|------|
| ダッシュボード | `/dashboard` |
| ストーリー編集 | `/stories/:id/edit` |
| キャラクター一覧 | `/stories/:id/characters` |
| エピソード一覧 | `/stories/:id/episodes` |
| シーン管理 | `/stories/:id/episodes/:episodeId/scenes` |
| 公開設定 | `/stories/:id/publish` |

## 設計規則

- **1 コンポーネント 1 フォルダ**（`UserCard/UserCard.tsx`）、単一ファイルには `index.ts` を作らない
- **feature 外からのインポートは `index.ts` 経由のみ**
- **API エラーは `useApiError().showError`**、書き込み成功は `useToast().showToast`
- **スタイルは Tailwind CSS**（`style` prop は原則不使用）

詳細は [CLAUDE.md](./CLAUDE.md) を参照。
