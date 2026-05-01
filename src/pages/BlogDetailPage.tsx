import { useState } from 'react'
import { blogPosts } from '../data/siteData'
import type { NavigateTo } from '../types/navigation'

type BlogDetailPageProps = {
  navigateTo: NavigateTo
}

function BlogDetailPage({ navigateTo }: BlogDetailPageProps) {
  const postId = new URLSearchParams(window.location.search).get('post')
  const selectedPost = blogPosts.find((post) => post.id === postId) ?? blogPosts[0]
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [commentsByPost, setCommentsByPost] = useState<Record<string, string[]>>(
    () => Object.fromEntries(blogPosts.map((post) => [post.id, post.comments])),
  )
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})

  const toggleLike = (postIdToToggle: string) => {
    setLikedPosts((current) =>
      current.includes(postIdToToggle)
        ? current.filter((id) => id !== postIdToToggle)
        : [...current, postIdToToggle],
    )
  }

  const addComment = (postIdToCommentOn: string) => {
    const draft = commentDrafts[postIdToCommentOn]?.trim()

    if (!draft) {
      return
    }

    setCommentsByPost((current) => ({
      ...current,
      [postIdToCommentOn]: [...(current[postIdToCommentOn] ?? []), draft],
    }))
    setCommentDrafts((current) => ({ ...current, [postIdToCommentOn]: '' }))
  }

  return (
    <>
      <section className="page-hero blog-detail-hero">
        <button className="back-button" type="button" onClick={() => navigateTo('/blogs')}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to blogs
        </button>
        <p className="eyebrow">{selectedPost.category}</p>
        <h1>{selectedPost.title}</h1>
        <p className="hero-text">{selectedPost.excerpt}</p>
      </section>

      <section className="blogs-section">
        <article className="blog-detail" aria-labelledby="selected-blog-title">
          <img className="blog-detail-image" src={selectedPost.image} alt={selectedPost.imageAlt} />
          <div className="blog-detail-header">
            <div>
              <div className="blog-meta">
                <span>{selectedPost.category}</span>
                <span>{selectedPost.readTime}</span>
              </div>
              <h2 id="selected-blog-title">{selectedPost.title}</h2>
            </div>
            <button
              className={likedPosts.includes(selectedPost.id) ? 'like-button active' : 'like-button'}
              type="button"
              onClick={() => toggleLike(selectedPost.id)}
              aria-pressed={likedPosts.includes(selectedPost.id)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
              {selectedPost.likes + (likedPosts.includes(selectedPost.id) ? 1 : 0)}
            </button>
          </div>

          <div className="blog-body">
            {selectedPost.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="comments-section" aria-label="Blog comments">
            <h3>Comments</h3>
            <div className="comment-list">
              {(commentsByPost[selectedPost.id] ?? []).map((comment, index) => (
                <p className="comment-item" key={`${selectedPost.id}-${index}`}>{comment}</p>
              ))}
            </div>
            <form
              className="comment-form"
              onSubmit={(event) => {
                event.preventDefault()
                addComment(selectedPost.id)
              }}
            >
              <label>
                Add a comment
                <textarea
                  name="comment"
                  placeholder="Share your thoughts"
                  rows={3}
                  value={commentDrafts[selectedPost.id] ?? ''}
                  onChange={(event) =>
                    setCommentDrafts((current) => ({
                      ...current,
                      [selectedPost.id]: event.target.value,
                    }))
                  }
                />
              </label>
              <button className="primary-button" type="submit">Post comment</button>
            </form>
          </section>
        </article>
      </section>
    </>
  )
}

export default BlogDetailPage
