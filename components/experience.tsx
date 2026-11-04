'use client'

import React from 'react'
import { ExternalLabel } from './external-mark'
import { T } from '~/lib/i18n'
import { brandConfig, experience, type Experience } from '~/lib/personal'

export function ExperienceSection() {
  return (
    <section className="mt-14 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-wider">
          01 //
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          <T zh="经历" en="Experience" />
        </h2>
        <div className="h-px flex-1 bg-[var(--border)] opacity-60" />
      </div>

      {/* Coordinate Map Card */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono font-medium text-[var(--foreground)]">
              {brandConfig.location}
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[var(--muted-foreground)]">
            <span>LAT: {brandConfig.locationCoordinates.lat}</span>
            <span>LNG: {brandConfig.locationCoordinates.lng}</span>
          </div>
        </div>
      </div>

      {/* Career Timeline */}
      <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {experience.map((job: Experience, index: number) => (
          <li key={`${job.company}-${index}`} className="experience-row text-sm py-3.5">
            <div className="experience-details">
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="experience-company font-medium text-[var(--foreground)] hover:text-[var(--signal)] transition-colors inline-flex items-center group"
                >
                  <ExternalLabel>
                    <T zh={job.company} en={job.companyEn} />
                  </ExternalLabel>
                </a>
              ) : (
                <span className="experience-company font-medium text-[var(--foreground)]">
                  <T zh={job.company} en={job.companyEn} />
                </span>
              )}
              <span className="experience-role text-xs text-[var(--muted-foreground)] mt-0.5">
                <T zh={job.role} en={job.roleEn ?? job.role} />
              </span>
            </div>
            <span className="experience-date text-xs font-mono text-[var(--muted-foreground)] tabular-nums shrink-0 pt-0.5">
              {job.from}—{job.to ?? <T zh="现在" en="now" />}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ExperienceSection
