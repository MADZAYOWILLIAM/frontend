import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useMemo, useState } from 'react'
import { getAdminBlogs, getAdminEvents, getAdminStats, getAdminUsers } from '../data/adminData'
import { usePersistentState } from '../hooks/usePersistentState'
import { useApi, useMutation } from '../hooks/useApi'
import { useToast } from '../context/ToastContext'
import type { Role } from '../data/api'
import { api } from '../data/api'

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

type AdminDashboardPageProps = {
  onSignOut: () => void
}

type AdminComment = {
  id: string
  author: string
  post: string
  text: string
  status: 'Pending' | 'Approved' | string
}

type AdminMessage = {
  id: string
  sender: string
  subject: string
  status: 'Unread' | 'Read' | string
}

type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[number]
type AdminEvent = Awaited<ReturnType<typeof getAdminEvents>>[number]
type AdminBlog = Awaited<ReturnType<typeof getAdminBlogs>>[number]

function AdminDashboardPage({ onSignOut }: AdminDashboardPageProps) {
  const { showToast } = useToast()
  const { data: user, refetch: refetchMe } = useApi(api.auth.me)
  const { data: stats, isLoading: statsLoading } = useApi(getAdminStats)
  const { data: apiUsers, isLoading: usersLoading, refetch: refetchUsers } = useApi(getAdminUsers)
  const { data: apiEvents, refetch: refetchEvents } = useApi(getAdminEvents)
  const { data: apiBlogs, refetch: refetchBlogs } = useApi(getAdminBlogs)
  const [activeTab, setActiveTab] = usePersistentState<AdminTab>('empoweredge-admin-active-tab', 'Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
  const [eventDraft, setEventDraft] = useState<{ name: string; date: string; registrations: string; status: string; image: string; file: File | null }>({ 
    name: '', date: '', registrations: '0', status: 'Draft', image: '', file: null })
  const [blogDraft, setBlogDraft] = useState({ title: '', author: 'Admin Team', status: 'Draft', image: '' })
  const [comments, setComments] = usePersistentState<AdminComment[]>('empoweredge-admin-comments', [])
  const [messages, setMessages] = usePersistentState<AdminMessage[]>('empoweredge-admin-messages', [])
  const [siteSettings, setSiteSettings] = usePersistentState('empoweredge-admin-settings', {
    siteName: 'Empoweredge Youth Club',
    contactEmail: 'empoweredgeyouthsclub@gmail.com',
    publishModeration: true,
  })

  const { mutate: deleteUser } = useMutation(api.auth.deleteUser, {
    onSuccess: () => {
      showToast('User deleted successfully.', 'success')
      refetchUsers()
    },
  })

  const { mutate: updateRole } = useMutation(api.auth.updateUserRole, {
    onSuccess: () => {
      showToast('User role updated.', 'success')
      refetchUsers()
    },
  })

  const { mutate: deleteEvent } = useMutation(api.events.delete, {
    onSuccess: () => {
      showToast('Event deleted.', 'success')
      refetchEvents()
    },
  })

  const { mutate: updateEvent } = useMutation(api.events.update, {
    onSuccess: () => {
      showToast('Event updated.', 'success')
      refetchEvents()
    },
  })

  const { mutate: deleteBlog } = useMutation(api.blogs.delete, {
    onSuccess: () => {
      showToast('Blog post deleted.', 'success')
      refetchBlogs()
    },
  })

  const { mutate: updateBlog } = useMutation(api.blogs.update, {
    onSuccess: () => {
      showToast('Blog post updated.', 'success')
      refetchBlogs()
    },
  })

  const { mutate: performCreateEvent } = useMutation(api.events.create, {
    onSuccess: () => {
      showToast('Event created successfully.', 'success')
      refetchEvents()
      setShowEventForm(false)
      setEventDraft({ name: '', date: '', registrations: '0', status: 'Draft', image: '', file: null })
    },
  })

  const { mutate: performCreateBlog } = useMutation(api.blogs.create, {
    onSuccess: () => {
      showToast('Blog post created.', 'success')
      refetchBlogs()
      setShowBlogForm(false)
    },
  })

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredUsers = useMemo(
    () => (apiUsers || []).filter((u) => Object.values(u).join(' ').toLowerCase().includes(normalizedSearch)),
    [normalizedSearch, apiUsers],
  )
  const filteredEvents = useMemo(
    () => (apiEvents || []).filter((event) => Object.values(event).join(' ').toLowerCase().includes(normalizedSearch)),
    [apiEvents, normalizedSearch],
  )
  const filteredBlogs = useMemo(
    () => (apiBlogs || []).filter((blog) => Object.values(blog).join(' ').toLowerCase().includes(normalizedSearch)),
    [apiBlogs, normalizedSearch],
  )
  const filteredComments = useMemo(
    () => comments.filter((comment) => Object.values(comment).join(' ').toLowerCase().includes(normalizedSearch)),
    [comments, normalizedSearch],
  )
  const filteredMessages = useMemo(
    () => messages.filter((message) => Object.values(message).join(' ').toLowerCase().includes(normalizedSearch)),
    [messages, normalizedSearch],
  )

  const setTab = (tab: AdminTab) => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
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

    performCreateEvent({
      title: eventDraft.name,
      description: 'Community event organized by the foundation.',
      location: 'Kilifi, Mtwapa',
      capacity: Number(eventDraft.registrations),
      image: eventDraft.file
    })
  }

  const createBlog = () => {
    if (!blogDraft.title.trim() || !blogDraft.author.trim()) {
      return
    }

    performCreateBlog({
      title: blogDraft.title,
      description: 'Latest updates from the field.',
    })
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
          <span className="dashboard-avatar">
            {user ? `${user.first_name[0]}${user.second_name[0]}`.toUpperCase() : 'AD'}
          </span>
          <div>
            <strong>{user ? `${user.first_name} ${user.second_name}` : 'Admin User'}</strong>
            <span>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Platform Admin'}</span>
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
          <button className="logout-button" type="button" onClick={async () => {
            await api.auth.logout()
            refetchMe()
            onSignOut()
          }}>
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
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
              {statsLoading
                ? [...Array(4)].map((_, i) => (
                    <article className="dashboard-stat-card loading-skeleton" key={i} style={{ opacity: 0.5 }}>
                      <div style={{ height: '48px', width: '100%', background: 'var(--border-color, #e2e8f0)', borderRadius: '8px' }} />
                    </article>
                  ))
                : (stats || []).map((stat) => (
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
            rows={usersLoading ? [] : filteredUsers.map((user) => [
              user.name,
              user.email,
              user.role,
              user.status,
              <button className="table-action-button danger-inline" type="button" onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                  deleteUser(user.id)
                }
              }}>
                Delete
              </button>,
              <button className="table-action-button" type="button" onClick={() => {
                const nextRole = window.prompt('Enter new role (admin, user, mentor):', user.role) as Role
                if (nextRole && ['admin', 'user', 'mentor'].includes(nextRole)) {
                  updateRole(user.id, { role: nextRole })
                }
              }}>
                Edit
              </button>,
            ])}
            emptyMessage={usersLoading ? "Loading users..." : "No users match your search."}
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
                          readImageFile(file, (image) => setEventDraft((current) => ({ ...current, image, file })))
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
                <button className="table-action-button" type="button" disabled>
                  {event.status === 'Published' ? 'Live' : 'Draft'}
                </button>,
                <button className="table-action-button" type="button" onClick={() => {
                  const nextName = window.prompt('Update event title', event.name)
                  if (nextName) {
                    updateEvent(event.id, { title: nextName, description: '', location: '', capacity: Number(event.registrations), image_url: '' })
                  }
                }}>Edit</button>,
                <button className="table-action-button danger-inline" type="button" onClick={() => {
                  if (window.confirm(`Delete ${event.name}?`)) {
                    deleteEvent(event.id)
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
                <button className="table-action-button" type="button" disabled>
                  {blog.status === 'Published' ? 'Live' : 'Draft'}
                </button>,
                <button className="table-action-button" type="button" onClick={() => {
                  const nextTitle = window.prompt('Update blog title', blog.title)
                  if (nextTitle) {
                    updateBlog(blog.id, { title: nextTitle, description: '', image_url: '' })
                  }
                }}>Edit</button>,
                <button className="table-action-button danger-inline" type="button" onClick={() => {
                  if (window.confirm(`Delete ${blog.title}?`)) {
                    deleteBlog(blog.id)
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
  blogs: AdminBlog[]
  chatDraft: string
  chatMessageCount: number
  chatMessages: AdminChatMessage[]
  comments: AdminComment[]
  events: AdminEvent[]
  messages: AdminMessage[]
  setChatDraft: Dispatch<SetStateAction<string>>
  setChatMessageCount: Dispatch<SetStateAction<number>>
  setChatMessages: Dispatch<SetStateAction<AdminChatMessage[]>>
  users: AdminUser[]
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
    blogs: AdminBlog[]
    comments: AdminComment[]
    events: AdminEvent[]
    messages: AdminMessage[]
    users: AdminUser[]
  },
) {
  const normalizedPrompt = prompt.toLowerCase()
  const pendingComments = (context.comments || []).filter((comment) => comment.status === 'Pending')
  const unreadMessages = (context.messages || []).filter((message) => message.status === 'Unread')
  const draftEvents = (context.events || []).filter((event) => event.status === 'Draft')
  const draftBlogs = (context.blogs || []).filter((blog) => blog.status === 'Draft')
  const suspendedUsers = (context.users || []).filter((user) => user.status === 'Suspended')
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
