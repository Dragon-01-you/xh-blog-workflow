import React from 'react'
import { brandConfig } from '~/lib/personal'
import { getAllPosts } from '~/lib/content'
import { getGitHub } from '~/lib/social-live'
import { photos } from '~/lib/photos'
import { projects } from '~/lib/projects'
import { HomeIntroduction } from '~/components/home-introduction'
import { HalftonePortrait } from '~/components/halftone-portrait'
import { PortraitHiddenStage } from '~/components/portrait-hidden-stage'
import { NavCards } from '~/components/nav-cards'
import { ExperienceSection } from '~/components/experience'
import { VinylShelf } from '~/components/vinyl-shelf'
import { Bookshelf } from '~/components/bookshelf'

export default async function HomePage(): Promise<React.JSX.Element> {
  const [posts, github] = await Promise.all([
    Promise.resolve(getAllPosts()),
    getGitHub(),
  ])

  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6 space-y-12 py-6">
      {/* Hero Section: Sincere Introduction & Halftone Portrait with Hidden Stage */}
      <section className="flex flex-col-reverse justify-between gap-10 sm:flex-row sm:items-start">
        <div className="enter max-w-[19rem] flex-1">
          <HomeIntroduction github={github} />
        </div>

        <div className="w-[9.35rem] shrink-0 sm:w-60">
          <PortraitHiddenStage label={`${brandConfig.name}的半色调网点肖像。点击切换隐藏等高线舞台`}>
            <HalftonePortrait
              className="w-full h-full block"
              srcLight={brandConfig.headshotLight}
              srcDark={brandConfig.headshotDark}
              alt={`${brandConfig.name}的半色调网点肖像`}
              altEn={`${brandConfig.enName || brandConfig.name}'s halftone portrait`}
            />
          </PortraitHiddenStage>
        </div>
      </section>

      {/* The Three Doorways */}
      <NavCards postCount={posts.length} projectCount={projects.length} photoCount={photos.length} />

      {/* 01 // 经历 (Experience & Coordinate Card) */}
      <ExperienceSection />

      {/* 03 // 循环播放中 (Vinyl Record Shelf) */}
      <VinylShelf />

      {/* 04 // 珍藏书架 (3D Bookshelf) */}
      <Bookshelf />
    </div>
  )
}
