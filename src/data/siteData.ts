import type { RoutePath } from '../types/navigation'
import heroImage from '../assets/hero.png'
import { api } from './api'

export const routes: RoutePath[] = ['/', '/about', '/event', '/blogs', '/blog', '/impact', '/contact', '/dashboard', '/admin', '/signin', '/signup', '/password-reset']

export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Event', path: '/event' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Impact', path: '/impact' },
] satisfies { label: string; path: RoutePath }[]

export const impactStats = [
  { value: '42k+', label: 'community members reached' },
  { value: '180', label: 'local events hosted' },
  { value: '24', label: 'active volunteer teams' },
]

export const impactFocus = [
  {
    category: 'Families',
    title: 'Families supported',
    text: 'Monthly care days connect households with food, clothing, school materials, and direct partner referrals.',
    metric: '1,240 households reached this year',
  },
  {
    category: 'Youth',
    title: 'Young leaders trained',
    text: 'Mentorship circles help students build practical skills, confidence, and a stronger path into work.',
    metric: '680 youth completed a workshop',
  },
  {
    category: 'Community',
    title: 'Volunteer teams mobilized',
    text: 'Local volunteers coordinate venues, outreach, mentorship support, and follow-up after each event.',
    metric: '24 active teams supporting events',
  },
]

export const impactGoals = [
  { label: 'Youth workshop attendance', value: 72, target: '1,000 attendees' },
  { label: 'Family support follow-ups', value: 64, target: '900 follow-ups' },
  { label: 'Volunteer retention', value: 81, target: '80% active volunteers' },
]

export const impactTimeline = [
  {
    period: 'Q1',
    title: 'Care days expanded',
    text: 'Monthly care days were added in two additional neighborhoods with stronger volunteer coordination.',
  },
  {
    period: 'Q2',
    title: 'Mentorship circles launched',
    text: 'Youth members joined structured mentor groups focused on career readiness and confidence building.',
  },
  {
    period: 'Q3',
    title: 'Follow-up system improved',
    text: 'Event teams started tracking next steps so support continues after each community gathering.',
  },
]

export const programCards = [
  {
    title: 'Community Events',
    text: 'Gatherings, workshops, and neighborhood activations designed around real local needs.',
    icon: 'groups',
  },
  {
    title: 'Youth Mentorship',
    text: 'Structured programs that connect young leaders with practical guidance and opportunity.',
    icon: 'school',
  },
  {
    title: 'Resource Drives',
    text: 'Fast, coordinated support for food, clothing, learning materials, and emergency essentials.',
    icon: 'volunteer_activism',
  },
]

export const joinBenefits = [
  {
    title: 'Expert Led',
    text: 'Our programs are designed and delivered by industry experts.',
    icon: 'shield',
  },
  {
    title: 'Career Growth',
    text: 'We provide tools and connections to accelerate your career.',
    icon: 'trending_up',
  },
  {
    title: 'Global Network',
    text: 'Connect with a global community of like-minded individuals.',
    icon: 'language',
  },
]

export const testimonials = [
  {
    name: 'John Doe',
    role: 'Youth Member',
    quote: 'This platform transformed my life. The mentorship I received was top-notch!',
    avatar: 'JD',
  },
  {
    name: 'Jane Smith',
    role: 'Mentor',
    quote: 'Being a mentor here is incredibly rewarding. Seeing the growth in these young people is amazing.',
    avatar: 'JS',
  },
]

export const faqs = [
  {
    question: 'Who can join Foundation Inc?',
    answer: 'Youth members, mentors, volunteers, and partners who want to support practical community programs can join.',
  },
  {
    question: 'Do I need experience to volunteer?',
    answer: 'No. We help new volunteers find roles that match their availability, interests, and comfort level.',
  },
  {
    question: 'How do I attend an event?',
    answer: 'Create an account or visit the events page to see upcoming gatherings and connect with the team.',
  },
  {
    question: 'Can organizations partner with you?',
    answer: 'Yes. Sponsors and local organizations can support programs through venues, resources, mentorship, or funding.',
  },
]

export const getUpcomingEvents = async () => {
  const events = await api.events.list({ limit: 3 });
  return events.map(e => ({
    id: e.id,
    date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    name: e.title,
    location: e.location,
    detail: e.description,
    image: e.image_url || heroImage,
    imageAlt: e.title,
  }));
};

export const getBlogPosts = async () => {
  const blogs = await api.blogs.list();
  return blogs.map(b => ({
    id: b.id || '',
    category: 'Updates',
    title: b.title,
    excerpt: b.description.slice(0, 100) + '...',
    image: b.image_url || heroImage,
    imageAlt: b.title,
    content: [b.description],
    readTime: '5 min read',
    likes: 0,
    comments: b.comments?.map(c => c.content) || [],
  }));
};
