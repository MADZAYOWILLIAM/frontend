export const adminStats = [
  { label: 'Total users', value: '1,284', icon: 'group', trend: '+34 this month', tone: 'blue' },
  { label: 'Published events', value: '18', icon: 'event_available', trend: '5 upcoming', tone: 'green' },
  { label: 'Blog posts', value: '32', icon: 'article', trend: '4 drafts', tone: 'pink' },
  { label: 'Pending reviews', value: '11', icon: 'rate_review', trend: 'Needs action', tone: 'amber' },
]

export const adminUsers = [
  { id: 'u-001', name: 'Amina Hassan', email: 'amina@example.com', role: 'Mentor', status: 'Active' },
  { id: 'u-002', name: 'Brian Mwangi', email: 'brian@example.com', role: 'Youth Member', status: 'Active' },
  { id: 'u-003', name: 'Grace Achieng', email: 'grace@example.com', role: 'Volunteer', status: 'Suspended' },
  { id: 'u-004', name: 'David Otieno', email: 'david@example.com', role: 'Youth Member', status: 'Active' },
]

export const adminEvents = [
  { id: 'e-001', name: 'Neighborhood Care Day', date: 'May 18', registrations: 84, status: 'Published' },
  { id: 'e-002', name: 'Youth Skills Workshop', date: 'Jun 02', registrations: 42, status: 'Published' },
  { id: 'e-003', name: 'Mentor Orientation', date: 'Jun 10', registrations: 18, status: 'Draft' },
]

export const adminBlogs = [
  { id: 'b-001', title: 'How local events become long-term support systems', author: 'Admin Team', comments: 3, status: 'Published' },
  { id: 'b-002', title: 'What young leaders need after the first workshop', author: 'Mentor Desk', comments: 1, status: 'Published' },
  { id: 'b-003', title: 'Volunteer stories from the field', author: 'Admin Team', comments: 0, status: 'Draft' },
]

export const adminComments = [
  { id: 'c-001', author: 'John Doe', post: 'How local events become long-term support systems', text: 'The follow-up piece is what makes events feel meaningful.', status: 'Pending' },
  { id: 'c-002', author: 'Jane Smith', post: 'What young leaders need after the first workshop', text: 'Consistency after the workshop is so important.', status: 'Approved' },
  { id: 'c-003', author: 'Mary Wanjiku', post: 'Volunteer stories from the field', text: 'I would like to volunteer next month.', status: 'Pending' },
]

export const adminMessages = [
  { id: 'm-001', sender: 'Kevin N.', subject: 'Volunteer availability', status: 'Unread' },
  { id: 'm-002', sender: 'Sarah K.', subject: 'Mentorship request', status: 'Read' },
  { id: 'm-003', sender: 'Community Hall', subject: 'Venue confirmation', status: 'Unread' },
]
