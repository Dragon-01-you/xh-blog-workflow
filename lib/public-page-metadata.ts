export const publicPageMetadata = {
  home: {
    zh: {
      title: '芯火',
      description: '保持独立思考，构建确定性认知资产。专注 AI 敏捷生产力、知识沉淀工程与极简全栈系统。',
      ogDescription: '保持独立思考，构建确定性认知资产。专注 AI 敏捷生产力、知识沉淀工程与极简全栈系统。',
    },
    en: {
      title: 'Xinhuo',
      description: 'Independent thinking, building tangible cognitive assets. Focusing on AI workflows, knowledge architecture, and minimalist design.',
      ogDescription: 'Independent thinking, building tangible cognitive assets. Focusing on AI workflows, knowledge architecture, and minimalist design.',
    },
  },
  blog: {
    zh: {
      title: '写作',
      description: '深度思考与公开记录，关于 AI 工作流、知识沉淀工程与敏捷实践。',
      ogDescription: '芯火关于设计、工程、AI 工作流与敏捷实践的深度思考。',
    },
    en: {
      title: 'Writing',
      description: 'Essays and reflections on AI workflows, knowledge architecture, and agile productivity.',
      ogDescription: 'Essays by Xinhuo on AI workflows, knowledge architecture, and agile productivity.',
    },
  },
  photos: {
    zh: {
      title: '相册',
      description: '在工作、生活与创作中留下的一些瞬间与影像记录。',
      ogDescription: '芯火在工作、生活与创作中留下的一些瞬间与影像记录。',
    },
    en: {
      title: 'Photos',
      description: 'Captured moments and visual records across work, life, and creation.',
      ogDescription: 'Moments Xinhuo has kept from work, life, and everywhere in between.',
    },
  },
  projects: {
    zh: {
      title: '项目',
      description: '这些年构建的 AI 工业管线、知识库系统与开源工程实践。有些实用，有些探索，每一个都认真做过。',
      ogDescription: '芯火构建的 AI 工业管线、知识库系统与开源工程实践。',
    },
    en: {
      title: 'Projects',
      description: 'AI pipelines, knowledge systems, and open-source workflows built over the years. Some practical, some exploratory, all crafted with care.',
      ogDescription: 'Products, pipelines, and open-source tools made with care.',
    },
  },
  admin: {
    zh: {
      title: '运营监控',
      description: '本地免密运营监控台与健康巡检概览。',
      ogDescription: '本地免密运营监控台与健康巡检概览。',
    },
    en: {
      title: 'Admin Overview',
      description: 'Local passwordless operational monitor and telemetry overview.',
      ogDescription: 'Local passwordless operational monitor and telemetry overview.',
    },
  },
} as const

export type PublicSection = Exclude<keyof typeof publicPageMetadata, 'home'>
