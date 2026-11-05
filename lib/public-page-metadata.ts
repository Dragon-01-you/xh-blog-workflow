import { brandConfig } from '~/lib/personal'

export const publicPageMetadata = {
  home: {
    zh: {
      title: brandConfig.name,
      description: brandConfig.tagline || '保持独立思考，构建确定性认知资产。专注 AI 敏捷生产力、知识沉淀工程与极简全栈系统。',
      ogDescription: brandConfig.tagline || '保持独立思考，构建确定性认知资产。专注 AI 敏捷生产力、知识沉淀工程与极简全栈系统。',
    },
    en: {
      title: brandConfig.enName,
      description: brandConfig.taglineEn || 'Independent thinking, building tangible cognitive assets. Focusing on AI workflows, knowledge architecture, and minimalist design.',
      ogDescription: brandConfig.taglineEn || 'Independent thinking, building tangible cognitive assets. Focusing on AI workflows, knowledge architecture, and minimalist design.',
    },
  },
  blog: {
    zh: {
      title: '写作',
      description: brandConfig.sectionIntroBlog || `${brandConfig.name}的深度思考与公开记录。`,
      ogDescription: brandConfig.sectionIntroBlog || `${brandConfig.name}的深度思考与公开记录。`,
    },
    en: {
      title: 'Writing',
      description: brandConfig.sectionIntroBlogEn || `Essays and reflections by ${brandConfig.enName}.`,
      ogDescription: brandConfig.sectionIntroBlogEn || `Essays and reflections by ${brandConfig.enName}.`,
    },
  },
  photos: {
    zh: {
      title: '相册',
      description: brandConfig.sectionIntroPhotos || `${brandConfig.name}在工作、生活与创作中留下的一些瞬间与影像记录。`,
      ogDescription: brandConfig.sectionIntroPhotos || `${brandConfig.name}在工作、生活与创作中留下的一些瞬间与影像记录。`,
    },
    en: {
      title: 'Photos',
      description: brandConfig.sectionIntroPhotosEn || `Moments ${brandConfig.enName} has kept from work, life, and everywhere in between.`,
      ogDescription: brandConfig.sectionIntroPhotosEn || `Moments ${brandConfig.enName} has kept from work, life, and everywhere in between.`,
    },
  },
  projects: {
    zh: {
      title: '项目',
      description: brandConfig.sectionIntroProjects || `${brandConfig.name}构建的代表作品、工具系统与开源实践。`,
      ogDescription: brandConfig.sectionIntroProjects || `${brandConfig.name}构建的代表作品、工具系统与开源实践。`,
    },
    en: {
      title: 'Projects',
      description: brandConfig.sectionIntroProjectsEn || `Products, systems, and open-source workflows crafted by ${brandConfig.enName}.`,
      ogDescription: brandConfig.sectionIntroProjectsEn || `Products, systems, and open-source workflows crafted by ${brandConfig.enName}.`,
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
