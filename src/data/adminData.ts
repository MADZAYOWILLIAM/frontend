import { api } from './api'

export const getAdminStats = async () => {
  const [users, events, blogs] = await Promise.all([
    api.auth.users(),
    api.events.list(),
    api.blogs.list(),
  ]);
  return [
    { label: 'Total users', value: String(users.length), icon: 'group', trend: 'Live count', tone: 'blue' },
    { label: 'Published events', value: String(events.length), icon: 'event_available', trend: 'Upcoming', tone: 'green' },
    { label: 'Blog posts', value: String(blogs.length), icon: 'article', trend: 'Active', tone: 'pink' },
    { label: 'System activity', value: 'Logs', icon: 'rate_review', trend: 'Audited', tone: 'amber' },
  ];
};

export const getAdminUsers = async () => {
  const users = await api.auth.users();
  return users.map(u => ({
    id: u.id,
    name: `${u.first_name} ${u.second_name}`,
    email: u.email,
    role: u.role || 'user',
    status: u.is_verified ? 'Active' : 'Unverified',
  }));
};

export const getAdminEvents = async () => {
  const events = await api.events.list();
  return events.map(e => ({
    id: e.id,
    name: e.title,
    date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    registrations: e.capacity,
    status: 'Published',
  }));
};

export const getAdminBlogs = async () => {
  const blogs = await api.blogs.list();
  return blogs.map(b => ({
    id: b.id || '',
    title: b.title,
    author: 'Staff',
    comments: b.comments?.length || 0,
    status: 'Published',
  }));
};
