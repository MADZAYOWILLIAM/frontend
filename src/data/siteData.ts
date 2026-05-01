import type { RoutePath } from '../types/navigation'
import heroImage from '../assets/hero.png'

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

export const upcomingEvents = [
  {
    date: 'May 18',
    name: 'Neighborhood Care Day',
    location: 'Central Community Hall',
    detail: 'Food support, family services, and volunteer-led home essentials distribution.',
    image: heroImage,
    imageAlt: 'Youth community members gathered during a local support event',
  },
  {
    date: 'Jun 02',
    name: 'Youth Skills Workshop',
    location: 'Foundation Learning Studio',
    detail: 'Hands-on mentorship for career readiness, communication, and digital confidence.',
    image: heroImage,
    imageAlt: 'Young people taking part in a skills and mentorship workshop',
  },
  {
    date: 'Jun 21',
    name: 'Partner Impact Breakfast',
    location: 'Riverside Garden Venue',
    detail: 'A working session for sponsors, local leaders, and program coordinators.',
    image: heroImage,
    imageAlt: 'Community members connecting at an Empoweredge event',
  },
]

export const blogPosts = [
  {
    id: 'community-support-systems',
    category: 'Community',
    title: 'How local events become long-term support systems',
    excerpt: 'A practical look at how volunteer follow-up, partner referrals, and neighborhood trust keep momentum alive.',
    image: heroImage,
    imageAlt: 'Community members joining a local Empoweredge gathering',
    content: [
      'Local events create the strongest results when they are treated as a starting point, not a finish line. The gathering gives people a place to be seen, but the follow-up is what turns one day of support into an ongoing relationship.',
      'Our strongest programs pair practical help with clear next steps. Volunteers capture needs, partners share referrals, and community leads check in after the event so families know where to go next.',
      'That structure helps trust grow over time. When people see familiar faces returning with useful support, they are more likely to ask for help early and participate in the next opportunity.',
    ],
    readTime: '5 min read',
    likes: 18,
    comments: [
      'The follow-up piece is what makes events feel meaningful.',
      'I would love to see more partner referral examples.',
    ],
  },
  {
    id: 'youth-workshop-followup',
    category: 'Youth',
    title: 'What young leaders need after the first workshop',
    excerpt: 'Mentorship works best when learning is paired with repeat check-ins and clear next steps.',
    image: heroImage,
    imageAlt: 'Youth members learning together during a workshop',
    content: [
      'A first workshop can spark confidence, but young leaders need repeated practice to turn that confidence into real progress. Mentorship is most useful when it continues after the room clears.',
      'Short check-ins, practical assignments, and peer encouragement help participants apply what they learned. That rhythm makes growth visible and keeps momentum from fading.',
      'The goal is not to overwhelm young people with theory. It is to give them steady access to guidance, honest feedback, and opportunities to try again.',
    ],
    readTime: '4 min read',
    likes: 24,
    comments: ['Consistency after the workshop is so important.'],
  },
  {
    id: 'dignified-resource-drives',
    category: 'Partners',
    title: 'Designing resource drives that protect dignity',
    excerpt: 'Good planning makes support easier to access, simpler to coordinate, and more respectful for families.',
    image: heroImage,
    imageAlt: 'Volunteers preparing support for a community resource drive',
    content: [
      'Resource drives work best when they are organized around dignity. Families should know what support is available, how to access it, and what information is needed before they arrive.',
      'Clear intake, thoughtful distribution, and private conversations reduce confusion and help people feel respected. Good logistics are not just operational details; they shape the emotional experience of receiving help.',
      'Partners can strengthen this process by sharing accurate information, preparing volunteers, and making sure support continues beyond the distribution table.',
    ],
    readTime: '6 min read',
    likes: 15,
    comments: ['This is a helpful reminder for volunteer teams.'],
  },
]
