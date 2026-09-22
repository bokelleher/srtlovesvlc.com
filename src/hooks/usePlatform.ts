import { useMemo } from 'react'

export type Platform = 'mac' | 'windows' | 'other'

type NavHint = {
  userAgentData?: { platform?: string }
  platform?: string
  userAgent?: string
}

/** Mac is tested first: "darwin" would otherwise match the Windows test. */
export function detectPlatform(nav: NavHint): Platform {
  const hint = (nav.userAgentData?.platform || nav.platform || nav.userAgent || '').toLowerCase()
  if (/mac/.test(hint)) return 'mac'
  if (/win/.test(hint)) return 'windows'
  return 'other'
}

export function usePlatform(): Platform {
  return useMemo(
    () => (typeof navigator === 'undefined' ? 'other' : detectPlatform(navigator as NavHint)),
    [],
  )
}
