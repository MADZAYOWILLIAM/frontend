import FaqSection from '../components/FaqSection'
import JoinSection from '../components/JoinSection'
import ProgramsSection from '../components/ProgramsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import WhyJoinSection from '../components/WhyJoinSection'
import type { NavigateTo } from '../types/navigation'

type HomePageProps = {
  navigateTo: NavigateTo
}

function HomePage({ navigateTo }: HomePageProps) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <h1>Empowering Youth for a Better Future</h1>
          <p className="hero-text">
            Join our community to access training programs, events, and resources
            designed to help you succeed.
          </p>
        </div>

        <div className="hero-feature-card">
          <h2>Believe, Grow, Take Bold Steps</h2>
          <p>
            A short motivational piece to remind you of your potential, the power
            of self-discipline, and how education, creativity, and innovation can
            shape a brighter future.
          </p>
        </div>
      </section>

      <ProgramsSection />
      <WhyJoinSection />
      <TestimonialsSection />
      <FaqSection />
      <JoinSection navigateTo={navigateTo} />
    </>
  )
}

export default HomePage
