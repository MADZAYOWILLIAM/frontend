import type { RoutePath } from '../types/navigation'
import { api } from './api'

export const getDashboardStats = async () => {
  const data = await api.auth.myEvents();
  return [
    { label: 'Events joined', value: String(data.joined_events.length), icon: 'event_available', trend: 'Active', tone: 'blue' },
    { label: 'Mentorship', value: 'Enabled', icon: 'school', trend: 'Program active', tone: 'green' },
    { label: 'Profile status', value: data.is_verified ? 'Verified' : 'Pending', icon: 'task_alt', trend: 'Security', tone: 'amber' },
  ];
};

export const getDashboardEvents = async () => {
  const [events, memberData] = await Promise.all([
    api.events.list(),
    api.auth.myEvents(),
  ]);
  const joinedEventIds = new Set(memberData.joined_events.map((event) => event.id));

  return events.map(e => ({
    id: e.id,
    date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    time: '9:00 AM',
    name: e.title,
    status: joinedEventIds.has(e.id) ? 'Registered' : 'Open',
    location: e.location,
    owner: 'Foundation Team',
  }));
};

export const getDashboardActivity = async () => {
  const logs = await api.logs.list({ limit: 5 });
  return logs.map(l => ({
    title: l.action,
    time: new Date(l.timestamp).toLocaleTimeString(),
  }));
};

export const dashboardTasks = [
  { label: 'Complete volunteer profile', done: true },
  { label: 'Upload profile picture', done: false },
]

export const dashboardMentorship = [
  { mentor: 'Grace Wanjiku', focus: 'Career readiness', nextSession: 'Jun 04', progress: 68 },
  { mentor: 'Brian Otieno', focus: 'Community leadership', nextSession: 'Jun 11', progress: 42 },
]

export const dashboardNotifications = [
  'Your profile is ready for review.',
  'A new mentorship session is available.',
  'Remember to confirm your next event attendance.',
]

export const dashboardSettings = [
  { label: 'Email reminders', enabled: true },
  { label: 'SMS event alerts', enabled: false },
  { label: 'Mentorship updates', enabled: true },
]

export const dashboardQuickActions = [
  { label: 'Register for event', icon: 'event_available', path: '/event' },
  { label: 'Read latest blog', icon: 'article', path: '/blogs' },
  { label: 'Contact team', icon: 'support_agent', path: '/contact' },
] satisfies { label: string; icon: string; path: RoutePath }[]

export const getDashboardBlogMetrics = async () => {
  const blogs = await api.blogs.list({ limit: 3 });
  return blogs.map(b => ({
    title: b.title,
    likes: 0,
    comments: b.comments?.length || 0,
    status: 'Latest',
  }));
};
