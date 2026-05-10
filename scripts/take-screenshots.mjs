import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, 'screenshots')

const BASE_URL = 'http://localhost:5173'
const EMAIL = 'omnivore4lancer@gmail.com'
const PASSWORD = 'password'

await mkdir(OUT_DIR, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

// APIレスポンスからIDを収集
const capturedIds = { storyId: null, charId: null, episodeId: null }

context.on('response', async (response) => {
  const url = response.url()
  try {
    if (url.includes('/api/stories') && !url.includes('/story/') && response.status() === 200) {
      const body = await response.json().catch(() => null)
      if (Array.isArray(body) && body.length > 0 && !capturedIds.storyId) {
        capturedIds.storyId = body[0].id
        console.log(`  [intercept] storyId = ${capturedIds.storyId}`)
      }
    }
    if (url.match(/\/api\/stories\/\d+\/characters$/) && response.status() === 200) {
      const body = await response.json().catch(() => null)
      if (Array.isArray(body) && body.length > 0 && !capturedIds.charId) {
        capturedIds.charId = body[0].id
        console.log(`  [intercept] charId = ${capturedIds.charId}`)
      }
    }
    if (url.match(/\/api\/stories\/\d+\/episodes$/) && response.status() === 200) {
      const body = await response.json().catch(() => null)
      if (Array.isArray(body) && body.length > 0 && !capturedIds.episodeId) {
        capturedIds.episodeId = body[0].id
        console.log(`  [intercept] episodeId = ${capturedIds.episodeId}`)
      }
    }
  } catch {}
})

async function ss(filename, fn) {
  console.log(`  → ${filename}`)
  await fn()
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(1000)
  await page.screenshot({ path: join(OUT_DIR, filename), fullPage: false })
}

// ログイン
console.log('Logging in...')
await page.goto(`${BASE_URL}/login`)
await page.waitForLoadState('networkidle')
await page.fill('input[type="email"]', EMAIL)
await page.fill('input[type="password"]', PASSWORD)
await page.click('button[type="submit"]')
await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 15000 })
console.log('Logged in.')

// 1. ダッシュボード (storyIdもここで取得)
await ss('01_dashboard.png', async () => {
  await page.goto(`${BASE_URL}/dashboard`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
})

// storyIdが取れていれば各ページへ
// キャラクター・エピソード一覧を事前にロードしてIDを収集
if (capturedIds.storyId) {
  const base = `${BASE_URL}/stories/${capturedIds.storyId}`

  // キャラクター・エピソードIDを取得するためページロード
  await page.goto(`${base}/characters`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  await page.goto(`${base}/episodes`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
}

console.log('Captured IDs:', capturedIds)

const storyId = capturedIds.storyId
const charId = capturedIds.charId
const episodeId = capturedIds.episodeId

// 0. ログインページ (別コンテキスト)
console.log('  → 00_login.png')
{
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const p2 = await ctx2.newPage()
  await p2.goto(`${BASE_URL}/login`)
  await p2.waitForLoadState('networkidle')
  await p2.waitForTimeout(800)
  await p2.screenshot({ path: join(OUT_DIR, '00_login.png') })
  await ctx2.close()
}

// 1. ダッシュボード (再撮)
await ss('01_dashboard.png', async () => {
  await page.goto(`${BASE_URL}/dashboard`)
})

// 2. 新規作品作成 ステップ1
await ss('02_story_create_step1.png', async () => {
  await page.goto(`${BASE_URL}/stories/new`)
})

// 3. 新規作品作成 ステップ2
await ss('03_story_create_step2.png', async () => {
  await page.goto(`${BASE_URL}/stories/new`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(800)
  await page.fill('input[placeholder="物語のタイトルを入力"]', 'テスト').catch(() => {})
  // ジャンルボタンをクリック
  const genreBtns = await page.locator('button[class*="ToggleButton"], button').filter({ hasText: /ファンタジー|SF|アクション|ドラマ/ }).all()
  if (genreBtns.length > 0) await genreBtns[0].click().catch(() => {})
  await page.locator('button').filter({ hasText: /^次へ$/ }).click().catch(() => {})
  await page.waitForTimeout(600)
})

if (storyId) {
  const base = `${BASE_URL}/stories/${storyId}`

  // 4. ストーリー設定（基本設定タブ）
  await ss('04_story_story.png', async () => {
    await page.goto(`${base}/story`)
  })

  // 5. 相関図
  await ss('05_story_cast.png', async () => {
    await page.goto(`${base}/cast`)
  })

  // 6. キャラクター一覧
  await ss('06_character_list.png', async () => {
    await page.goto(`${base}/characters`)
  })

  // 7. キャラクター新規作成
  await ss('07_character_create.png', async () => {
    await page.goto(`${base}/characters/new`)
  })

  if (charId) {
    // 8. キャラクター詳細
    await ss('08_character_detail.png', async () => {
      await page.goto(`${base}/characters/${charId}`)
    })

    // 9. キャラクタープロフィール編集
    await ss('09_character_edit.png', async () => {
      await page.goto(`${base}/characters/${charId}/edit`)
    })
  }

  // 10. エピソード一覧
  await ss('10_episode_list.png', async () => {
    await page.goto(`${base}/episodes`)
  })

  // 11. エピソード新規作成
  await ss('11_episode_create.png', async () => {
    await page.goto(`${base}/episodes/new`)
  })

  if (episodeId) {
    // 12. エピソード編集
    await ss('12_episode_edit.png', async () => {
      await page.goto(`${base}/episodes/${episodeId}/edit`)
    })

    // 13. シーン管理
    await ss('13_scene_management.png', async () => {
      await page.goto(`${base}/episodes/${episodeId}/scenes`)
    })

    // 14. マンガビューワー
    await ss('14_manga_viewer.png', async () => {
      await page.goto(`${base}/episodes/${episodeId}/viewer`)
    })
  }

  // 15. コマ割り編集
  await ss('15_panel_editor.png', async () => {
    await page.goto(`${base}/panels`)
  })

  // 16. 素材一覧
  await ss('16_materials.png', async () => {
    await page.goto(`${base}/materials`)
  })

  // 17. 素材登録
  await ss('17_material_create.png', async () => {
    await page.goto(`${base}/materials/new`)
  })

  // 18. 公開設定
  await ss('18_publish_settings.png', async () => {
    await page.goto(`${base}/publish`)
  })

  // 19. 公開ページ
  await ss('19_public_story.png', async () => {
    await page.goto(`${BASE_URL}/works/${storyId}`)
  })
}

// 20. ジョブ一覧
await ss('20_jobs.png', async () => {
  await page.goto(`${BASE_URL}/jobs`)
})

await browser.close()
console.log('\nDone! Screenshots saved to:', OUT_DIR)
