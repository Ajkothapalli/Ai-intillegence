import type { Project } from '@/features/projects/types'

type UploadSummary = {
  file_name: string
  file_type: 'csv' | 'screenshot'
  content?: string
}

export function buildAnalysisPrompt(project: Project, uploads: UploadSummary[]): string {
  const projectBlock = `## Project Context
Name: ${project.name}
${project.description ? `Description: ${project.description}` : ''}
${project.target_audience ? `Target audience: ${project.target_audience}` : ''}
${project.funnel_stages?.length ? `Funnel stages: ${project.funnel_stages.join(' → ')}` : ''}
${project.primary_metric ? `Primary metric: ${project.primary_metric}` : ''}
${project.business_goal ? `Business goal: ${project.business_goal}` : ''}`

  const uploadsBlock = uploads.length > 0
    ? uploads.map(u => `### ${u.file_type === 'csv' ? 'CSV Data' : 'Screenshot'}: ${u.file_name}
${u.content ? u.content : '(Binary file — analyze based on filename and context)'}`).join('\n\n')
    : 'No files uploaded — generate recommendations based on project context and general B2C growth patterns, with lower confidence scores.'

  return `${projectBlock}

## Uploaded Data
${uploadsBlock}

## Task
Analyze the above and generate prioritized experiment recommendations. Return valid JSON matching the schema: { recommendations: [...], summary?: string }`
}
