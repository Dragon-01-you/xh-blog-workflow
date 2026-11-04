// 芯火个人品牌资产注册表 — The Personal Registry for 芯火 (Xinhuo)
// 严禁出现任何“星火”错别字，严格使用「芯火」

export interface BrandConfig {
  name: string
  enName: string
  tagline: string
  taglineEn: string
  bio: string
  bioEn: string
  avatar: string
  headshotLight: string
  headshotDark: string
  poster: string
  location: string
  locationCoordinates: {
    lat: string
    lng: string
  }
}

export const brandConfig: BrandConfig = {
  name: '芯火',
  enName: 'Xinhuo',
  tagline: '07 年大二学生 ·「AI + 自学」实用主义 · 公众号「来自07年的芯火」',
  taglineEn: 'College sophomore born in 2007 · Practical "AI + Self-Learning" · Author of "来自07年的芯火"',
  bio: '07 年出生，大专大二在读。不玩虚的大词，专注于个人成长赛道与「AI + 自学」实用主义。公众号「来自07年的芯火」主笔，主理开源工具与实用工作流。希望能通过自己的真实行动，陪伴和帮助更多专科同学一起提升自己。',
  bioEn: 'College sophomore born in 2007. Focused on personal growth and practical "AI + self-learning" workflows. Author of "来自07年的芯火", creator of open-source tools. Dedicated to empowering peers and sharing authentic self-improvement journeys.',
  avatar: '/images/avatar.png',
  headshotLight: '/images/headshot.jpg',
  headshotDark: '/images/portrait-square.jpg',
  poster: '/images/portrait-poster.png',
  location: 'Hangzhou, China (UTC+8)',
  locationCoordinates: {
    lat: '30.2741° N',
    lng: '120.1551° E',
  },
}

export const personalInfo = {
  name: '芯火',
  enName: 'Xinhuo',
  email: 'you19827801947@qq.com',
  handle: 'Dragon-01-you',
  github: 'https://github.com/Dragon-01-you',
  xiaoHongShu: 'https://xhslink.cn/o/74Svva7m0kZ',
  xiaoBaoTong: '', // 仅做字样展示，后续有真实专栏时再接入跳转
  weChatOfficial: '来自07年的芯火',
  weChatOfficialQr: '/images/wechat-qr.jpg',
}

export interface NavItem {
  href: string
  zh: string
  en: string
  description?: string
  descriptionEn?: string
}

export const navItems: readonly NavItem[] = [
  { href: '/', zh: '首页', en: 'Home', description: '关于与全景', descriptionEn: 'About & Overview' },
  { href: '/blog', zh: '写作', en: 'Writing', description: '深度思考与公开记录', descriptionEn: 'Essays & Learnings' },
  { href: '/projects', zh: '项目', en: 'Projects', description: '代表作与真实成果', descriptionEn: 'Selected Works' },
  { href: '/photos', zh: '相册', en: 'Photos', description: '视觉画廊与海报记录', descriptionEn: 'Visual Gallery' },
] as const

export interface Experience {
  company: string
  companyEn: string
  role: string
  roleEn: string
  from: number
  to?: number
  url?: string
}

export const experience: Experience[] = [
  {
    company: '芯火知识库 & AI 全栈工作流',
    companyEn: 'Xinhuo Knowledge Base & AI Full-Stack Workflows',
    role: '主理人 & 实用开源工具构建者',
    roleEn: 'Founder & Pragmatic Tooling Builder',
    from: 2026,
    url: 'https://github.com/Dragon-01-you',
  },
  {
    company: '大专自学与成长实践',
    companyEn: 'College Self-Learning & Personal Growth',
    role: '创办「来自07年的芯火」· 聚焦 AI 赋能与专科生自学成长',
    roleEn: 'Founder of "来自07年的芯火" · AI-empowered Self-learning',
    from: 2025,
    to: 2026,
    url: 'https://github.com/Dragon-01-you',
  },
]

export interface Record_ {
  artist: string
  album: string
  year: number
  genre: string
  spineColor: string
  spineInk: string
  url: string
  art: string
  cover: string
  mood: string
  moodEn: string
  comment: string
  commentEn: string
}

// 芯火 6 首定番音乐原版封面与外链
export const records: Record_[] = [
  {
    artist: '坂本龙一',
    album: 'Merry Christmas Mr. Lawrence',
    year: 1983,
    genre: 'Soundtrack',
    spineColor: '#2b2c30',
    spineInk: '#f7f4ed',
    art: '/images/records/merry-christmas-mr-lawrence.jpg',
    cover: '/images/records/merry-christmas-mr-lawrence.jpg',
    url: 'https://music.163.com/#/song?id=437715323',
    mood: '学习时听',
    moodEn: 'For Focus',
    comment: '空灵纯粹的琴音穿透岁月，带领思维进入极致深度的沉浸心流。',
    commentEn: 'Ethereal piano melodies piercing through time, guiding the mind into deep creative flow.',
  },
  {
    artist: '小野',
    album: '山野煮水',
    year: 2024,
    genre: 'Folk',
    spineColor: '#7a8577',
    spineInk: '#f7f4ed',
    art: '/images/records/shanye-zhushui.jpg',
    cover: '/images/records/shanye-zhushui.jpg',
    url: 'https://music.163.com/#/song?id=2677687612',
    mood: '放松时听',
    moodEn: 'For Relaxation',
    comment: '山野幽居，松风竹火煮泉鸣，卸下一整天的数字疲惫。',
    commentEn: 'Mountain seclusion and simmering kettle; unburdening the digital fatigue of the day.',
  },
  {
    artist: '韩安旭',
    album: '多幸运',
    year: 2015,
    genre: 'Pop',
    spineColor: '#e0c29f',
    spineInk: '#171717',
    art: '/images/records/duo-xing-yun.jpg',
    cover: '/images/records/duo-xing-yun.jpg',
    url: 'https://music.163.com/#/song?id=35847037',
    mood: '开心时听',
    moodEn: 'For Joy',
    comment: '温柔欢快的生活小确幸，为每一天的日常前行注入阳光好心情。',
    commentEn: 'Warm and upbeat daily serendipity, infusing cheerful sunlight into everyday progress.',
  },
  {
    artist: '颜人中',
    album: '解药',
    year: 2020,
    genre: 'Pop',
    spineColor: '#434a54',
    spineInk: '#f7f4ed',
    art: '/images/records/jie-yao.jpg',
    cover: '/images/records/jie-yao.jpg',
    url: 'https://music.163.com/#/song?id=3422235430',
    mood: '放松时听',
    moodEn: 'For Relaxation',
    comment: '颗粒感醇厚嗓音与微醺夜色，是高强度交付后最好的精神缓释解药。',
    commentEn: 'A husky, rich vocal texture under dusky lamps—the finest restorative for high-output days.',
  },
  {
    artist: 'GALA',
    album: '追梦赤子心',
    year: 2011,
    genre: 'Rock',
    spineColor: '#b83b32',
    spineInk: '#f7f4ed',
    art: '/images/records/zhui-meng-chi-zi-xin.jpg',
    cover: '/images/records/zhui-meng-chi-zi-xin.jpg',
    url: 'https://music.163.com/#/song?id=355992',
    mood: '开心时听',
    moodEn: 'For Joy',
    comment: '不妥协的呐喊与奔跑，无论顺逆都保持心中那一团永不熄灭的炽热芯火。',
    commentEn: 'Uncompromising passion and running forward; keeping the core flame forever ignited.',
  },
  {
    artist: '汪苏泷',
    album: '就让这大雨全都落下',
    year: 2022,
    genre: 'Pop',
    spineColor: '#3a4b5c',
    spineInk: '#f7f4ed',
    art: '/images/records/jiu-rang-zhe-da-yu.jpg',
    cover: '/images/records/jiu-rang-zhe-da-yu.jpg',
    url: 'https://music.163.com/#/song?id=1984475097',
    mood: '放松时听',
    moodEn: 'For Relaxation',
    comment: '倾盆大雨洗涤纷繁思绪，于风暴止歇之处重拾清澈笃定。',
    commentEn: 'Let the downpour wash away clutter, rediscovering serene clarity when the sky clears.',
  },
]

export interface Book {
  title: string
  author: string
  year: number
  category: string
  spineTitle?: string
  spineAuthor?: string
  spineColor: string
  spineInk: string
  art: string
  cover: string
  coverWidth?: number
  coverHeight?: number
  spine?: number
  url: string
  comment: string
  commentEn: string
}

// 芯火 8 本珍藏原书正封与直达链接
export const books: Book[] = [
  {
    title: '史蒂夫·乔布斯传',
    author: '沃尔特·艾萨克森',
    year: 2011,
    category: '人物传记',
    spineTitle: '乔布斯传',
    spineAuthor: 'WI',
    spineColor: '#e2e2e2',
    spineInk: '#171717',
    art: '/images/books/steve-jobs.jpg',
    cover: '/images/books/steve-jobs.jpg',
    coverWidth: 1127,
    coverHeight: 1503,
    spine: 28,
    url: 'https://z-library.sk/s/%E5%8F%B2%E8%92%82%E5%A4%AB%C2%B7%E4%B9%94%E5%B8%83%E6%96%AF%E4%BC%A0',
    comment: '活着就是为了改变世界。站在科技与人文艺术的十字路口，追求纯粹极致的产品美学。',
    commentEn: 'Put a ding in the universe. Stand at the intersection of technology and the humanities.',
  },
  {
    title: '原则',
    author: '瑞·达利欧',
    year: 2018,
    category: '商业思考',
    spineTitle: '原则',
    spineAuthor: 'RD',
    spineColor: '#c53929',
    spineInk: '#f7f4ed',
    art: '/images/books/principles.jpg',
    cover: '/images/books/principles.jpg',
    coverWidth: 1536,
    coverHeight: 2048,
    spine: 26,
    url: 'https://z-library.sk/s/%E5%8E%9F%E5%88%99',
    comment: '痛苦 + 反思 = 进步。极度求真、极度透明，用机械化系统的思维应对现实挑战。',
    commentEn: 'Pain + Reflection = Progress. Radical truth and radical transparency through systemic thinking.',
  },
  {
    title: '思考，快与慢',
    author: '丹尼尔·卡尼曼',
    year: 2012,
    category: '认知心理',
    spineTitle: '思考快与慢',
    spineAuthor: 'DK',
    spineColor: '#ffffff',
    spineInk: '#171717',
    art: '/images/books/thinking-fast-and-slow.jpg',
    cover: '/images/books/thinking-fast-and-slow.jpg',
    coverWidth: 768,
    coverHeight: 1024,
    spine: 24,
    url: 'https://z-library.sk/s/%E6%80%9D%E8%80%83%EF%BC%8C%E5%BF%AB%E4%B8%8E%E6%85%A2',
    comment: '警惕快系统直觉的启发式偏误，学会主动调用慢系统进行深度理性复盘。',
    commentEn: 'Beware the heuristic bias of System 1; actively recruit System 2 for deliberate analysis.',
  },
  {
    title: '价值心法',
    author: '姜胡说',
    year: 2023,
    category: '商业认知',
    spineTitle: '价值心法',
    spineAuthor: 'JHS',
    spineColor: '#1d2a44',
    spineInk: '#f7f4ed',
    art: '/images/books/value-mindset.jpg',
    cover: '/images/books/value-mindset.jpg',
    coverWidth: 563,
    coverHeight: 800,
    spine: 22,
    url: 'https://z-library.sk/s/%E4%BB%B7%E5%80%BC%E5%BF%83%E6%B3%95',
    comment: '商业竞争的底层是认知穿透与价值创造，守住根本，耐心做时间的朋友。',
    commentEn: 'Underlying all business is cognitive clarity and genuine value creation. Be a friend of time.',
  },
  {
    title: '纳瓦尔宝典',
    author: '埃里克·乔根森',
    year: 2022,
    category: '人生哲学',
    spineTitle: '纳瓦尔宝典',
    spineAuthor: 'EJ',
    spineColor: '#d6cbb8',
    spineInk: '#171717',
    art: '/images/books/naval-almanack.jpg',
    cover: '/images/books/naval-almanack.jpg',
    coverWidth: 560,
    coverHeight: 800,
    spine: 22,
    url: 'https://z-library.sk/s/%E7%BA%B3%E7%93%A6%E5%B0%94%E5%AE%9D%E5%85%B8',
    comment: '培养专属知识，利用代码与媒体杠杆，构建边际成本为零的确定性认知资产。',
    commentEn: 'Build specific knowledge, apply leverage via code and media, and compound cognitive assets.',
  },
  {
    title: '富兰克林自传',
    author: '本杰明·富兰克林',
    year: 1791,
    category: '人物传记',
    spineTitle: '富兰克林自传',
    spineAuthor: 'BF',
    spineColor: '#583e2e',
    spineInk: '#f7f4ed',
    art: '/images/books/benjamin-franklin.jpg',
    cover: '/images/books/benjamin-franklin.jpg',
    coverWidth: 600,
    coverHeight: 800,
    spine: 24,
    url: 'https://z-library.sk/s/%E5%AF%8C%E5%85%B0%E5%85%8B%E6%9E%97%E8%87%AA%E4%BC%A0',
    comment: '以十三项品德修养日日自省自新，自律自强成就非凡一生的终身学习典范。',
    commentEn: 'A daily ledger of thirteen virtues; lifelong self-directed learning forging a quiet master.',
  },
  {
    title: '穷查理宝典',
    author: '彼得·考夫曼',
    year: 2005,
    category: '投资与智慧',
    spineTitle: '穷查理宝典',
    spineAuthor: 'CM',
    spineColor: '#1a2732',
    spineInk: '#f7f4ed',
    art: '/images/books/poor-charlie.jpg',
    cover: '/images/books/poor-charlie.jpg',
    coverWidth: 1364,
    coverHeight: 1819,
    spine: 28,
    url: 'https://z-library.sk/s/%E7%A9%B7%E6%9F%A5%E7%90%86%E5%AE%9D%E5%85%B8',
    comment: '多元思维模型格栅，倒过来想，总是倒过来想；避开显而易见的愚蠢，智慧自然涌现。',
    commentEn: 'A latticework of mental models. Invert, always invert; avoid obvious stupidity.',
  },
  {
    title: '刻意练习',
    author: '安德斯·埃里克森',
    year: 2016,
    category: '技能精进',
    spineTitle: '刻意练习',
    spineAuthor: 'AE',
    spineColor: '#c89d66',
    spineInk: '#171717',
    art: '/images/books/deliberate-practice.jpg',
    cover: '/images/books/deliberate-practice.jpg',
    coverWidth: 768,
    coverHeight: 1024,
    spine: 24,
    url: 'https://z-library.sk/s/%E5%88%BB%E6%84%8F%E7%BB%83%E4%B9%A0',
    comment: '走出舒适区，建立精细心理表征与即时反馈回路，任何卓越技能皆可后天习得。',
    commentEn: 'Step out of the comfort zone; construct mental representations and feedback loops.',
  },
]
