import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLabel } from '~/components/external-mark'
import { GhostSchematic } from '~/components/ghost-schematic'
import { ProjectsBlueprintStage } from '~/components/hidden-list-stage'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { projects } from '~/lib/projects'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export const metadata: Metadata = {
  title: publicPageMetadata.projects.zh.title,
  description: publicPageMetadata.projects.zh.description,
  alternates: {
    canonical: '/projects',
  },
}

export default function ProjectsPage(): React.JSX.Element {
  const center = (projects.length - 1) / 2

  return (
    <div className="relative mx-auto w-full max-w-[37.5rem] px-6 py-6">
      <GhostSchematic className="top-4 right-6 hidden w-56 sm:block" />

      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[34rem]">
          <h1 className="page-eyebrow enter">
            <T zh="项目" en="Projects" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance text-sm leading-relaxed text-[var(--muted-foreground)]"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            <T
              zh={publicPageMetadata.projects.zh.description}
              en={publicPageMetadata.projects.en.description}
            />
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      <ProjectsBlueprintStage className="mt-10">
        <ul className="focus-list flex flex-col divide-y divide-[var(--border)]">
          {projects.map((project, index) => {
            const isInternal = project.url.startsWith('/')

            return (
              <li
                key={project.name}
                className="enter-swing py-3"
                style={
                  {
                    '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                  } as React.CSSProperties
                }
              >
                <Link
                  href={project.url}
                  target={isInternal ? undefined : '_blank'}
                  rel={isInternal ? undefined : 'noreferrer'}
                  className="project-row group"
                  data-list-stage-row
                  data-list-stage-id={project.name}
                >
                  <span
                    className="project-icon-frame"
                    aria-hidden="true"
                    data-list-stage-anchor
                  >
                    <Image
                      src={project.icon}
                      alt=""
                      width={36}
                      height={36}
                      className="project-icon rounded-md border border-[var(--border)]"
                    />
                  </span>
                  <span className="project-identity">
                    <span className="project-name font-medium text-[var(--foreground)] group-hover:text-[var(--signal)] transition-colors">
                      {isInternal ? (
                        <T zh={project.name} en={project.nameEn} />
                      ) : (
                        <ExternalLabel>
                          <T zh={project.name} en={project.nameEn} />
                        </ExternalLabel>
                      )}
                    </span>
                    <span className="project-domain text-xs font-mono text-[var(--muted-foreground)]">
                      {project.domain}
                    </span>
                  </span>
                  <span className="project-description text-sm text-[var(--muted-foreground)] leading-relaxed">
                    <T
                      zh={project.description}
                      en={project.descriptionEn ?? project.description}
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </ProjectsBlueprintStage>
    </div>
  )
}
