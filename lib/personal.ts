// 芯火个人品牌资产注册表 — The Personal Registry for 芯火 (Xinhuo)
// 严禁出现任何“星火”错别字，严格使用「芯火」

export interface BrandConfig {
  name: string
  enName: string
  tagline: string
  taglineEn: string
  bio: string
  bioEn: string
  heroIntroZh?: string
  heroIntroEn?: string
  sectionIntroBlog?: string
  sectionIntroBlogEn?: string
  sectionIntroProjects?: string
  sectionIntroProjectsEn?: string
  sectionIntroPhotos?: string
  sectionIntroPhotosEn?: string
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
  heroIntroZh: '一个 07 年的大专大二学生。在这里真实记录通过 AI 敏捷生产力与知识沉淀改变自己的过程。',
  heroIntroEn: 'a college sophomore born in 2007, documenting real self-growth through practical AI and learning.',
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
  githubUser: 'Dragon-01-you',
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
    comment: '把产品当作品做。打动我的不是改变世界的大话，而是连机箱里面看不见的走线都要规整——凡是交付给别人的东西，自己得先看得起。',
    commentEn: 'Treat products as craft. What struck me wasn\'t grand slogans, but making even unseen internal wiring tidy—if you ship it, respect your own craft first.',
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
    comment: '做事情最怕掩耳盗铃。把碰到的每次翻车、每次卡住都当成机器里的齿轮故障，写成复盘清单。机器坏了修机器，别陷入情绪内耗。',
    commentEn: 'Don\'t deceive yourself. Treat every failure or bottleneck as a mechanical glitch to log and fix, rather than wallowing in emotional exhaustion.',
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
    comment: '直觉往往让人急于求成、浮于表面。每次觉得“稳了”或者“做不到”时，停下来强迫自己把逻辑步长拆细，看看到底卡在哪一步。',
    commentEn: 'Intuition often makes us rush into shallow assumptions. Whenever I feel "done" or "hopeless", I force myself to slow down and trace the exact breakdown step by step.',
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
    comment: '江湖老师教的五环闭环：需求、供给、触达、交换、反馈。没有解决真实需求，再花哨的技术也是空中楼阁；一次解决一个真问题，交付物才是硬道理。',
    commentEn: 'The five-loop closed loop from Jianghu: demand, supply, outreach, exchange, feedback. Tech is meaningless without real problems; deliver tangible value every single time.',
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
    comment: '专科生没有耀眼的背书，但可以用代码和内容做杠杆。打造属于自己的独到经验，公开构建、真实记录，让每一次自学都有迹可循。',
    commentEn: 'Without elite credentials, code and content are our levers. Build unique insights, build in public, and ensure every self-taught milestone leaves verifiable proof.',
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
    comment: '一个印刷学徒凭着自学日积月累改变命运。他的美德清单本质就是可落地的日常自律系统——不画大饼，把手头每件小事踏踏实实做周全。',
    commentEn: 'A printer\'s apprentice who transformed his destiny through self-study. His virtue ledger is a daily operating system—no empty promises, just steady craftsmanship.',
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
    comment: '想明白怎么做之前，先列出怎么做一定会完蛋。避开偷懒、浮躁和装懂这些显而易见的大坑，脚踏实地走稳每一步，路就走对了。',
    commentEn: 'Before figuring out success, list what guarantees disaster. Invert the problem, avoid laziness and pretense, and progress takes care of itself.',
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
    comment: '自学不是漫无目的地看视频刷教程，而是给自己设计明确的靶子，做完立刻看结果对不对。在拉伸区反复碰壁、校准，能力才能真正长在身上。',
    commentEn: 'Self-learning isn\'t passively watching tutorials. It\'s aiming at concrete targets, getting immediate feedback, and stretching outside comfort until skills stick.',
  },
]
