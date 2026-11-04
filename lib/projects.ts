export interface Project {
  name: string
  nameEn: string
  description: string
  descriptionEn?: string
  url: string
  icon: string
  domain: string
}

export const projects: Project[] = [
  {
    name: 'xh-ai-fullstack-workflow',
    nameEn: 'XH AI Full-Stack Workflow',
    description: '芯火 XH · AI 全栈工作流：先搭环境，再出考卷，再让 AI 答卷。固化为可被任何 AI 读取与执行的规范体系。',
    descriptionEn: 'AI full-stack development workflow: set up environment, design test questions, then let AI answer.',
    url: 'https://github.com/Dragon-01-you/xh-ai-fullstack-workflow',
    icon: '/images/projects/xh-ai-fullstack-workflow.png',
    domain: 'github.com',
  },
  {
    name: 'xh-forensics',
    nameEn: 'XH Forensics',
    description: 'AI 中转站 API 验真取证工具：模型验真 · 系统提示词提取 · 上下游供应链溯源。',
    descriptionEn: 'AI relay API forensics & authenticity verification: model check, prompt extraction, and supply chain tracing.',
    url: 'https://github.com/Dragon-01-you/xh-forensics',
    icon: '/images/projects/xh-forensics.png',
    domain: 'github.com',
  },
  {
    name: 'lesson-plan-skill',
    nameEn: 'Lesson Plan Skill',
    description: 'AI-Powered Lesson Plan Generator for Claude Code | 智能教案生成器，标准化教研设计与大纲编排。',
    descriptionEn: 'AI-powered lesson plan generator for Claude Code, automating curriculum design and syllabus structure.',
    url: 'https://github.com/Dragon-01-you/lesson-plan-skill',
    icon: '/images/projects/lesson-plan-skill.png',
    domain: 'github.com',
  },
  {
    name: 'storage-analyzer',
    nameEn: 'Storage Analyzer',
    description: 'Windows 磁盘深度清理工具 | 96 个内置规则清理器 | 4 层置信度防误删系统。',
    descriptionEn: 'Windows deep disk cleanup utility with 96 built-in cleaners and a 4-tier confidence safety architecture.',
    url: 'https://github.com/Dragon-01-you/storage-analyzer',
    icon: '/images/projects/storage-analyzer.png',
    domain: 'github.com',
  },
  {
    name: 'tool-fabric',
    nameEn: 'Tool Fabric',
    description: 'Universal tool adapter layer for AI agents — 一行代码连接任意工具，节省 60%+ Token。',
    descriptionEn: 'Universal tool adapter layer for AI agents: connect any tool in one line while slashing token usage by 60%+.',
    url: 'https://github.com/Dragon-01-you/tool-fabric',
    icon: '/images/projects/tool-fabric.png',
    domain: 'github.com',
  },
  {
    name: 'MimoMeter',
    nameEn: 'MimoMeter',
    description: 'Local API usage monitor for MiMo Token Plan — 本地轻量化 API 用量与额度监控仪表盘。',
    descriptionEn: 'Local API usage monitor and token plan quota tracker for developer workflows.',
    url: 'https://github.com/Dragon-01-you/MimoMeter',
    icon: '/images/projects/mimometer.png',
    domain: 'github.com',
  },
  {
    name: '学校信息库与数据活名片',
    nameEn: 'Campus Living Data Card',
    description: '2025.10 为母校江西工业工程职业技术学院打造的招生与就业数据名片系统，把枯燥数字转化为可交互看板。',
    descriptionEn: 'Campus admissions and career statistics interactive dashboard engineered for Jiangxi Engineering Vocational College.',
    url: '/blog/campus-data-card-for-alma-mater',
    icon: '/images/projects/campus-data-card.png',
    domain: 'xinhuo.ai',
  },
]
