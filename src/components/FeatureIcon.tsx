import type { ReactElement } from 'react'

export type IconName = 'link' | 'play' | 'clock' | 'layers' | 'gauge' | 'power'

const paths: Record<IconName, ReactElement> = {
  link: (
    <>
      <path d="M8.5 11.5 11.5 8.5" />
      <path d="M7 13l-1.5 1.5a3 3 0 0 1-4.2-4.2L4 7.5a3 3 0 0 1 4.2 0" />
      <path d="M13 7l1.5-1.5a3 3 0 0 0-4.2-4.2L7.5 4" />
    </>
  ),
  play: <polygon points="6,4 16,10 6,16" />,
  clock: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </>
  ),
  layers: (
    <>
      <path d="M10 3l7 4-7 4-7-4z" />
      <path d="M3 11l7 4 7-4" />
    </>
  ),
  gauge: (
    <>
      <path d="M3 14a7 7 0 0 1 14 0" />
      <path d="M10 14l3.5-4.5" />
    </>
  ),
  power: (
    <>
      <path d="M10 3v7" />
      <path d="M6 6a6 6 0 1 0 8 0" />
    </>
  ),
}

export function FeatureIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
