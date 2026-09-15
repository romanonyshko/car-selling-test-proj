export interface GlanceStats {
  posts: number
  reviews: number
  pages: number
}

export interface NewsItem {
  id: string
  title: string
  publishedAt: string
}

export interface ReviewItem {
  id: string
  author: string
  postTitle: string
  text: string
}

export interface RequestCounts {
  all: number
  pending: number
  approved: number
  spam: number
  trash: number
}

export interface StatCard {
  id: string
  label: string
  value: string
  deltaPercent?: number
}

export interface ActivityPoint {
  month: string
  visitors: number
}

export interface DashboardData {
  glance: GlanceStats
  latestNews: NewsItem
  latestReview: ReviewItem
  requests: RequestCounts
  stats: StatCard[]
  activity: ActivityPoint[]
}

export const dashboardMock: DashboardData = {
  glance: {
    posts: 2,
    reviews: 16,
    pages: 3,
  },

  latestNews: {
    id: 'season-sale',
    title: 'Season sale beginning!',
    publishedAt: '2026-03-05T17:00:00',
  },

  latestReview: {
    id: 'review-ketty',
    author: 'Ketty Richardson',
    postTitle: 'Season sale beginning!',
    text:
      'Rev up your savings with our season sale on car parts! Upgrade your ' +
      "ride without breaking the bank. Don't miss out on these hot deals to " +
      'keep your vehicle running smoothly and stylishly all year round!',
  },

  requests: {
    all: 1,
    pending: 0,
    approved: 1,
    spam: 0,
    trash: 0,
  },

  stats: [
    { id: 'time-on-website', label: 'Time on website', value: '14.7', deltaPercent: 2 },
    { id: 'visitors', label: 'Visitors', value: '620', deltaPercent: 10 },
    { id: 'categories', label: 'Categories', value: '400' },
    { id: 'comments', label: 'Comments', value: '12.1', deltaPercent: 8 },
    { id: 'covers', label: 'Covers', value: '340', deltaPercent: 20 },
    { id: 'articles', label: 'Articles', value: '120' },
  ],

  activity: [
    { month: 'Jan', visitors: 31000 },
    { month: 'Feb', visitors: 19000 },
    { month: 'Mar', visitors: 9000 },
    { month: 'Apr', visitors: 5000 },
    { month: 'May', visitors: 6000 },
    { month: 'Jun', visitors: 14000 },
    { month: 'Jul', visitors: 35000 },
    { month: 'Aug', visitors: 27000 },
    { month: 'Sep', visitors: 25000 },
  ],
}
