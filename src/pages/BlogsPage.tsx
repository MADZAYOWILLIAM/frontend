import { useMemo, useState } from 'react'
import { blogPosts } from '../data/siteData'
import type { NavigateTo } from '../types/navigation'

type BlogsPageProps = {
  navigateTo: NavigateTo
}

function BlogsPage({ navigateTo }: BlogsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))]
  const filteredPosts = useMemo(
    () =>
      blogPosts.filter((post) => {
        const matchesCategory = category === 'All' || post.category === category
        const matchesSearch = [post.title, post.excerpt, post.category]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())

        return matchesCategory && matchesSearch
      }),
    [category, searchTerm],
  )

  return (
    <>
      <section
        className="page-hero page-hero-with-image"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${blogPosts[0].image})`,
        }}
      >
        <div className="page-hero-copy">
          <p className="eyebrow">Blogs</p>
          <h1>Stories and field notes from the work.</h1>
          <p className="hero-text">
            Read practical reflections from community events, youth mentorship,
            partner programs, and resource drives.
          </p>
        </div>
      </section>

      <section className="blogs-section">
        <div className="blog-controls">
          <label>
            Search
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search blog posts" type="search" />
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <article className="blog-card" key={post.title}>
              <img className="blog-card-image" src={post.image} alt={post.imageAlt} loading="lazy" decoding="async" />
              <div className="blog-meta">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <button
                className="read-more-button"
                type="button"
                onClick={() => navigateTo('/blog', `/blog?post=${post.id}`)}
              >
                Read more
              </button>
            </article>
          ))}
        </div>
        {filteredPosts.length === 0 && <p className="empty-state">No blog posts match your search.</p>}
      </section>
    </>
  )
}

export default BlogsPage
