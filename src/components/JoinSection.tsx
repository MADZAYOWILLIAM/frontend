import type { NavigateTo } from '../types/navigation'

type JoinSectionProps = {
  navigateTo: NavigateTo
}

function JoinSection({ navigateTo }: JoinSectionProps) {
  return (
    <section className="join-section">
      <div>
        <p className="eyebrow">Get involved</p>
        <h2>Help turn one event into a lasting support network.</h2>
      </div>
      <button className="primary-button" type="button" onClick={() => navigateTo('/contact')}>
        Contact the team
      </button>
    </section>
  )
}

export default JoinSection
