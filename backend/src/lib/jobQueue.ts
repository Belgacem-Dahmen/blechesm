import { generateImage } from '../services/ai'

interface Job {
  status: 'pending' | 'processing' | 'done' | 'error'
  url?: string
  error?: string
  createdAt: number
}

const jobs = new Map<string, Job>()

export function getJob(jobId: string): Job | undefined {
  return jobs.get(jobId)
}

export function enqueueJob(opts: {
  jobId: string
  wallPhotoUrl?: string
  refPhotoUrl?: string
  description: string
  serviceType: string
}): void {
  jobs.set(opts.jobId, { status: 'pending', createdAt: Date.now() })

  processJob(opts).catch((err: Error) => {
    jobs.set(opts.jobId, { status: 'error', error: err.message, createdAt: Date.now() })
  })
}

async function processJob(opts: {
  jobId: string
  wallPhotoUrl?: string
  refPhotoUrl?: string
  description: string
  serviceType: string
}): Promise<void> {
  jobs.set(opts.jobId, { status: 'processing', createdAt: Date.now() })
  const url = await generateImage({
    wallPhotoUrl: opts.wallPhotoUrl,
    refPhotoUrl: opts.refPhotoUrl,
    description: opts.description,
    serviceType: opts.serviceType,
  })
  jobs.set(opts.jobId, { status: 'done', url, createdAt: Date.now() })
}
