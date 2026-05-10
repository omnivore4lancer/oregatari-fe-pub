import { chromium } from 'playwright'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SS_DIR = join(__dirname, 'screenshots')
const OUT_PDF = join(__dirname, 'oregatari-features.pdf')

function img(filename) {
  const buf = readFileSync(join(SS_DIR, filename))
  return `data:image/png;base64,${buf.toString('base64')}`
}

const pages = [
  {
    id: '00_login.png',
    title: 'ログイン画面',
    description: 'メールアドレスとパスワードで認証する画面。Supabase Auth を利用した認証基盤。',
    features: [
      'メールアドレス / パスワードによるログイン',
      'ログイン状態はセッションで維持。未認証ユーザーはこの画面にリダイレクト',
    ],
  },
  {
    id: '01_dashboard.png',
    title: 'ダッシュボード',
    description: '作成した漫画作品の一覧を表示するホーム画面。',
    features: [
      '所有する作品をカード形式で一覧表示',
      '作品カードには表紙画像・タイトル・ジャンル・更新日時を表示',
      '「新しい作品を登録」ボタンから作品作成フローへ遷移',
      '作品の削除（確認ダイアログ付き）',
    ],
  },
  {
    id: '02_story_create_step1.png',
    title: '作品作成 — ステップ1: 基本情報',
    description: '4ステップの作品作成ウィザードの第1ステップ。タイトルとジャンルを設定する。',
    features: [
      '物語タイトルの入力（必須）',
      'ストーリータイプ（ジャンル）の選択（最大3つ）',
      'トグルチップ UI でジャンルを直感的に選択',
      '進捗をステップインジケーターで視覚化',
    ],
  },
  {
    id: '03_story_create_step2.png',
    title: '作品作成 — ステップ2: 世界観',
    description: '作品作成ウィザードの第2ステップ。物語の舞台設定を入力する。',
    features: [
      '世界観設定のテキスト入力（必須）— AI がストーリー・キャラクターを生成する際の基盤',
      '時代設定の選択（現代 / 古代中世 / 未来SF）',
      '追加要素の自由記述（任意・最大300文字）',
    ],
  },
  {
    id: '04_story_story.png',
    title: '基本設定 — ストーリー',
    description: '作品の時代背景と歴史ストーリーを管理する画面。AIによるストーリー生成が可能。',
    features: [
      '時代背景（左カラム）のテキスト編集',
      '歴史ストーリーを「導入 / 展開 / クライマックス / 結末」の4章で管理',
      '「AI 生成」ボタンでストーリーを自動生成（ストリーミング表示）',
      'インライン編集（編集ボタン → 完了 / キャンセル）',
      '編集中の内容をリアルタイムプレビュー',
    ],
  },
  {
    id: '05_story_cast.png',
    title: '基本設定 — 相関図',
    description: 'キャラクター間の相関関係をビジュアルに管理する画面。',
    features: [
      '登場人物リスト（左カラム）: 名前・役割・配役アーキタイプを表示',
      '相関図（右エリア）: ノード+エッジのグラフで人物関係を視覚化',
      'グラフ上でキャラクターを選択してハイライト',
      'キャラクターのクリックで詳細モーダルを表示',
      'アーキタイプロールのクリックで役割説明モーダルを表示',
      'キャラクター名・役割のインライン編集',
      '新しい登場人物を「+ 追加する」から直接追加',
    ],
  },
  {
    id: '06_character_list.png',
    title: 'キャラクター一覧',
    description: '主人公・サブキャラクターの一覧と詳細を管理するマスター画面。',
    features: [
      '主人公・サブキャラクターをカード形式で分けて一覧表示',
      'キャラクター選択でリストと詳細パネルが連動',
      '詳細パネルに「三面図」「基本情報」の2タブ',
      '三面図タブ: AI で生成したキャラクターデザイン画像を前面・側面・後面で表示',
      '基本情報タブ: 名前・役割・配役・年齢・性別・スキル等をインライン編集',
      'キャラクターの削除（確認ダイアログ付き）',
      '「新しいキャラクター」ボタンで作成フローへ遷移',
    ],
  },
  {
    id: '07_character_create.png',
    title: 'キャラクター作成 / プロフィール編集',
    description: 'キャラクターの詳細情報を入力・編集するフォーム画面。新規作成と既存編集で共通利用。',
    features: [
      '基本情報: 名前（必須）・役割・配役（アーキタイプ）・年齢・性別',
      '詳細設定: 概要・デフォルト見た目・性格・動機目標・背景生い立ち',
      'スキル・能力の動的追加 / 削除',
      '配役はドロップダウンで標準アーキタイプから選択',
    ],
  },
  {
    id: '08_character_detail.png',
    title: 'キャラクター詳細',
    description: 'キャラクターのデザイン画像と全プロフィールを閲覧する詳細画面。',
    features: [
      'ヘッダーにアバター・名前・役割・年齢・性別を表示',
      '三面図（AI 生成デザイン画像）の表示と再生成',
      '全プロフィール情報の閲覧（概要・外見・性格・動機・背景・スキル）',
      '「プロフィール編集」ボタンで編集フォームへ遷移',
      'キャラクターの削除（確認ダイアログ付き）',
    ],
  },
  {
    id: '10_episode_list.png',
    title: 'エピソード一覧',
    description: '作品に属するエピソードの一覧と管理を行う画面。',
    features: [
      'エピソードをカード一覧で表示（タイトル・話数・ステータス）',
      'フィルタータブで絞り込み（全件 / 公開済み / 下書き など）',
      '右パネルに選択エピソードのプレビュー（サムネイル・あらすじ）',
      '「漫画を見る」ボタンで完成したページのビューワーへ遷移',
      '「コミック編集」でシーン管理画面へ遷移',
      'エピソードの公開 / 公開取り下げ（確認ダイアログ付き）',
      'エピソードの削除（確認ダイアログ付き）',
      'バックグラウンド生成中はポーリングで自動更新',
    ],
  },
  {
    id: '11_episode_create.png',
    title: 'エピソード作成',
    description: 'AIを活用して新しいエピソードを生成する画面。右パネルにAI編集者が常駐。',
    features: [
      'エピソード種別選択: 「単独エピソード」または「続編」',
      '続編選択時は親エピソードを指定可能',
      '登場人物の選択（チェックボックス）',
      'タイトル・要約・本文のヒント入力（任意）',
      '「ストリームで生成」: AIが本文をリアルタイムにストリーミング出力',
      '「バックグラウンドで生成」: 裏で生成し一覧に自動反映',
      '右パネルに AI 編集者アシスタントを常設',
    ],
  },
  {
    id: '12_episode_edit.png',
    title: 'エピソード編集',
    description: '既存エピソードの内容を修正する画面。左サイドバーでエピソード間を素早く切り替え。',
    features: [
      '左サイドバーにエピソード一覧を表示し、クリックで即切り替え',
      'タブ構成: エピソード種別 / 登場人物 / 詳細（タイトル・要約・本文）',
      'エピソード種別・親エピソードの変更',
      '登場人物の追加・変更',
      'タイトル / 要約 / 本文のテキスト編集',
      '削除ボタン（確認ダイアログ付き）',
      '右パネルに AI 編集者アシスタントを常設',
    ],
  },
  {
    id: '13_scene_management.png',
    title: 'シーン管理（マンガ作成）',
    description: 'エピソードのコマ割りと画像生成を管理するメインの漫画制作画面。',
    features: [
      '左カラム: エピソード一覧でエピソードを切り替え',
      'ページサムネイルリスト: 縦スクロールで全ページを俯瞰',
      '中央: 選択ページを拡大プレビュー（ズーム調整可能）',
      '右パネル: コマ設定（プロンプト・セリフ等）と詳細情報',
      '「コマ割り再生成」: ページ全体のレイアウトをAIで再構成',
      '「ページ画像再生成」: 選択ページの画像のみ再生成',
      'ページ生成状況をステータスバッジ（生成中 / completed）で表示',
      '生成中は透明オーバーレイ＋スピナーでフィードバック',
    ],
  },
  {
    id: '14_manga_viewer.png',
    title: 'マンガビューワー',
    description: '生成したページを漫画として閲覧するリーダー画面。',
    features: [
      '見開き（右ページ＋左ページ）のマンガ形式表示',
      'クリックまたはキー操作でページ送り',
      'モバイル対応（1ページ表示）',
      '下部バーにエピソード名・現在ページ / 総ページ数を表示',
      'フルスクリーン切り替え',
    ],
  },
  {
    id: '15_panel_editor.png',
    title: 'コマ割り編集',
    description: 'ページのコマ割りレイアウトを手動で自由に設計するキャンバスエディタ。',
    features: [
      'ドラッグで線を引きコマを分割',
      'コマのクリックで選択・右パネルに詳細表示',
      '右パネル: 各コマのプロンプト・画像URLの編集',
      '元に戻す / やり直す（アンドゥ・リドゥ）',
      'リセットで初期1コマ状態に戻す',
      'レイアウト保存',
    ],
  },
  {
    id: '16_materials.png',
    title: '素材一覧',
    description: '物語で使用する背景・場面素材を管理するライブラリ画面。',
    features: [
      '左パネル: グループ管理（追加・切り替え）',
      '素材をカード形式で一覧表示',
      'テキスト検索でフィルタリング',
      '新しい順 / 古い順の並び替え',
      '「素材を生成」ボタンで生成フォームへ遷移',
    ],
  },
  {
    id: '17_material_create.png',
    title: '素材登録',
    description: 'AI画像生成に必要なパラメータを入力して背景素材を作成する画面。',
    features: [
      '基本情報: 名前・グループ・説明・アスペクト比・画風',
      'シーン描写: メインロケーション・詳細・世界観・時間帯・天気・空・照明',
      'ビジュアル要素: 前景（左/中/右）・中景（左/中/右）・背景（建物/地形）を細分化して記述',
      '「素材を生成」でAI画像生成を実行',
    ],
  },
  {
    id: '18_publish_settings.png',
    title: '公開設定',
    description: '作品をWeb公開するための表紙設定・公開管理画面。',
    features: [
      'ステップ形式の設定: 登場人物選択 / ビジュアルスタイル / レイアウト / あらすじ',
      'AI による表紙画像の生成（選択したキャラクターをもとに生成）',
      '表紙画像のプレビュー（右カラム）',
      '設定保存（表紙再生成せずに保存）',
      '「公開する」ボタンでストーリーをWeb公開',
      '「公開取り下げ」で非公開に戻す（確認ダイアログ付き）',
    ],
  },
  {
    id: '19_public_story.png',
    title: '公開ページ',
    description: 'ログイン不要で誰でも閲覧できる作品の公開ページ。',
    features: [
      'サイトヘッダーに "oregatari" ロゴを表示',
      '表紙画像・タイトル・ジャンル・著者・あらすじを表示',
      '最新話・第1話の公開日時を表示',
      '公開済みエピソードをカード一覧で表示（サムネイル・話数・タイトル）',
      'エピソードカードのクリックでインラインマンガビューワーを表示',
    ],
  },
  {
    id: '20_jobs.png',
    title: 'ジョブ一覧',
    description: 'AI生成ジョブ（画像生成・コマ割り・表紙画像）の実行履歴を管理する管理画面。',
    features: [
      'ジョブをテーブル形式で一覧表示（日時・物語/エピソード・ページ・種別・状態・モデル・エラー）',
      'ステータスフィルター（実行中 / 完了 / 失敗）',
      '種別フィルター（画像生成 / コマ割り / 表紙画像）',
      'ページネーション（50件/ページ）',
      'エピソードリンクからシーン管理画面に直接遷移',
      '使用モデル名・画像モデル名の表示（デバッグ用）',
    ],
  },
]

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>oregatari 機能一覧</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Hiragino Sans', 'Noto Sans JP', sans-serif; background: #fff; color: #1a1a1a; }

  .cover {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
    color: white;
    page-break-after: always;
  }
  .cover-logo {
    font-size: 64px;
    font-weight: 900;
    letter-spacing: -2px;
    margin-bottom: 16px;
  }
  .cover-logo span { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 6px; }
  .cover-subtitle { font-size: 20px; opacity: 0.85; margin-bottom: 48px; }
  .cover-date { font-size: 14px; opacity: 0.6; }

  .toc {
    padding: 48px 56px;
    page-break-after: always;
  }
  .toc h2 { font-size: 22px; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
  .toc-list { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 40px; }
  .toc-list li { font-size: 14px; display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
  .toc-list li .num { color: #7c3aed; font-weight: 700; width: 24px; }

  .page-section {
    padding: 40px 56px;
    page-break-inside: avoid;
    page-break-after: always;
  }
  .page-num {
    font-size: 11px;
    font-weight: 700;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin-bottom: 8px;
  }
  .page-desc {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
    border-left: 3px solid #7c3aed;
    padding-left: 12px;
  }
  .screenshot {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    margin-bottom: 20px;
    display: block;
  }
  .features-title {
    font-size: 13px;
    font-weight: 700;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .feature-list li {
    font-size: 13px;
    color: #333;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .feature-list li::before {
    content: '✓';
    color: #7c3aed;
    font-weight: 700;
    font-size: 12px;
    margin-top: 1px;
    flex-shrink: 0;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cover { height: 100vh; }
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-logo"><span>ore</span>gatari</div>
  <div class="cover-subtitle">機能一覧 — Feature Guide</div>
  <div class="cover-date">2025年5月</div>
</div>

<div class="toc">
  <h2>目次</h2>
  <ul class="toc-list">
    ${pages.map((p, i) => `<li><span class="num">${String(i + 1).padStart(2, '0')}</span>${p.title}</li>`).join('\n    ')}
  </ul>
</div>

${pages.map((p, i) => `
<div class="page-section">
  <div class="page-num">Screen ${String(i + 1).padStart(2, '0')}</div>
  <h2 class="page-title">${p.title}</h2>
  <p class="page-desc">${p.description}</p>
  <img class="screenshot" src="${img(p.id)}" alt="${p.title}" />
  <div class="features-title">主な機能</div>
  <ul class="feature-list">
    ${p.features.map((f) => `<li>${f}</li>`).join('\n    ')}
  </ul>
</div>
`).join('')}

</body>
</html>`

// HTML → PDF 変換
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext()
const pg = await ctx.newPage()
await pg.setContent(html, { waitUntil: 'networkidle' })
await pg.waitForTimeout(1000)
await pg.pdf({
  path: OUT_PDF,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})
await browser.close()
console.log('PDF generated:', OUT_PDF)
