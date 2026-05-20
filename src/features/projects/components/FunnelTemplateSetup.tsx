'use client'

import { useState } from 'react'
import { FunnelTemplateSelector } from './FunnelTemplateSelector'

type FunnelTemplate = {
  id: string
  name: string
  category: string
  stages: string[]
  industry_median_drop_off: Record<string, number>
}

interface Props {
  projectId: string
  templates: FunnelTemplate[]
}

export function FunnelTemplateSetup({ projectId, templates }: Props) {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <FunnelTemplateSelector
      projectId={projectId}
      templates={templates}
      onDone={() => setOpen(false)}
    />
  )
}
