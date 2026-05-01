import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { adminBlogs, adminComments, adminEvents, adminMessages, adminStats, adminUsers } from '../data/adminData'
import { usePersistentState } from '../hooks/usePersistentState'
type AdminDashboardPageProps = {
  onSignOut: () => void
}

type AdminTab = 'Overview' | 'Users' | 'Events' | 'Blogs' | 'Comments' | 'Messages' | 'Settings'

const adminTabs = [
  { label: 'Overview', icon: 'space_dashboard' },
  { label: 'Users', icon: 'group' },
  { label: 'Events', icon: 'event' },
  { label: 'Blogs', icon: 'article' },
  { label: 'Comments', icon: 'rate_review' },
  { label: 'Messages', icon: 'mail' },
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
  const [eventDraft, setEventDraft] = useState({ name: '', date: '', registrations: '0', status: 'Draft' })
  const [blogDraft, setBlogDraft] = useState({ title: '', author: 'Admin Team', status: 'Draft' })
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
      },
    ])
    setEventDraft({ name: '', date: '', registrations: '0', status: 'Draft' })
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
      },
    ])
    setBlogDraft({ title: '', author: 'Admin Team', status: 'Draft' })
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

        {activeTab === 'Overview' && (
          <div className="admin-overview-grid">
            <AdminTable title="Recent users" columns={['Name', 'Email', 'Role', 'Status']} rows={filteredUsers.slice(0, 4).map((user) => [user.name, user.email, user.role, user.status])} />
            <AdminTable title="Upcoming events" columns={['Event', 'Date', 'Registrations', 'Status']} rows={filteredEvents.map((event) => [event.name, event.date, String(event.registrations), event.status])} />
            <AdminTable title="Review queue" columns={['Author', 'Post', 'Status']} rows={filteredComments.map((comment) => [comment.author, comment.post, comment.status])} />
          </div>
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
                  <button className="primary-button compact-button" type="submit">Create event</button>
                </form>
              </section>
            )}
            <AdminTable
              title="Event management"
              action={<button className="primary-button compact-button" type="button" onClick={() => setShowEventForm(true)}>New event</button>}
              columns={['Event', 'Date', 'Registrations', 'Status', 'Action', 'Edit', 'Delete']}
              rows={filteredEvents.map((event) => [
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
                  <button className="primary-button compact-button" type="submit">Create post</button>
                </form>
              </section>
            )}
            <AdminTable
              title="Blog management"
              action={<button className="primary-button compact-button" type="button" onClick={() => setShowBlogForm(true)}>New post</button>}
              columns={['Title', 'Author', 'Comments', 'Status', 'Action', 'Edit', 'Delete']}
              rows={filteredBlogs.map((blog) => [
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
