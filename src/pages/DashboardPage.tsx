import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'
import {
  dashboardActivity,
  dashboardBlogMetrics,
  dashboardEvents,
  dashboardMentorship,
  dashboardNotifications,
  dashboardQuickActions,
  dashboardSettings,
  dashboardStats,
  dashboardTasks,
} from '../data/dashboardData'
import { usePersistentState } from '../hooks/usePersistentState'
import type { AuthSession } from '../types/auth'
import type { NavigateTo } from '../types/navigation'

type DashboardPageProps = {
  onSignOut: () => void
  navigateTo: NavigateTo
  session: AuthSession
}

type DashboardTab = 'Overview' | 'Events' | 'Mentorship' | 'Blog Activity' | 'Settings'

const dashboardTabs = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Events', icon: 'event' },
  { label: 'Mentorship', icon: 'school' },
  { label: 'Blog Activity', icon: 'forum' },
  { label: 'Settings', icon: 'settings' },
] satisfies { label: DashboardTab; icon: string }[]

function DashboardPage({ navigateTo, onSignOut, session }: DashboardPageProps) {
  const [activeTab, setActiveTab] = usePersistentState<DashboardTab>('empoweredge-member-active-tab', 'Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [userDetails, setUserDetails] = usePersistentState('empoweredge-member-details', {
    name: session.name,
    email: session.email,
    phone: '+254 718548376',
    role: 'Youth Member',
  })
  const [eventStatuses, setEventStatuses] = usePersistentState<Record<string, string>>(
    'empoweredge-member-event-statuses',
    () => Object.fromEntries(dashboardEvents.map((event) => [event.id, event.status])),
  )
  const [tasks, setTasks] = usePersistentState('empoweredge-member-tasks', dashboardTasks)
  const [settings, setSettings] = usePersistentState('empoweredge-member-settings', dashboardSettings)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const completedTasks = tasks.filter((task) => task.done).length
  const enabledSettings = settings.filter((setting) => setting.enabled).length
  const profileProgress = Math.round(((completedTasks + enabledSettings) / (tasks.length + settings.length)) * 100)
  const registeredEvents = Object.values(eventStatuses).filter((status) => status === 'Registered').length

  const stats = dashboardStats.map((stat) =>
    stat.label === 'Events joined'
      ? { ...stat, value: String(registeredEvents) }
      : stat.label === 'Tasks completed'
        ? { ...stat, value: String(completedTasks) }
        : stat,
  )

  const filteredEvents = useMemo(
    () =>
      dashboardEvents.filter((event) =>
        [event.name, event.location, event.owner, eventStatuses[event.id]]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [eventStatuses, normalizedSearch],
  )

  const filteredMentorship = dashboardMentorship.filter((session) =>
    [session.mentor, session.focus, session.nextSession].join(' ').toLowerCase().includes(normalizedSearch),
  )

  const filteredBlogs = dashboardBlogMetrics.filter((blog) =>
    [blog.title, blog.status].join(' ').toLowerCase().includes(normalizedSearch),
  )

  const updateEventStatus = (eventId: string, status: string) => {
    setEventStatuses((current) => ({ ...current, [eventId]: status }))
  }

  return (
    <section className={isSidebarOpen ? 'dashboard-page sidebar-open' : 'dashboard-page'} aria-labelledby="dashboard-title">
      {isSidebarOpen && (
        <button
          className="dashboard-overlay"
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
        <div className="dashboard-sidebar-top">
          <div className="dashboard-brand">
            <span className="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
            <div>
              <strong>Empoweredge</strong>
              <small>Member Portal</small>
            </div>
          </div>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="dashboard-profile">
          <span className="dashboard-avatar">{getInitials(userDetails.name)}</span>
          <div>
            <strong>{userDetails.name}</strong>
            <span>{userDetails.role} · Active</span>
          </div>
        </div>
        <nav className="dashboard-menu">
          {dashboardTabs.map((item) => (
            <button
              className={item.label === activeTab ? 'active' : undefined}
              type="button"
              key={item.label}
              onClick={() => {
                setActiveTab(item.label)
                setIsSidebarOpen(false)
              }}
              title={item.label}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="dashboard-sidebar-footer">
          <button className="logout-button" type="button" onClick={onSignOut} title="Log out">
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-menu-button"
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">menu</span>
          </button>
          <div className="dashboard-search">
            <span className="material-symbols-outlined" aria-hidden="true">search</span>
            <input
              aria-label="Search dashboard"
              placeholder="Search events, blogs, mentors..."
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="dashboard-topbar-actions">
            <button
              className={showNotifications ? 'active' : undefined}
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications((current) => !current)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <button type="button" aria-label="Account" onClick={() => setActiveTab('Settings')}>
              <span className="material-symbols-outlined" aria-hidden="true">account_circle</span>
            </button>
          </div>
          {showNotifications && (
            <div className="dashboard-notifications" role="status">
              <strong>Notifications</strong>
              {dashboardNotifications.map((notification) => (
                <p key={notification}>{notification}</p>
              ))}
            </div>
          )}
        </header>

        <section className="dashboard-hero-panel">
          <div>
            <p>{activeTab}</p>
            <h1 id="dashboard-title">Welcome back.</h1>
            <span>Track your events, mentorship progress, blog activity, and next actions.</span>
          </div>
          <button className="primary-button" type="button" onClick={() => navigateTo('/event')}>
            View events
          </button>
        </section>

        <div className="dashboard-stats" aria-label="Dashboard statistics">
          {stats.map((stat) => (
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
          <div className="dashboard-grid">
            <EventsPanel events={filteredEvents} eventStatuses={eventStatuses} updateEventStatus={updateEventStatus} />
            <ProgressPanel progress={profileProgress} />
            <QuickActionsPanel navigateTo={navigateTo} />
            <TasksPanel tasks={tasks} setTasks={setTasks} />
            <ActivityPanel />
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="dashboard-wide-grid">
            <EventsPanel events={filteredEvents} eventStatuses={eventStatuses} updateEventStatus={updateEventStatus} />
          </div>
        )}

        {activeTab === 'Mentorship' && (
          <section className="dashboard-panel dashboard-wide-panel" aria-labelledby="mentorship-title">
            <div className="dashboard-panel-heading">
              <div>
                <h2 id="mentorship-title">Mentorship sessions</h2>
                <p>Track upcoming mentor sessions and learning progress</p>
              </div>
            </div>
            <div className="dashboard-card-grid">
              {filteredMentorship.map((session) => (
                <article className="dashboard-learning-card" key={session.mentor}>
                  <div>
                    <h3>{session.mentor}</h3>
                    <p>{session.focus}</p>
                  </div>
                  <span>{session.nextSession}</span>
                  <div className="dashboard-progress-bar" aria-label={`${session.progress} percent complete`}>
                    <span style={{ width: `${session.progress}%` }} />
                  </div>
                  <button className="secondary-button" type="button">Prepare notes</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Blog Activity' && (
          <section className="dashboard-panel dashboard-wide-panel" aria-labelledby="blog-activity-title">
            <div className="dashboard-panel-heading">
              <div>
                <h2 id="blog-activity-title">Blog activity</h2>
                <p>Your reading, saved posts, likes, and comments</p>
              </div>
              <button className="text-button" type="button" onClick={() => navigateTo('/blogs')}>Open blogs</button>
            </div>
            <div className="dashboard-card-grid">
              {filteredBlogs.map((blog) => (
                <article className="dashboard-blog-card" key={blog.title}>
                  <span>{blog.status}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.likes} likes · {blog.comments} comments</p>
                  <button className="secondary-button" type="button" onClick={() => navigateTo('/blogs')}>
                    Continue reading
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Settings' && (
          <section className="dashboard-panel dashboard-wide-panel" aria-labelledby="settings-title">
            <div className="dashboard-panel-heading">
              <div>
                <h2 id="settings-title">Account settings</h2>
                <p>Update your details, preferences, and account access</p>
              </div>
            </div>
            <div className="dashboard-settings-grid">
              <div className="dashboard-account-card">
                <ProgressPanel progress={profileProgress} />
                <div className="danger-zone">
                  <h3>Delete account</h3>
                  <p>This removes your dashboard profile from this device.</p>
                  {!showDeleteConfirm ? (
                    <button className="danger-button" type="button" onClick={() => setShowDeleteConfirm(true)}>
                      Delete account
                    </button>
                  ) : (
                    <div className="delete-confirm">
                      <span>Confirm account deletion?</span>
                      <button
                        className="danger-button"
                        type="button"
                        onClick={() => {
                          window.localStorage.removeItem('empoweredge-member-details')
                          window.localStorage.removeItem('empoweredge-member-event-statuses')
                          window.localStorage.removeItem('empoweredge-member-tasks')
                          window.localStorage.removeItem('empoweredge-member-settings')
                          onSignOut()
                        }}
                      >
                        Yes, delete
                      </button>
                      <button className="secondary-button" type="button" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-settings-stack">
                <form
                  className="dashboard-profile-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setSettingsMessage('Profile details updated.')
                  }}
                >
                  <h3>User details</h3>
                  <label>
                    Full name
                    <input
                      name="name"
                      type="text"
                      value={userDetails.name}
                      onChange={(event) => setUserDetails((current) => ({ ...current, name: event.target.value }))}
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      value={userDetails.email}
                      onChange={(event) => setUserDetails((current) => ({ ...current, email: event.target.value }))}
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      value={userDetails.phone}
                      onChange={(event) => setUserDetails((current) => ({ ...current, phone: event.target.value }))}
                    />
                  </label>
                  <label>
                    Role
                    <select
                      name="role"
                      value={userDetails.role}
                      onChange={(event) => setUserDetails((current) => ({ ...current, role: event.target.value }))}
                    >
                      <option>Youth Member</option>
                      <option>Mentor</option>
                      <option>Volunteer</option>
                    </select>
                  </label>
                  <button className="primary-button" type="submit">Save details</button>
                  {settingsMessage && <p className="settings-message">{settingsMessage}</p>}
                </form>

                <div className="dashboard-setting-list">
                  <h3>Preferences</h3>
                  {settings.map((setting) => (
                    <label className="dashboard-setting" key={setting.label}>
                      <span>{setting.label}</span>
                      <input
                        type="checkbox"
                        checked={setting.enabled}
                        onChange={() =>
                          setSettings((current) =>
                            current.map((item) =>
                              item.label === setting.label ? { ...item, enabled: !item.enabled } : item,
                            ),
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'EY'
}

type EventPanelProps = {
  events: typeof dashboardEvents
  eventStatuses: Record<string, string>
  updateEventStatus: (eventId: string, status: string) => void
}

function EventsPanel({ events, eventStatuses, updateEventStatus }: EventPanelProps) {
  return (
    <section className="dashboard-panel dashboard-events" aria-labelledby="dashboard-events-title">
      <div className="dashboard-panel-heading">
        <div>
          <h2 id="dashboard-events-title">Upcoming events</h2>
          <p>Registration and attendance status</p>
        </div>
      </div>
      <div className="dashboard-table" role="table" aria-label="Upcoming events">
        <div className="dashboard-table-head" role="row">
          <span>Event</span>
          <span>Date</span>
          <span>Owner</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {events.map((event) => (
          <article className="dashboard-table-row" key={event.name}>
            <div>
              <h3>{event.name}</h3>
              <p>{event.location}</p>
            </div>
            <time>
              {event.date}
              <small>{event.time}</small>
            </time>
            <span>{event.owner}</span>
            <strong>{eventStatuses[event.id]}</strong>
            <button
              className="table-action-button"
              type="button"
              onClick={() =>
                updateEventStatus(event.id, eventStatuses[event.id] === 'Registered' ? 'Open' : 'Registered')
              }
            >
              {eventStatuses[event.id] === 'Registered' ? 'Cancel' : 'Register'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProgressPanel({ progress }: { progress: number }) {
  return (
    <section className="dashboard-panel dashboard-progress" aria-labelledby="dashboard-progress-title">
      <div className="dashboard-panel-heading">
        <div>
          <h2 id="dashboard-progress-title">Profile progress</h2>
          <p>Member readiness score</p>
        </div>
      </div>
      <div
        className="progress-ring"
        style={{ '--progress': `${progress}%` } as CSSProperties}
        aria-label={`Profile completion ${progress} percent`}
      >
        <span>{progress}%</span>
      </div>
      <p>Complete your availability and interests to unlock better event recommendations.</p>
    </section>
  )
}

function QuickActionsPanel({ navigateTo }: { navigateTo: NavigateTo }) {
  return (
    <section className="dashboard-panel dashboard-actions" aria-labelledby="dashboard-actions-title">
      <div className="dashboard-panel-heading">
        <h2 id="dashboard-actions-title">Quick actions</h2>
      </div>
      <div className="dashboard-action-list">
        {dashboardQuickActions.map((action) => (
          <button type="button" key={action.label} onClick={() => navigateTo(action.path)}>
            <span className="material-symbols-outlined" aria-hidden="true">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  )
}

type TasksPanelProps = {
  tasks: typeof dashboardTasks
  setTasks: Dispatch<SetStateAction<typeof dashboardTasks>>
}

function TasksPanel({ tasks, setTasks }: TasksPanelProps) {
  return (
    <section className="dashboard-panel dashboard-tasks-panel" aria-labelledby="dashboard-tasks-title">
      <div className="dashboard-panel-heading">
        <h2 id="dashboard-tasks-title">Next actions</h2>
      </div>
      <div className="dashboard-task-list">
        {tasks.map((task) => (
          <label className="dashboard-task" key={task.label}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() =>
                setTasks((current) =>
                  current.map((item) => (item.label === task.label ? { ...item, done: !item.done } : item)),
                )
              }
            />
            <span>{task.label}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function ActivityPanel() {
  return (
    <section className="dashboard-panel dashboard-activity-panel" aria-labelledby="dashboard-activity-title">
      <div className="dashboard-panel-heading">
        <h2 id="dashboard-activity-title">Recent activity</h2>
      </div>
      <div className="dashboard-activity-list">
        {dashboardActivity.map((item) => (
          <article className="dashboard-activity-item" key={item.title}>
            <span />
            <div>
              <h3>{item.title}</h3>
              <p>{item.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
