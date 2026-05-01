import type { RoutePath } from '../types/navigation'

export const dashboardStats = [
  { label: 'Events joined', value: '8', icon: 'event_available', trend: '+2 this month', tone: 'blue' },
  { label: 'Mentorship hours', value: '24', icon: 'school', trend: '+6 this month', tone: 'green' },
  { label: 'Blog interactions', value: '47', icon: 'favorite', trend: '12 comments', tone: 'pink' },
  { label: 'Tasks completed', value: '1', icon: 'task_alt', trend: 'Profile progress', tone: 'amber' },
]

export const dashboardEvents = [
  { id: 'care-day', date: 'May 18', time: '9:00 AM', name: 'Neighborhood Care Day', status: 'Registered', location: 'Central Community Hall', owner: 'Volunteer Team' },
  { id: 'skills-workshop', date: 'Jun 02', time: '2:00 PM', name: 'Youth Skills Workshop', status: 'Open', location: 'Foundation Learning Studio', owner: 'Mentor Desk' },
]

export const dashboardActivity = [
  { title: 'You commented on a mentorship article', time: 'Today, 9:20 AM' },
  { title: 'New event registration confirmed', time: 'Yesterday, 4:10 PM' },
  { title: 'Volunteer checklist updated', time: 'Apr 29, 2:45 PM' },
]

export const dashboardTasks = [
  { label: 'Complete volunteer profile', done: true },
  { label: 'Confirm availability for Care Day', done: false },
  { label: 'Review youth workshop materials', done: false },
]

export const dashboardQuickActions = [
  { label: 'Register for event', icon: 'event_available', path: '/event' },
  { label: 'Read latest blog', icon: 'article', path: '/blogs' },
  { label: 'Contact team', icon: 'support_agent', path: '/contact' },
] satisfies { label: string; icon: string; path: RoutePath }[]

export const dashboardMentorship = [
  { mentor: 'Grace Achieng', focus: 'Career planning', nextSession: 'May 09, 3:00 PM', progress: 68 },
  { mentor: 'Brian Mwangi', focus: 'Public speaking', nextSession: 'May 14, 11:00 AM', progress: 52 },
  { mentor: 'Amina Hassan', focus: 'Digital skills', nextSession: 'May 22, 2:30 PM', progress: 81 },
]

export const dashboardBlogMetrics = [
  { title: 'How local events become long-term support systems', likes: 19, comments: 3, status: 'Read' },
  { title: 'What young leaders need after the first workshop', likes: 24, comments: 1, status: 'Saved' },
  { title: 'Designing resource drives that protect dignity', likes: 15, comments: 1, status: 'New' },
]

export const dashboardNotifications = [
  'Youth Skills Workshop registration closes tomorrow.',
  'Your mentor shared new preparation notes.',
]

export const dashboardSettings = [
  { label: 'Email event reminders', enabled: true },
  { label: 'Show my profile to mentors', enabled: true },
  { label: 'Weekly progress summary', enabled: false },
]
