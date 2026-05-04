import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useMemo, useState } from 'react'
import { adminBlogs, adminComments, adminEvents, adminMessages, adminStats, adminUsers } from '../data/adminData'
import { usePersistentState } from '../hooks/usePersistentState'
type AdminDashboardPageProps = {
  onSignOut: () => void
}

type AdminTab = 'Overview' | 'Users' | 'Events' | 'Blogs' | 'Comments' | 'Messages' | 'AI Assistant' | 'Settings'
type AdminChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

const adminTabs = [
  { label: 'Overview', icon: 'space_dashboard' },
  { label: 'Users', icon: 'group' },
  { label: 'Events', icon: 'event' },
  { label: 'Blogs', icon: 'article' },
  { label: 'Comments', icon: 'rate_review' },
  { label: 'Messages', icon: 'mail' },
  { label: 'AI Assistant', icon: 'auto_awesome' },
  { label: 'Settings', icon: 'settings' },
] satisfies { label: AdminTab; icon: string }[]

function AdminDashboardPage({ onSignOut }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = usePersistentState<AdminTab>('empoweredge-admin-active-tab', 'Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [users, setUsers] = usePersistentState('empoweredge-admin-users', adminUsers)
  const [events, setEvents] = usePersistentState('empoweredge-admin-events', adminEvents)
  const [blogs, setBlogs] = usePersistentState('empoweredge-admin-blogs', adminBlogs)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [adminChatDraft, setAdminChatDraft] = useState('')
  const [adminChatMessageCount, setAdminChatMessageCount] = useState(1)
  const [adminChatMessages, setAdminChatMessages] = useState<AdminChatMessage[]>([
    {
      id: 'admin-welcome',
      role: 'assistant',
      text: 'Hi Admin. Ask me about pending reviews, unread messages, event performance, draft content, or user status.',
    },
  ])
  const [eventDraft, setEventDraft] = useState({ name: '', date: '', registrations: '0', status: 'Draft', image: '' })
  const [blogDraft, setBlogDraft] = useState({ title: '', author: 'Admin Team', status: 'Draft', image: '' })
  const [comments, setComments] = usePersistentState('empoweredge-admin-comments', adminComments)
  const [messages, setMessages] = usePersistentState('empoweredge-admin-messages', adminMessages)
  const [siteSettings, setSiteSettings] = usePersistentState('empoweredge-admin-settings', {
    siteName: 'Empoweredge Youth Club',
    contactEmail: 'empoweredgeyouthsclub@gmail.com',
    publishModeration: true,
  })

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredUsers = useMemo(
    () => users.filter((user) => Object.values(user).join(' ').toLowerCase().includes(normalizedSearch)),
    [normalizedSearch, users],
  )
  const filteredEvents = events.filter((event) => Object.values(event).join(' ').toLowerCase().includes(normalizedSearch))
  const filteredBlogs = blogs.filter((blog) => Object.values(blog).join(' ').toLowerCase().includes(normalizedSearch))
  const filteredComments = comments.filter((comment) => Object.values(comment).join(' ').toLowerCase().includes(normalizedSearch))
  const filteredMessages = messages.filter((message) => Object.values(message).join(' ').toLowerCase().includes(normalizedSearch))

  const setTab = (tab: AdminTab) => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const readImageFile = (file: File, onLoad: (image: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onLoad(reader.result)
      }
    })
    reader.readAsDataURL(file)
  }

  const createEvent = () => {
    if (!eventDraft.name.trim() || !eventDraft.date.trim()) {
      return
    }

    setEvents((current) => [
      ...current,
      {
        id: `e-${Date.now()}`,
        name: eventDraft.name.trim(),
        date: eventDraft.date.trim(),
        registrations: Number(eventDraft.registrations) || 0,
        status: eventDraft.status,
        image: eventDraft.image,
      },
    ])
    setEventDraft({ name: '', date: '', registrations: '0', status: 'Draft', image: '' })
    setShowEventForm(false)
    setSearchTerm('')
    showToast('Event created.')
  }

  const createBlog = () => {
    if (!blogDraft.title.trim() || !blogDraft.author.trim()) {
      return
    }

    setBlogs((current) => [
      ...current,
      {
        id: `b-${Date.now()}`,
        title: blogDraft.title.trim(),
        author: blogDraft.author.trim(),
        comments: 0,
        status: blogDraft.status,
        image: blogDraft.image,
      },
    ])
    setBlogDraft({ title: '', author: 'Admin Team', status: 'Draft', image: '' })
    setShowBlogForm(false)
    setSearchTerm('')
    showToast('Blog post created.')
  }

  return (
    <section className={isSidebarOpen ? 'admin-page sidebar-open' : 'admin-page'} aria-labelledby="admin-title">
      {isSidebarOpen && (
        <button className="dashboard-overlay" type="button" aria-label="Close admin menu" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className="dashboard-sidebar admin-sidebar" aria-label="Admin navigation">
        <div className="dashboard-sidebar-top">
          <div className="dashboard-brand">
            <span className="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
            <div>
              <strong>Admin Console</strong>
              <small>Empoweredge</small>
            </div>
          </div>
          <button className="sidebar-toggle" type="button" aria-label="Close sidebar" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="dashboard-profile">
          <span className="dashboard-avatar">AD</span>
          <div>
            <strong>Admin User</strong>
            <span>Platform Admin</span>
          </div>
        </div>
        <nav className="dashboard-menu">
          {adminTabs.map((item) => (
            <button className={item.label === activeTab ? 'active' : undefined} type="button" key={item.label} onClick={() => setTab(item.label)}>
              <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="logout-button" type="button" onClick={onSignOut}>
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        {toast && <div className="toast-message" role="status">{toast}</div>}
        <header className="dashboard-topbar">
          <button className="dashboard-menu-button" type="button" aria-label="Open admin menu" onClick={() => setIsSidebarOpen(true)}>
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </button>
          <div className="dashboard-search">
            <span className="material-symbols-outlined" aria-hidden="true">search</span>
            <input aria-label="Search admin dashboard" placeholder="Search users, events, blogs..." type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <div className="dashboard-topbar-actions">
            <button type="button" aria-label="Create item" onClick={() => setTab('Events')}>
              <span className="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
            <button type="button" aria-label="Admin settings" onClick={() => setTab('Settings')}>
              <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            </button>
          </div>
        </header>

        <section className="dashboard-hero-panel admin-hero">
          <div>
            <p>{activeTab}</p>
            <h1 id="admin-title">Admin dashboard</h1>
            <span>Manage users, events, blog posts, comments, messages, and platform settings.</span>
          </div>
          <button className="primary-button" type="button" onClick={() => setTab('Events')}>Create event</button>
        </section>

        {activeTab === 'Overview' && (
          <>
            <div className="dashboard-stats" aria-label="Admin statistics">
              {adminStats.map((stat) => (
                <article className={`dashboard-stat-card ${stat.tone}`} key={stat.label}>
                  <span className="material-symbols-outlined" aria-hidden="true">{stat.icon}</span>
                  <div>
                    <strong>{stat.value}</strong>
                    <p>{stat.label}</p>
                    <small>{stat.trend}</small>
                  </div>
                </article>
              ))}
            </div>

            <div className="admin-overview-grid">
              <AdminTable title="Recent users" columns={['Name', 'Email', 'Role', 'Status']} rows={filteredUsers.slice(0, 4).map((user) => [user.name, user.email, user.role, user.status])} />
              <AdminTable title="Upcoming events" columns={['Event', 'Date', 'Registrations', 'Status']} rows={filteredEvents.map((event) => [event.name, event.date, String(event.registrations), event.status])} />
              <AdminTable title="Review queue" columns={['Author', 'Post', 'Status']} rows={filteredComments.map((comment) => [comment.author, comment.post, comment.status])} />
            </div>
          </>
        )}

        {activeTab === 'Users' && (
          <AdminTable
            title="User management"
            columns={['Name', 'Email', 'Role', 'Status', 'Action', 'Edit']}
            rows={filteredUsers.map((user) => [
              user.name,
              user.email,
              user.role,
              user.status,
              <button className="table-action-button" type="button" onClick={() => {
                setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: item.status === 'Active' ? 'Suspended' : 'Active' } : item))
                showToast('User status updated.')
              }}>
                {user.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>,
              <button className="table-action-button" type="button" onClick={() => {
                const nextRole = window.prompt('Update user role', user.role)
                if (nextRole) {
                  setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: nextRole } : item))
                  showToast('User role updated.')
                }
              }}>
                Edit
              </button>,
            ])}
            emptyMessage="No users match your search."
          />
        )}

        {activeTab === 'Events' && (
          <>
            {showEventForm && (
              <section className="dashboard-panel admin-create-panel">
                <div className="dashboard-panel-heading">
                  <h2>Create event</h2>
                  <button className="text-button" type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
                </div>
                <form
                  className="admin-create-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    createEvent()
                  }}
                >
                  <label>
                    Event name
                    <input value={eventDraft.name} onChange={(event) => setEventDraft((current) => ({ ...current, name: event.target.value }))} />
                  </label>
                  <label>
                    Date
                    <input value={eventDraft.date} placeholder="Jul 05" onChange={(event) => setEventDraft((current) => ({ ...current, date: event.target.value }))} />
                  </label>
                  <label>
                    Registrations
                    <input min="0" type="number" value={eventDraft.registrations} onChange={(event) => setEventDraft((current) => ({ ...current, registrations: event.target.value }))} />
                  </label>
                  <label>
                    Status
                    <select value={eventDraft.status} onChange={(event) => setEventDraft((current) => ({ ...current, status: event.target.value }))}>
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </label>
                  <label className="admin-image-upload">
                    Event image
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0]

                        if (file) {
                          readImageFile(file, (image) => setEventDraft((current) => ({ ...current, image })))
                        }
                      }}
                    />
                    {eventDraft.image && <img src={eventDraft.image} alt="Event preview" />}
                  </label>
                  <button className="primary-button compact-button" type="submit">Create event</button>
                </form>
              </section>
            )}
            <AdminTable
              title="Event management"
              action={<button className="primary-button compact-button" type="button" onClick={() => setShowEventForm(true)}>New event</button>}
              columns={['Image', 'Event', 'Date', 'Registrations', 'Status', 'Action', 'Edit', 'Delete']}
              rows={filteredEvents.map((event) => [
                <AdminImagePreview image={getAdminImage(event)} label={event.name} />,
                event.name,
                event.date,
                String(event.registrations),
                event.status,
                <button className="table-action-button" type="button" onClick={() => {
                  setEvents((current) => current.map((item) => item.id === event.id ? { ...item, status: item.status === 'Published' ? 'Draft' : 'Published' } : item))
                  showToast('Event status updated.')
                }}>
                  {event.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>,
                <button className="table-action-button" type="button" onClick={() => {
                  const nextName = window.prompt('Update event name', event.name)
                  if (nextName) {
                    setEvents((current) => current.map((item) => item.id === event.id ? { ...item, name: nextName } : item))
                    showToast('Event updated.')
                  }
                }}>Edit</button>,
                <button className="table-action-button danger-inline" type="button" onClick={() => {
                  if (window.confirm(`Delete ${event.name}?`)) {
                    setEvents((current) => current.filter((item) => item.id !== event.id))
                    showToast('Event deleted.')
                  }
                }}>Delete</button>,
              ])}
              emptyMessage="No events match your search."
            />
          </>
        )}

        {activeTab === 'Blogs' && (
          <>
            {showBlogForm && (
              <section className="dashboard-panel admin-create-panel">
                <div className="dashboard-panel-heading">
                  <h2>Create blog post</h2>
                  <button className="text-button" type="button" onClick={() => setShowBlogForm(false)}>Cancel</button>
                </div>
                <form
                  className="admin-create-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    createBlog()
                  }}
                >
                  <label>
                    Title
                    <input value={blogDraft.title} onChange={(event) => setBlogDraft((current) => ({ ...current, title: event.target.value }))} />
                  </label>
                  <label>
                    Author
                    <input value={blogDraft.author} onChange={(event) => setBlogDraft((current) => ({ ...current, author: event.target.value }))} />
                  </label>
                  <label>
                    Status
                    <select value={blogDraft.status} onChange={(event) => setBlogDraft((current) => ({ ...current, status: event.target.value }))}>
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </label>
                  <label className="admin-image-upload">
                    Blog image
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0]

                        if (file) {
                          readImageFile(file, (image) => setBlogDraft((current) => ({ ...current, image })))
                        }
                      }}
                    />
                    {blogDraft.image && <img src={blogDraft.image} alt="Blog preview" />}
                  </label>
                  <button className="primary-button compact-button" type="submit">Create post</button>
                </form>
              </section>
            )}
            <AdminTable
              title="Blog management"
              action={<button className="primary-button compact-button" type="button" onClick={() => setShowBlogForm(true)}>New post</button>}
              columns={['Image', 'Title', 'Author', 'Comments', 'Status', 'Action', 'Edit', 'Delete']}
              rows={filteredBlogs.map((blog) => [
                <AdminImagePreview image={getAdminImage(blog)} label={blog.title} />,
                blog.title,
                blog.author,
                String(blog.comments),
                blog.status,
                <button className="table-action-button" type="button" onClick={() => {
                  setBlogs((current) => current.map((item) => item.id === blog.id ? { ...item, status: item.status === 'Published' ? 'Draft' : 'Published' } : item))
                  showToast('Blog status updated.')
                }}>
                  {blog.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>,
                <button className="table-action-button" type="button" onClick={() => {
                  const nextTitle = window.prompt('Update blog title', blog.title)
                  if (nextTitle) {
                    setBlogs((current) => current.map((item) => item.id === blog.id ? { ...item, title: nextTitle } : item))
                    showToast('Blog post updated.')
                  }
                }}>Edit</button>,
                <button className="table-action-button danger-inline" type="button" onClick={() => {
                  if (window.confirm(`Delete ${blog.title}?`)) {
                    setBlogs((current) => current.filter((item) => item.id !== blog.id))
                    showToast('Blog post deleted.')
                  }
                }}>Delete</button>,
              ])}
              emptyMessage="No blog posts match your search."
            />
          </>
        )}

        {activeTab === 'Comments' && (
          <AdminTable
            title="Comment moderation"
            columns={['Author', 'Post', 'Comment', 'Status', 'Action', 'Delete']}
            rows={filteredComments.map((comment) => [
              comment.author,
              comment.post,
              comment.text,
              comment.status,
              <button className="table-action-button" type="button" onClick={() => {
                setComments((current) => current.map((item) => item.id === comment.id ? { ...item, status: item.status === 'Approved' ? 'Pending' : 'Approved' } : item))
                showToast('Comment moderation updated.')
              }}>
                {comment.status === 'Approved' ? 'Unapprove' : 'Approve'}
              </button>,
              <button className="table-action-button danger-inline" type="button" onClick={() => {
                if (window.confirm('Delete this comment?')) {
                  setComments((current) => current.filter((item) => item.id !== comment.id))
                  showToast('Comment deleted.')
                }
              }}>Delete</button>,
            ])}
            emptyMessage="No comments match your search."
          />
        )}

        {activeTab === 'Messages' && (
          <AdminTable
            title="Contact messages"
            columns={['Sender', 'Subject', 'Status', 'Action', 'Delete']}
            rows={filteredMessages.map((message) => [
              message.sender,
              message.subject,
              message.status,
              <button className="table-action-button" type="button" onClick={() => {
                setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: item.status === 'Read' ? 'Unread' : 'Read' } : item))
                showToast('Message status updated.')
              }}>
                Mark {message.status === 'Read' ? 'unread' : 'read'}
              </button>,
              <button className="table-action-button danger-inline" type="button" onClick={() => {
                if (window.confirm(`Delete message from ${message.sender}?`)) {
                  setMessages((current) => current.filter((item) => item.id !== message.id))
                  showToast('Message deleted.')
                }
              }}>Delete</button>,
            ])}
            emptyMessage="No messages match your search."
          />
        )}

        {activeTab === 'AI Assistant' && (
          <AdminAiAssistant
            blogs={filteredBlogs}
            chatDraft={adminChatDraft}
            chatMessageCount={adminChatMessageCount}
            chatMessages={adminChatMessages}
            comments={filteredComments}
            events={filteredEvents}
            messages={filteredMessages}
            setChatDraft={setAdminChatDraft}
            setChatMessageCount={setAdminChatMessageCount}
            setChatMessages={setAdminChatMessages}
            users={filteredUsers}
          />
        )}

        {activeTab === 'Settings' && (
          <section className="dashboard-panel dashboard-wide-panel">
            <div className="dashboard-panel-heading">
              <div>
                <h2>Platform settings</h2>
                <p>Manage site identity and moderation defaults</p>
              </div>
            </div>
            <form className="dashboard-profile-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Site name
                <input value={siteSettings.siteName} onChange={(event) => setSiteSettings((current) => ({ ...current, siteName: event.target.value }))} />
              </label>
              <label>
                Contact email
                <input type="email" value={siteSettings.contactEmail} onChange={(event) => setSiteSettings((current) => ({ ...current, contactEmail: event.target.value }))} />
              </label>
              <label className="dashboard-setting admin-setting-toggle">
                <span>Require comment moderation</span>
                <input type="checkbox" checked={siteSettings.publishModeration} onChange={() => setSiteSettings((current) => ({ ...current, publishModeration: !current.publishModeration }))} />
              </label>
            </form>
          </section>
        )}
      </div>
    </section>
  )
}

type AdminTableProps = {
  title: string
  columns: string[]
  rows: Array<Array<ReactNode>>
  action?: ReactNode
  emptyMessage?: string
}

type AdminAiAssistantProps = {
  blogs: typeof adminBlogs
  chatDraft: string
  chatMessageCount: number
  chatMessages: AdminChatMessage[]
  comments: typeof adminComments
  events: typeof adminEvents
  messages: typeof adminMessages
  setChatDraft: Dispatch<SetStateAction<string>>
  setChatMessageCount: Dispatch<SetStateAction<number>>
  setChatMessages: Dispatch<SetStateAction<AdminChatMessage[]>>
  users: typeof adminUsers
}

function AdminAiAssistant({
  blogs,
  chatDraft,
  chatMessageCount,
  chatMessages,
  comments,
  events,
  messages,
  setChatDraft,
  setChatMessageCount,
  setChatMessages,
  users,
}: AdminAiAssistantProps) {
  const sendMessage = (message: string) => {
    const prompt = message.trim()

    if (!prompt) {
      return
    }

    const userMessage: AdminChatMessage = {
      id: `admin-user-${chatMessageCount}`,
      role: 'user',
      text: prompt,
    }
    const assistantMessage: AdminChatMessage = {
      id: `admin-assistant-${chatMessageCount}`,
      role: 'assistant',
      text: buildAdminChatbotReply(prompt, { blogs, comments, events, messages, users }),
    }

    setChatMessages((current) => [...current, userMessage, assistantMessage])
    setChatMessageCount((current) => current + 1)
    setChatDraft('')
  }

  return (
    <section className="dashboard-panel dashboard-wide-panel ai-coach-panel" aria-labelledby="admin-ai-title">
      <div className="dashboard-panel-heading">
        <div>
          <h2 id="admin-ai-title">AI Assistant</h2>
          <p>Chat with an admin operations assistant</p>
        </div>
      </div>
      <div className="ai-coach-layout">
        <div className="ai-chat-shell admin-ai-chat">
          <div className="ai-chat-header">
            <span className="material-symbols-outlined" aria-hidden="true">admin_panel_settings</span>
            <div>
              <h3>Admin Assistant</h3>
              <p>online</p>
            </div>
          </div>
          <div className="ai-chat-messages" aria-live="polite">
            {chatMessages.map((message) => (
              <article className={`ai-chat-message ${message.role}`} key={message.id}>
                <p>{message.text}</p>
              </article>
            ))}
          </div>
          <div className="ai-chat-suggestions" aria-label="Suggested admin questions">
            {['What needs review?', 'Summarize unread messages', 'Which event needs attention?'].map((question) => (
              <button key={question} type="button" onClick={() => sendMessage(question)}>
                {question}
              </button>
            ))}
          </div>
          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(chatDraft)
            }}
          >
            <input
              aria-label="Message admin AI assistant"
              placeholder="Ask admin assistant..."
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
            />
            <button type="submit" aria-label="Send message">
              <span className="material-symbols-outlined" aria-hidden="true">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function buildAdminChatbotReply(
  prompt: string,
  context: {
    blogs: typeof adminBlogs
    comments: typeof adminComments
    events: typeof adminEvents
    messages: typeof adminMessages
    users: typeof adminUsers
  },
) {
  const normalizedPrompt = prompt.toLowerCase()
  const pendingComments = context.comments.filter((comment) => comment.status === 'Pending')
  const unreadMessages = context.messages.filter((message) => message.status === 'Unread')
  const draftEvents = context.events.filter((event) => event.status === 'Draft')
  const draftBlogs = context.blogs.filter((blog) => blog.status === 'Draft')
  const suspendedUsers = context.users.filter((user) => user.status === 'Suspended')
  const highestRegistrationEvent = [...context.events].sort((first, second) => second.registrations - first.registrations)[0]

  if (normalizedPrompt.includes('review') || normalizedPrompt.includes('comment') || normalizedPrompt.includes('moderation')) {
    return pendingComments.length > 0
      ? `${pendingComments.length} comment${pendingComments.length === 1 ? '' : 's'} need review. Start with ${pendingComments[0].author}'s comment on "${pendingComments[0].post}".`
      : 'There are no pending comments in the current review queue.'
  }

  if (normalizedPrompt.includes('message') || normalizedPrompt.includes('inbox') || normalizedPrompt.includes('unread')) {
    return unreadMessages.length > 0
      ? `${unreadMessages.length} message${unreadMessages.length === 1 ? '' : 's'} are unread. The first one is from ${unreadMessages[0].sender} about "${unreadMessages[0].subject}".`
      : 'All contact messages are marked as read.'
  }

  if (normalizedPrompt.includes('event') || normalizedPrompt.includes('registration')) {
    return highestRegistrationEvent
      ? `${highestRegistrationEvent.name} has the most registrations at ${highestRegistrationEvent.registrations}. You also have ${draftEvents.length} draft event${draftEvents.length === 1 ? '' : 's'} that may need publishing.`
      : 'There are no events in the current admin view.'
  }

  if (normalizedPrompt.includes('blog') || normalizedPrompt.includes('post') || normalizedPrompt.includes('content')) {
    return draftBlogs.length > 0
      ? `${draftBlogs.length} blog post${draftBlogs.length === 1 ? '' : 's'} are still drafts. Review "${draftBlogs[0].title}" first.`
      : 'All visible blog posts are published.'
  }

  if (normalizedPrompt.includes('user') || normalizedPrompt.includes('member')) {
    return suspendedUsers.length > 0
      ? `${suspendedUsers.length} user${suspendedUsers.length === 1 ? '' : 's'} are suspended. Review ${suspendedUsers[0].name}'s account if this needs follow-up.`
      : `There are ${context.users.length} users in the current view and none are suspended.`
  }

  return `Current priorities: ${pendingComments.length} pending reviews, ${unreadMessages.length} unread messages, ${draftEvents.length} draft events, and ${draftBlogs.length} draft blog posts.`
}

function AdminImagePreview({ image, label }: { image?: string; label: string }) {
  return image ? (
    <img className="admin-table-image" src={image} alt={`${label} preview`} />
  ) : (
    <span className="admin-image-placeholder">No image</span>
  )
}

function getAdminImage(record: object) {
  return 'image' in record && typeof record.image === 'string' ? record.image : ''
}

function AdminTable({ title, columns, rows, action, emptyMessage = 'No records found.' }: AdminTableProps) {
  return (
    <section className="dashboard-panel admin-table-panel">
      <div className="dashboard-panel-heading">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="admin-table">
        <div className="admin-table-row admin-table-head" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(140px, 1fr))` }}>
          {columns.map((column) => <span key={column}>{column}</span>)}
        </div>
        {rows.map((row, index) => (
          <div className="admin-table-row" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(140px, 1fr))` }} key={index}>
            {row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}
          </div>
        ))}
        {rows.length === 0 && <p className="empty-state admin-empty-state">{emptyMessage}</p>}
      </div>
    </section>
  )
}

export default AdminDashboardPage
