export interface Photo {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn?: string
  src: string
  width: number
  height: number
  date: string
  location?: string
  camera?: string
}

// 相册暗房成果挑选归档中，初始化为空数组
export const photos: Photo[] = []
