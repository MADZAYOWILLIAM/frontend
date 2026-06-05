import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'
import {
  dashboardMentorship,
  dashboardNotifications,
  dashboardQuickActions,
  dashboardSettings,
  dashboardTasks,
  getDashboardActivity,
  getDashboardBlogMetrics,
  getDashboardEvents,
  getDashboardStats,
} from '../data/dashboardData'
import { usePersistentState } from '../hooks/usePersistentState'
import { useApi } from '../hooks/useApi'
import { api } from '../data/api'
import type { AuthSession } from '../types/auth'
import type { NavigateTo } from '../types/navigation'

type DashboardPageProps = {
  onSignOut: () => void
  navigateTo: NavigateTo
  session: AuthSession
}

type DashboardTab = 'Overview' | 'Events' | 'Mentorship' | 'AI Coach' | 'Blog Activity' | 'Settings'
type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}
type DashboardEvent = Awaited<ReturnType<typeof getDashboardEvents>>[number]

const dashboardTabs = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Events', icon: 'event' },
  { label: 'Mentorship', icon: 'school' },
  { label: 'AI Coach', icon: 'auto_awesome' },
  { label: 'Blog Activity', icon: 'forum' },
  { label: 'Settings', icon: 'settings' },
] satisfies { label: DashboardTab; icon: string }[]

function DashboardPage({ navigateTo, onSignOut, session }: DashboardPageProps) {
  const { data: apiStats, isLoading: statsLoading } = useApi(getDashboardStats)
  const { data: apiEvents } = useApi(getDashboardEvents)
  const { data: apiActivity } = useApi(getDashboardActivity)
  const { data: apiBlogMetrics } = useApi(getDashboardBlogMetrics)
  const { data: userProfile, refetch: refetchMe } = useApi(api.auth.me)

  const [activeTab, setActiveTab] = usePersistentState<DashboardTab>('empoweredge-member-active-tab', 'Overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [chatDraft, setChatDraft] = useState('')
  const [chatMessageCount, setChatMessageCount] = useState(1)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi, I am your Empoweredge AI Coach. Ask me what to do next, which event to join, or how to prepare for mentorship.',
    },
  ])
  const [eventStatuses, setEventStatuses] = usePersistentState<Record<string, string>>(
    'empoweredge-member-event-statuses',
    () => Object.fromEntries((apiEvents || []).map((event) => [event.id, event.status])),
  )
  const [tasks, setTasks] = usePersistentState('empoweredge-member-tasks', dashboardTasks)
  const [settings, setSettings] = usePersistentState('empoweredge-member-settings', dashboardSettings)
  const [userDetails, setUserDetails] = usePersistentState('empoweredge-member-details', {
    name: session.name,
    email: session.email,
    phone: '+254 718548376',
    role: 'Youth Member',
  })

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const completedTasks = tasks.filter((task) => task.done).length

  const profileProgress = useMemo(() => {
    if (!userProfile) return 0
    const criteria = [
      !!userProfile.first_name,
      !!userProfile.second_name,
      !!userProfile.email,
      !!userProfile.role,
      !!userProfile.avatar_url,
      userProfile.is_verified,
      (apiEvents || []).length > 0,
    ]
    const metCriteriaCount = criteria.filter(Boolean).length
    return Math.round((metCriteriaCount / criteria.length) * 100)
  }, [userProfile, apiEvents])

  const registeredEvents = Object.values(eventStatuses).filter((status) => status === 'Registered').length

  const stats = useMemo(
    () =>
      (apiStats || []).map((stat) =>
        stat.label === 'Events joined'
          ? { ...stat, value: String(registeredEvents) }
          : stat.label === 'Tasks completed'
            ? { ...stat, value: String(completedTasks) }
            : stat,
      ),
    [apiStats, registeredEvents, completedTasks],
  )

  const filteredEvents = useMemo(
    () =>
      (apiEvents || []).filter((event) =>
        [event.name, event.location, event.owner, eventStatuses[event.id]]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      ),
    [apiEvents, eventStatuses, normalizedSearch],
  )

  const filteredMentorship = useMemo(
    () =>
      dashboardMentorship.filter((session) =>
        [session.mentor, session.focus, session.nextSession].join(' ').toLowerCase().includes(normalizedSearch),
      ),
    [normalizedSearch],
  )

  const filteredBlogs = useMemo(
    () => (apiBlogMetrics || []).filter((blog) => [blog.title, blog.status].join(' ').toLowerCase().includes(normalizedSearch)),
    [apiBlogMetrics, normalizedSearch],
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
          <span className="dashboard-avatar">{userProfile ? getInitials(`${userProfile.first_name} ${userProfile.second_name}`) : getInitials(userDetails.name)}</span>
          <div>
            <strong>{userProfile ? `${userProfile.first_name} ${userProfile.second_name}` : session.name}</strong>
            <span>{userProfile?.role || 'Member'} · Active</span>
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
          <button className="logout-button" type="button" onClick={async () => {
            await api.auth.logout()
            refetchMe()
            onSignOut()
          }} title="Log out">
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

        {activeTab === 'Overview' && (
          <>
            <div className="dashboard-stats" aria-label="Dashboard statistics">
              {(statsLoading ? [] : stats).map((stat) => (
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

            <div className="dashboard-grid">
              <EventsPanel events={filteredEvents} eventStatuses={eventStatuses} updateEventStatus={updateEventStatus} />
              <ProgressPanel progress={profileProgress} />
              <QuickActionsPanel navigateTo={navigateTo} />
              <TasksPanel tasks={tasks} setTasks={setTasks} />
              <ActivityPanel activity={apiActivity || []} />
            </div>
          </>
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

        {activeTab === 'AI Coach' && (
          <AiCoachPanel
            role={userProfile?.role || 'user'}
            events={filteredEvents}
            eventStatuses={eventStatuses}
            tasks={tasks}
            profileProgress={profileProgress}
            mentorship={filteredMentorship}
            chatDraft={chatDraft}
            chatMessages={chatMessages}
            setChatDraft={setChatDraft}
            setChatMessages={setChatMessages}
            chatMessageCount={chatMessageCount}
            setChatMessageCount={setChatMessageCount}
          />
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
                        onClick={async () => {
                          if (userProfile) {
                            await api.auth.deleteUser(userProfile.id)
                          }
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

type ChatContext = {
  nextMentorship?: (typeof dashboardMentorship)[number]
  openEvents: DashboardEvent[]
  pendingTasks: typeof dashboardTasks
  profileProgress: number
  registeredEvents: DashboardEvent[]
  role: string
}

function buildChatbotReply(prompt: string, context: ChatContext) {
  const normalizedPrompt = prompt.toLowerCase()
  const nextOpenEvent = context.openEvents[0]
  const nextRegisteredEvent = context.registeredEvents[0]
  const nextTask = context.pendingTasks[0]
  const nextMentorship = context.nextMentorship

  if (normalizedPrompt.includes('event') || normalizedPrompt.includes('join') || normalizedPrompt.includes('register')) {
    if (nextOpenEvent) {
      return `${nextOpenEvent.name} is the best next event to consider. It is at ${nextOpenEvent.location} on ${nextOpenEvent.date} at ${nextOpenEvent.time}. Open the Events tab and register there if it fits your schedule.`
    }

    return nextRegisteredEvent
      ? `You are already registered for ${nextRegisteredEvent.name}. Focus on preparing for ${nextRegisteredEvent.date} and confirm your availability.`
      : 'I do not see an open event in your current dashboard list. Contact the team for the next event recommendation.'
  }

  if (normalizedPrompt.includes('mentor') || normalizedPrompt.includes('mentorship') || normalizedPrompt.includes('prepare')) {
    return nextMentorship
      ? `For mentorship, prepare for ${nextMentorship.mentor}'s ${nextMentorship.focus.toLowerCase()} session. Your progress is ${nextMentorship.progress}%, so bring one question, one blocker, and one outcome you want from the next session on ${nextMentorship.nextSession}.`
      : 'I do not see an active mentorship session right now. Ask the team to match you with a mentor based on your current goals.'
  }

  if (normalizedPrompt.includes('task') || normalizedPrompt.includes('next') || normalizedPrompt.includes('week')) {
    return nextTask
      ? `Your next best step is: ${nextTask.label}. After that, check your profile progress and register for one event that supports your goal.`
      : `You have no pending tasks. Since your profile readiness is ${context.profileProgress}%, use this week to prepare for an event or ask for new mentorship goals.`
  }

  if (normalizedPrompt.includes('profile') || normalizedPrompt.includes('progress')) {
    return `Your profile readiness is ${context.profileProgress}%. If you want better recommendations, keep your role, contact details, reminders, and mentorship preferences updated.`
  }

  return `Based on your dashboard, I recommend focusing on ${nextTask?.label ?? nextOpenEvent?.name ?? nextMentorship?.focus ?? 'one clear weekly goal'}. You can ask me about events, mentorship, tasks, or profile progress.`
}

type EventPanelProps = {
  events: DashboardEvent[]
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

type AiCoachPanelProps = {
  chatDraft: string
  chatMessageCount: number
  chatMessages: ChatMessage[]
  events: DashboardEvent[]
  eventStatuses: Record<string, string>
  mentorship: typeof dashboardMentorship
  profileProgress: number
  role: string
  setChatDraft: Dispatch<SetStateAction<string>>
  setChatMessageCount: Dispatch<SetStateAction<number>>
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>
  tasks: typeof dashboardTasks
}

function AiCoachPanel({
  chatDraft,
  chatMessageCount,
  chatMessages,
  events,
  eventStatuses,
  mentorship,
  profileProgress,
  role,
  setChatDraft,
  setChatMessageCount,
  setChatMessages,
  tasks,
}: AiCoachPanelProps) {
  const openEvents = events.filter((event) => eventStatuses[event.id] !== 'Registered')
  const registeredEvents = events.filter((event) => eventStatuses[event.id] === 'Registered')
  const pendingTasks = tasks.filter((task) => !task.done)
  const nextMentorship = mentorship.reduce((best, item) => (item.progress < best.progress ? item : best), mentorship[0])
  const sendMessage = (message: string) => {
    const prompt = message.trim()

    if (!prompt) {
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${chatMessageCount}`,
      role: 'user',
      text: prompt,
    }
    const assistantMessage: ChatMessage = {
      id: `assistant-${chatMessageCount}`,
      role: 'assistant',
      text: buildChatbotReply(prompt, {
        nextMentorship,
        openEvents,
        pendingTasks,
        profileProgress,
        registeredEvents,
        role,
      }),
    }

    setChatMessages((current) => [...current, userMessage, assistantMessage])
    setChatMessageCount((current) => current + 1)
    setChatDraft('')
  }

  return (
    <section className="dashboard-panel dashboard-wide-panel ai-coach-panel" aria-labelledby="ai-coach-title">
      <div className="dashboard-panel-heading">
        <div>
          <h2 id="ai-coach-title">AI Coach</h2>
          <p>Chat with your dashboard assistant</p>
        </div>
      </div>

      <div className="ai-coach-layout">
        <div className="ai-chat-shell">
          <div className="ai-chat-header">
            <span className="material-symbols-outlined" aria-hidden="true">smart_toy</span>
            <div>
              <h3>Empoweredge Assistant</h3>
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
          <div className="ai-chat-suggestions" aria-label="Suggested questions">
            {['What should I do next?', 'Which event should I join?', 'Help me prepare for mentorship'].map((question) => (
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
              aria-label="Message AI Coach"
              placeholder="Ask your AI Coach..."
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

function ActivityPanel({ activity }: { activity: any[] }) {
  return (
    <section className="dashboard-panel dashboard-activity-panel" aria-labelledby="dashboard-activity-title">
      <div className="dashboard-panel-heading">
        <h2 id="dashboard-activity-title">Recent activity</h2>
      </div>
      <div className="dashboard-activity-list">
        {activity.map((item) => (
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
