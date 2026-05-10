import { chromium } from 'playwright'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PDF = join(__dirname, 'oregatari-infra.pdf')

// ─── 矢印ヘルパー ─────────────────────────────────────────────
function arrow(x1, y1, x2, y2, label = '', color = '#6b7280', bend = 0) {
  const mx = (x1 + x2) / 2 + bend
  const my = (y1 + y2) / 2
  const markerId = `arrow-${color.replace('#', '')}`
  return `
    <defs>
      <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="${color}" />
      </marker>
    </defs>
    <path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}"
      fill="none" stroke="${color}" stroke-width="1.8"
      stroke-dasharray="${bend !== 0 ? '5,3' : 'none'}"
      marker-end="url(#${markerId})" />
    ${label ? `<text x="${mx + (bend > 0 ? 8 : -8)}" y="${my}" font-size="11" fill="${color}"
      text-anchor="${bend >= 0 ? 'start' : 'end'}" dominant-baseline="middle"
      font-family="'SF Mono', 'Fira Code', monospace">${label}</text>` : ''}
  `
}

// ─── SVG コンポーネント ────────────────────────────────────────
function box({ x, y, w, h, rx = 10, fill, stroke, label, sub, icon = '' }) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"
      fill="${fill}" stroke="${stroke}" stroke-width="1.5" />
    ${icon ? `<text x="${x + 14}" y="${y + h / 2 + 1}" font-size="18"
      dominant-baseline="middle">${icon}</text>` : ''}
    <text x="${x + (icon ? 38 : w / 2)}" y="${y + h / 2 - (sub ? 7 : 0)}"
      font-size="13" font-weight="700" fill="white" font-family="'Inter', 'Helvetica Neue', sans-serif"
      dominant-baseline="middle" ${icon ? '' : 'text-anchor="middle"'}>${label}</text>
    ${sub ? `<text x="${x + (icon ? 38 : w / 2)}" y="${y + h / 2 + 11}"
      font-size="10.5" fill="rgba(255,255,255,0.7)" font-family="'Inter', sans-serif"
      dominant-baseline="middle" ${icon ? '' : 'text-anchor="middle"'}>${sub}</text>` : ''}
  `
}

function platformBox({ x, y, w, h, rx = 14, fill, stroke, label, labelColor = 'rgba(255,255,255,0.5)' }) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"
      fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6,3" />
    <text x="${x + 16}" y="${y + 22}" font-size="11" font-weight="700"
      fill="${labelColor}" letter-spacing="1.5"
      font-family="'Inter', 'Helvetica Neue', sans-serif"
      text-transform="uppercase">${label}</text>
  `
}

function badge(x, y, text, fill, textColor = 'white') {
  const w = text.length * 7 + 16
  return `
    <rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="${fill}" />
    <text x="${x + w / 2}" y="${y + 10}" font-size="9.5" font-weight="700"
      fill="${textColor}" text-anchor="middle" dominant-baseline="middle"
      font-family="'Inter', sans-serif" letter-spacing="0.5">${text}</text>
  `
}

// ─── 寸法定義 ──────────────────────────────────────────────────
const W = 1160   // canvas width
const H = 820    // canvas height

// 左カラム X中心
const LC = 310
// 右カラム X
const RC_X = 680

// ブラウザ
const BX = LC - 130, BY = 60, BW = 260, BH = 64

// Vercel プラットフォーム
const VP_X = 60, VP_Y = 175, VP_W = 500, VP_H = 220
// FE / BE ボックス
const FE_X = VP_X + 24, FE_Y = VP_Y + 46, FE_W = 210, FE_H = 76
const BE_X = VP_X + 266, BE_Y = VP_Y + 46, BE_W = 210, BE_H = 76
// Cron バッジ
const CRON_X = VP_X + 24, CRON_Y = VP_Y + VP_H - 38

// Mastra
const MA_X = 60, MA_Y = 450, MA_W = 500, MA_H = 170

// Gemini
const GE_X = LC - 140, GE_Y = 676, GE_W = 280, GE_H = 76

// Supabase プラットフォーム
const SP_X = RC_X, SP_Y = 175, SP_W = 420, SP_H = 577
// Auth / DB / Storage ボックス
const AU_X = SP_X + 24, AU_Y = SP_Y + 46, AU_W = 372, AU_H = 64
const DB_X = SP_X + 24, DB_Y = SP_Y + 134, DB_W = 372, DB_H = 64
const ST_X = SP_X + 24, ST_Y = SP_Y + 222, ST_W = 372, ST_H = 306

// バケット行
const BK_X = ST_X + 16, BK_W = ST_W - 32, BK_H = 44
const BK1_Y = ST_Y + 54, BK2_Y = ST_Y + 114, BK3_Y = ST_Y + 174

// 接続ポイント計算
const browser_bottom   = [BX + BW / 2, BY + BH]
const vercel_top       = [LC, VP_Y]
const vercel_bottom    = [LC, VP_Y + VP_H]
const fe_right         = [FE_X + FE_W, FE_Y + FE_H / 2]
const be_right         = [BE_X + BE_W, BE_Y + BE_H / 2]
const vercel_right     = [VP_X + VP_W, VP_Y + VP_H / 2]
const mastra_top       = [LC, MA_Y]
const mastra_bottom    = [LC, MA_Y + MA_H]
const mastra_right     = [MA_X + MA_W, MA_Y + MA_H / 2]
const gemini_top       = [GE_X + GE_W / 2, GE_Y]
const supabase_left_au = [SP_X, AU_Y + AU_H / 2]
const supabase_left_db = [SP_X, DB_Y + DB_H / 2]
const supabase_left_st = [SP_X, ST_Y + ST_H / 2]

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>oregatari インフラ構成図</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; background: #fff; }
  .wrap { padding: 32px 40px; }
  .title-row { display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px; }
  .title { font-family: 'Inter', 'Helvetica Neue', sans-serif; font-size: 22px;
           font-weight: 800; color: #111; letter-spacing: -0.5px; }
  .subtitle { font-family: 'Inter', sans-serif; font-size: 13px; color: #888; }
  .diagram { display: block; }
</style>
</head>
<body>
<div class="wrap">
  <div class="title-row">
    <span class="title">oregatari インフラ構成図</span>
    <span class="subtitle">Infrastructure Architecture · 2025</span>
  </div>

  <svg class="diagram" width="${W - 80}" height="${H}" viewBox="0 0 ${W - 80} ${H}"
    xmlns="http://www.w3.org/2000/svg" font-family="'Inter', 'Helvetica Neue', sans-serif">

    <!-- ═══ DEFS (矢印マーカー) ═══ -->
    <defs>
      <marker id="mk-gray" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#9ca3af"/>
      </marker>
      <marker id="mk-vercel" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#374151"/>
      </marker>
      <marker id="mk-mastra" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#7c3aed"/>
      </marker>
      <marker id="mk-supabase" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#059669"/>
      </marker>
      <marker id="mk-gemini" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L7,3.5 z" fill="#2563eb"/>
      </marker>
      <linearGradient id="grad-mastra" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4c1d95"/>
        <stop offset="100%" style="stop-color:#6d28d9"/>
      </linearGradient>
      <linearGradient id="grad-gemini" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e3a8a"/>
        <stop offset="100%" style="stop-color:#1d4ed8"/>
      </linearGradient>
      <linearGradient id="grad-supabase-bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#f0fdf4"/>
        <stop offset="100%" style="stop-color:#dcfce7"/>
      </linearGradient>
    </defs>

    <!-- ═══ ブラウザ ═══ -->
    <rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="10"
      fill="#1f2937" stroke="#374151" stroke-width="1.5"/>
    <text x="${BX + BW/2}" y="${BY + BH/2 - 7}" font-size="18" text-anchor="middle"
      dominant-baseline="middle">🌐</text>
    <text x="${BX + BW/2}" y="${BY + BH/2 + 12}" font-size="13" font-weight="700"
      fill="white" text-anchor="middle">ブラウザ（ユーザー）</text>

    <!-- Browser → Vercel: HTTPS -->
    <line x1="${browser_bottom[0]}" y1="${browser_bottom[1]}"
          x2="${vercel_top[0]}" y2="${vercel_top[1]}"
          stroke="#9ca3af" stroke-width="1.8" marker-end="url(#mk-gray)"/>
    <rect x="${LC - 28}" y="${BY + BH + 8}" width="56" height="18" rx="9" fill="#e5e7eb"/>
    <text x="${LC}" y="${BY + BH + 17}" font-size="9" fill="#374151"
      text-anchor="middle" dominant-baseline="middle" font-weight="600">HTTPS</text>

    <!-- ═══ Vercel Platform ═══ -->
    <rect x="${VP_X}" y="${VP_Y}" width="${VP_W}" height="${VP_H}" rx="12"
      fill="#f9fafb" stroke="#d1d5db" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="${VP_X + 14}" y="${VP_Y + 20}" font-size="10" font-weight="700"
      fill="#9ca3af" letter-spacing="1.5">VERCEL PLATFORM</text>

    <!-- FE ボックス -->
    <rect x="${FE_X}" y="${FE_Y}" width="${FE_W}" height="${FE_H}" rx="8"
      fill="#111827" stroke="#374151" stroke-width="1.5"/>
    <text x="${FE_X + FE_W/2}" y="${FE_Y + 24}" font-size="11" font-weight="800"
      fill="white" text-anchor="middle">oregatari-fe</text>
    <text x="${FE_X + FE_W/2}" y="${FE_Y + 40}" font-size="10" fill="#9ca3af"
      text-anchor="middle">React + Vite</text>
    <text x="${FE_X + FE_W/2}" y="${FE_Y + 56}" font-size="10" fill="#6b7280"
      text-anchor="middle">Vercel CDN（静的配信）</text>

    <!-- BE ボックス -->
    <rect x="${BE_X}" y="${BE_Y}" width="${BE_W}" height="${BE_H}" rx="8"
      fill="#111827" stroke="#374151" stroke-width="1.5"/>
    <text x="${BE_X + BE_W/2}" y="${BE_Y + 24}" font-size="11" font-weight="800"
      fill="white" text-anchor="middle">oregatari-be</text>
    <text x="${BE_X + BE_W/2}" y="${BE_Y + 40}" font-size="10" fill="#9ca3af"
      text-anchor="middle">Hono.js</text>
    <text x="${BE_X + BE_W/2}" y="${BE_Y + 56}" font-size="10" fill="#6b7280"
      text-anchor="middle">Vercel Functions（サーバーレス）</text>

    <!-- FE → BE (/api/*) -->
    <path d="M${FE_X + FE_W},${FE_Y + FE_H/2 - 6} L${BE_X},${BE_Y + BE_H/2 - 6}"
      fill="none" stroke="#4b5563" stroke-width="1.5" marker-end="url(#mk-vercel)"/>
    <text x="${FE_X + FE_W + (BE_X - FE_X - FE_W)/2}" y="${FE_Y + FE_H/2 - 14}"
      font-size="9.5" fill="#6b7280" text-anchor="middle" font-weight="600">REST /api/*</text>

    <!-- Cron バッジ -->
    <rect x="${CRON_X}" y="${CRON_Y}" width="${VP_W - 48}" height="24" rx="8"
      fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
    <text x="${CRON_X + 10}" y="${CRON_Y + 12}" font-size="10" fill="#6b7280"
      dominant-baseline="middle">⏰</text>
    <text x="${CRON_X + 28}" y="${CRON_Y + 12}" font-size="10" fill="#6b7280"
      dominant-baseline="middle" font-weight="600">Vercel Cron</text>
    <text x="${CRON_X + 104}" y="${CRON_Y + 12}" font-size="10" fill="#9ca3af"
      dominant-baseline="middle">— 毎日 0:00 に /ping を実行（DB 接続維持）</text>

    <!-- Vercel → Mastra -->
    <line x1="${vercel_bottom[0]}" y1="${vercel_bottom[1]}"
          x2="${mastra_top[0]}" y2="${mastra_top[1]}"
          stroke="#7c3aed" stroke-width="1.8" marker-end="url(#mk-mastra)"/>
    <rect x="${LC - 52}" y="${VP_Y + VP_H + 9}" width="104" height="18" rx="9" fill="#ede9fe"/>
    <text x="${LC}" y="${VP_Y + VP_H + 18}" font-size="9" fill="#6d28d9"
      text-anchor="middle" dominant-baseline="middle" font-weight="600">HTTP · MastraClient</text>

    <!-- ═══ Mastra ═══ -->
    <rect x="${MA_X}" y="${MA_Y}" width="${MA_W}" height="${MA_H}" rx="12"
      fill="url(#grad-mastra)" stroke="#6d28d9" stroke-width="1.5"/>
    <text x="${MA_X + MA_W/2}" y="${MA_Y + 28}" font-size="14" font-weight="800"
      fill="white" text-anchor="middle">Mastra Server</text>
    <text x="${MA_X + MA_W/2}" y="${MA_Y + 46}" font-size="10.5" fill="rgba(255,255,255,0.6)"
      text-anchor="middle">AI エージェント・ワークフロー基盤</text>

    <!-- Mastra 内部バッジ -->
    <rect x="${MA_X + 24}" y="${MA_Y + 66}" width="138" height="76" rx="8"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="${MA_X + 93}" y="${MA_Y + 82}" font-size="10" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">Workflows</text>
    <text x="${MA_X + 93}" y="${MA_Y + 98}" font-size="9.5" fill="rgba(255,255,255,0.6)"
      text-anchor="middle">8 ワークフロー</text>
    <text x="${MA_X + 93}" y="${MA_Y + 114}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">story / episode / panel</text>
    <text x="${MA_X + 93}" y="${MA_Y + 128}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">image / cover / three-view</text>

    <rect x="${MA_X + 180}" y="${MA_Y + 66}" width="138" height="76" rx="8"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="${MA_X + 249}" y="${MA_Y + 82}" font-size="10" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">Agents</text>
    <text x="${MA_X + 249}" y="${MA_Y + 98}" font-size="9.5" fill="rgba(255,255,255,0.6)"
      text-anchor="middle">8 エージェント</text>
    <text x="${MA_X + 249}" y="${MA_Y + 114}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">StoryWriter / Episode</text>
    <text x="${MA_X + 249}" y="${MA_Y + 128}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">PanelLayout / PageImage...</text>

    <rect x="${MA_X + 336}" y="${MA_Y + 66}" width="138" height="76" rx="8"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="${MA_X + 405}" y="${MA_Y + 82}" font-size="10" font-weight="700"
      fill="rgba(255,255,255,0.9)" text-anchor="middle">Tools</text>
    <text x="${MA_X + 405}" y="${MA_Y + 98}" font-size="9.5" fill="rgba(255,255,255,0.6)"
      text-anchor="middle">20+ ツール</text>
    <text x="${MA_X + 405}" y="${MA_Y + 114}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">Prisma / Supabase SDK</text>
    <text x="${MA_X + 405}" y="${MA_Y + 128}" font-size="9" fill="rgba(255,255,255,0.5)"
      text-anchor="middle">Gemini 画像生成</text>

    <!-- Mastra → Gemini -->
    <line x1="${mastra_bottom[0]}" y1="${mastra_bottom[1]}"
          x2="${gemini_top[0]}" y2="${gemini_top[1]}"
          stroke="#2563eb" stroke-width="1.8" marker-end="url(#mk-gemini)"/>
    <rect x="${LC - 44}" y="${MA_Y + MA_H + 9}" width="88" height="18" rx="9" fill="#dbeafe"/>
    <text x="${LC}" y="${MA_Y + MA_H + 18}" font-size="9" fill="#1d4ed8"
      text-anchor="middle" dominant-baseline="middle" font-weight="600">Gemini API</text>

    <!-- ═══ Google Gemini ═══ -->
    <rect x="${GE_X}" y="${GE_Y}" width="${GE_W}" height="${GE_H}" rx="10"
      fill="url(#grad-gemini)" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="${GE_X + GE_W/2}" y="${GE_Y + 24}" font-size="13" font-weight="800"
      fill="white" text-anchor="middle">Google Gemini</text>
    <text x="${GE_X + GE_W/2}" y="${GE_Y + 42}" font-size="10" fill="rgba(255,255,255,0.7)"
      text-anchor="middle">gemini-2.5-pro（テキスト生成）</text>
    <text x="${GE_X + GE_W/2}" y="${GE_Y + 58}" font-size="10" fill="rgba(255,255,255,0.7)"
      text-anchor="middle">gemini-2.5-pro（画像生成モード）</text>

    <!-- ═══ Supabase Platform ═══ -->
    <rect x="${SP_X}" y="${SP_Y}" width="${SP_W}" height="${SP_H}" rx="12"
      fill="url(#grad-supabase-bg)" stroke="#86efac" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="${SP_X + 14}" y="${SP_Y + 20}" font-size="10" font-weight="700"
      fill="#16a34a" letter-spacing="1.5">SUPABASE PLATFORM</text>

    <!-- Auth ボックス -->
    <rect x="${AU_X}" y="${AU_Y}" width="${AU_W}" height="${AU_H}" rx="8"
      fill="#059669" stroke="#047857" stroke-width="1.5"/>
    <text x="${AU_X + AU_W/2}" y="${AU_Y + 24}" font-size="12" font-weight="700"
      fill="white" text-anchor="middle">🔐  Supabase Auth</text>
    <text x="${AU_X + AU_W/2}" y="${AU_Y + 43}" font-size="10" fill="rgba(255,255,255,0.7)"
      text-anchor="middle">JWT セッション管理 · メール / パスワード認証</text>

    <!-- DB ボックス -->
    <rect x="${DB_X}" y="${DB_Y}" width="${DB_W}" height="${DB_H}" rx="8"
      fill="#065f46" stroke="#047857" stroke-width="1.5"/>
    <text x="${DB_X + DB_W/2}" y="${DB_Y + 24}" font-size="12" font-weight="700"
      fill="white" text-anchor="middle">🐘  Supabase PostgreSQL</text>
    <text x="${DB_X + DB_W/2}" y="${DB_Y + 43}" font-size="10" fill="rgba(255,255,255,0.7)"
      text-anchor="middle">Prisma ORM · BE + Mastra どちらからも直接アクセス</text>

    <!-- Storage ボックス -->
    <rect x="${ST_X}" y="${ST_Y}" width="${ST_W}" height="${ST_H}" rx="8"
      fill="#064e3b" stroke="#047857" stroke-width="1.5"/>
    <text x="${ST_X + ST_W/2}" y="${ST_Y + 28}" font-size="12" font-weight="700"
      fill="white" text-anchor="middle">🗄️  Supabase Storage</text>
    <text x="${ST_X + ST_W/2}" y="${ST_Y + 46}" font-size="10" fill="rgba(255,255,255,0.6)"
      text-anchor="middle">Mastra が生成した画像をアップロード · FE が公開 URL で表示</text>

    <!-- バケット行 1 -->
    <rect x="${BK_X}" y="${BK1_Y}" width="${BK_W}" height="${BK_H}" rx="6"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="${BK_X + 14}" y="${BK1_Y + BK_H/2}" font-size="11" fill="rgba(255,255,255,0.9)"
      dominant-baseline="middle">📁</text>
    <text x="${BK_X + 34}" y="${BK1_Y + BK_H/2 - 6}" font-size="10.5" font-weight="600"
      fill="rgba(255,255,255,0.9)" dominant-baseline="middle">character-images</text>
    <text x="${BK_X + 34}" y="${BK1_Y + BK_H/2 + 10}" font-size="9.5"
      fill="rgba(255,255,255,0.5)" dominant-baseline="middle">キャラクター三面図・設定画</text>

    <!-- バケット行 2 -->
    <rect x="${BK_X}" y="${BK2_Y}" width="${BK_W}" height="${BK_H}" rx="6"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="${BK_X + 14}" y="${BK2_Y + BK_H/2}" font-size="11" fill="rgba(255,255,255,0.9)"
      dominant-baseline="middle">📁</text>
    <text x="${BK_X + 34}" y="${BK2_Y + BK_H/2 - 6}" font-size="10.5" font-weight="600"
      fill="rgba(255,255,255,0.9)" dominant-baseline="middle">episode-pages</text>
    <text x="${BK_X + 34}" y="${BK2_Y + BK_H/2 + 10}" font-size="9.5"
      fill="rgba(255,255,255,0.5)" dominant-baseline="middle">生成された漫画ページ画像</text>

    <!-- バケット行 3 -->
    <rect x="${BK_X}" y="${BK3_Y}" width="${BK_W}" height="${BK_H}" rx="6"
      fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="${BK_X + 14}" y="${BK3_Y + BK_H/2}" font-size="11" fill="rgba(255,255,255,0.9)"
      dominant-baseline="middle">📁</text>
    <text x="${BK_X + 34}" y="${BK3_Y + BK_H/2 - 6}" font-size="10.5" font-weight="600"
      fill="rgba(255,255,255,0.9)" dominant-baseline="middle">story-covers</text>
    <text x="${BK_X + 34}" y="${BK3_Y + BK_H/2 + 10}" font-size="9.5"
      fill="rgba(255,255,255,0.5)" dominant-baseline="middle">作品の表紙画像</text>

    <!-- データフロー説明 (Storage 内下部) -->
    <text x="${ST_X + ST_W/2}" y="${ST_Y + ST_H - 50}" font-size="9.5"
      fill="rgba(255,255,255,0.4)" text-anchor="middle">生成後 → 公開 URL → FE が img src で直接参照</text>
    <text x="${ST_X + ST_W/2}" y="${ST_Y + ST_H - 34}" font-size="9.5"
      fill="rgba(255,255,255,0.4)" text-anchor="middle">URL は DB（episodePage.imageUrl 等）に保存</text>

    <!-- ═══ 右向き矢印（FE/BE → Supabase） ═══ -->

    <!-- FE → Auth（Auth SDK） -->
    <path d="M${FE_X + FE_W},${FE_Y + FE_H * 0.35}
             C${FE_X + FE_W + 80},${FE_Y + FE_H * 0.35}
              ${SP_X - 80},${AU_Y + AU_H * 0.35}
              ${SP_X},${AU_Y + AU_H * 0.35}"
      fill="none" stroke="#059669" stroke-width="1.6" marker-end="url(#mk-supabase)"
      stroke-dasharray="5,3"/>
    <text x="${(FE_X + FE_W + SP_X)/2}" y="${FE_Y + FE_H * 0.35 - 14}"
      font-size="9.5" fill="#059669" text-anchor="middle" font-weight="600">Auth SDK（ログイン・JWT）</text>

    <!-- BE → DB（Prisma） -->
    <path d="M${BE_X + BE_W},${BE_Y + BE_H * 0.65}
             C${BE_X + BE_W + 60},${BE_Y + BE_H * 0.65}
              ${SP_X - 60},${DB_Y + DB_H * 0.65}
              ${SP_X},${DB_Y + DB_H * 0.65}"
      fill="none" stroke="#374151" stroke-width="1.6" marker-end="url(#mk-vercel)"/>
    <text x="${(BE_X + BE_W + SP_X)/2 + 4}" y="${(BE_Y + BE_H * 0.65 + DB_Y + DB_H * 0.65)/2 - 10}"
      font-size="9.5" fill="#374151" text-anchor="middle" font-weight="600">Prisma ORM</text>

    <!-- Mastra → DB（Prisma） -->
    <path d="M${MA_X + MA_W},${MA_Y + MA_H * 0.38}
             C${MA_X + MA_W + 50},${MA_Y + MA_H * 0.38}
              ${SP_X - 50},${DB_Y + DB_H * 0.5}
              ${SP_X},${DB_Y + DB_H * 0.5}"
      fill="none" stroke="#7c3aed" stroke-width="1.6" marker-end="url(#mk-mastra)"
      stroke-dasharray="5,3"/>
    <text x="${(MA_X + MA_W + SP_X)/2 + 4}" y="${(MA_Y + MA_H * 0.38 + DB_Y + DB_H * 0.5)/2 - 10}"
      font-size="9.5" fill="#7c3aed" text-anchor="middle" font-weight="600">Prisma ORM</text>

    <!-- Mastra → Storage（Supabase SDK） -->
    <path d="M${MA_X + MA_W},${MA_Y + MA_H * 0.65}
             C${MA_X + MA_W + 60},${MA_Y + MA_H * 0.65}
              ${SP_X - 60},${ST_Y + ST_H * 0.35}
              ${SP_X},${ST_Y + ST_H * 0.35}"
      fill="none" stroke="#7c3aed" stroke-width="1.6" marker-end="url(#mk-mastra)"/>
    <text x="${(MA_X + MA_W + SP_X)/2 + 4}" y="${(MA_Y + MA_H * 0.65 + ST_Y + ST_H * 0.35)/2 + 14}"
      font-size="9.5" fill="#7c3aed" text-anchor="middle" font-weight="600">Supabase SDK（画像アップロード）</text>

    <!-- ═══ 凡例 ═══ -->
    <rect x="60" y="${H - 52}" width="${W - 160}" height="40" rx="8"
      fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
    <text x="80" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle"
      font-weight="700">凡例：</text>

    <!-- 実線 -->
    <line x1="130" y1="${H - 32}" x2="160" y2="${H - 32}"
      stroke="#374151" stroke-width="1.8" marker-end="url(#mk-vercel)"/>
    <text x="166" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle">同期通信</text>

    <!-- 破線 -->
    <line x1="240" y1="${H - 32}" x2="270" y2="${H - 32}"
      stroke="#6b7280" stroke-width="1.8" stroke-dasharray="5,3" marker-end="url(#mk-gray)"/>
    <text x="276" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle">非同期 / SDK</text>

    <!-- 紫線 -->
    <line x1="370" y1="${H - 32}" x2="400" y2="${H - 32}"
      stroke="#7c3aed" stroke-width="1.8" marker-end="url(#mk-mastra)"/>
    <text x="406" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle">Mastra 関連</text>

    <!-- 緑線 -->
    <line x1="486" y1="${H - 32}" x2="516" y2="${H - 32}"
      stroke="#059669" stroke-width="1.8" marker-end="url(#mk-supabase)"/>
    <text x="522" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle">Supabase 関連</text>

    <!-- 青線 -->
    <line x1="608" y1="${H - 32}" x2="638" y2="${H - 32}"
      stroke="#2563eb" stroke-width="1.8" marker-end="url(#mk-gemini)"/>
    <text x="644" y="${H - 32}" font-size="10" fill="#6b7280" dominant-baseline="middle">Gemini API</text>

  </svg>
</div>
</body>
</html>`

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: W + 80, height: H + 100 } })
const pg = await ctx.newPage()
await pg.setContent(html, { waitUntil: 'networkidle' })
await pg.waitForTimeout(500)
await pg.pdf({
  path: OUT_PDF,
  width: `${W + 80}px`,
  height: `${H + 100}px`,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})
await browser.close()
console.log('PDF generated:', OUT_PDF)
