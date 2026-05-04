export type ArchetypeRole = 'MENTOR' | 'SHADOW' | 'HERALD' | 'SHAPESHIFTER'

export const ARCHETYPE_ROLE_LABELS: Record<ArchetypeRole, string> = {
  MENTOR: 'メンター（賢者）',
  SHADOW: 'シャドウ（敵対者）',
  HERALD: 'ヘラルド（使者）',
  SHAPESHIFTER: 'シェイプシフター（変幻者）',
}

export const ARCHETYPE_ROLE_SPLIT: Record<ArchetypeRole, { main: string; sub: string }> = {
  MENTOR: { main: 'メンター', sub: '賢者' },
  SHADOW: { main: 'シャドウ', sub: '敵対者' },
  HERALD: { main: 'ヘラルド', sub: '使者' },
  SHAPESHIFTER: { main: 'シェイプシフター', sub: '変幻者' },
}

export const ARCHETYPE_ROLE_DESCRIPTIONS: Record<
  ArchetypeRole,
  { summary: string; traits: string[] }
> = {
  MENTOR: {
    summary:
      '主人公を導く知恵ある存在。経験や知識を授け、困難な旅路を照らします。「老師」「守護者」とも呼ばれます。',
    traits: [
      '知識・知恵を授ける',
      '主人公の成長を後押しする',
      '試練を与えることもある',
      '主人公が岐路に立つとき現れる',
    ],
  },
  SHADOW: {
    summary:
      '主人公と対立し、物語に緊張と葛藤をもたらす存在。内なる恐怖や弱さを体現することもあり、単なる悪役とは限りません。',
    traits: [
      '主人公の対極に位置する',
      '物語の障害・試練となる',
      '主人公の成長を引き出す鏡',
      '読者の緊張感を高める',
    ],
  },
  HERALD: {
    summary:
      '変化の訪れを告げ、新たな冒険の始まりを知らせる存在。物語の転換点をもたらし、主人公を行動へと駆り立てます。',
    traits: [
      '新たな冒険・変化の使者',
      '物語を動かすきっかけ',
      '情報や課題を持ち込む',
      '序盤に登場することが多い',
    ],
  },
  SHAPESHIFTER: {
    summary:
      '忠誠心や意図が掴みにくい謎めいた存在。読者と主人公の両方に疑念と期待をもたらし、物語に複雑さを加えます。',
    traits: [
      '味方か敵か判断しにくい',
      '緊張感・ミステリーを生む',
      '物語に複雑さをもたらす',
      '変化・成長の象徴でもある',
    ],
  },
}

export interface CharacterDraft {
  name: string
  role: string
  archetypeRole: ArchetypeRole | ''
  gender: string
  age: string
  skills: string
  overview: string
  appearance: string
  personality: string
  motivation: string
  background: string
}

export interface Character {
  id: number
  initials: string
  name: string
  role: string
  isProtagonist: boolean
  description: string
  avatarColor: string
  imageUrl?: string | null
  age?: string
  gender?: string
}

export interface CharacterDetail extends Character {
  age: string
  gender: string
  archetypeRole?: ArchetypeRole | null
  overview: string
  appearance: string
  personality: string
  background: string
  motivation: string
  skills: string[]
}
