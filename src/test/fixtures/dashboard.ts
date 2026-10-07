import type { DashboardResponse } from '@auto-lincoln/contracts'

export const dashboard: DashboardResponse = {
  glance: { posts: 12, reviews: 5, pages: 3 },
  latestNews: {
    id: '1b2c3d4e-0000-4000-8000-000000000041',
    title: 'New parts arrived',
    publishedAt: '2026-09-01T09:00:00.000Z',
  },
  latestReview: null,
  requests: { all: 10, pending: 2, approved: 6, spam: 1, trash: 1 },
  stats: [{ id: 'orders', label: 'Orders', value: '128', deltaPercent: 4.2 }],
  activity: [
    { month: 'Aug', visitors: 1200 },
    { month: 'Sep', visitors: 1450 },
  ],
}
