import { useState } from 'react'
import { api } from '../data/api'
import type { NavigateTo } from '../types/navigation'
import { useApi } from '../hooks/useApi'

type BlogDetailPageProps = {
  navigateTo: NavigateTo
}

function BlogDetailPage({ navigateTo }: BlogDetailPageProps) {
  const postId = new URLSearchParams(window.location.search).get('post')
  const { data: selectedPost, isLoading, error } = useApi(() => api.blogs.get(postId || ''), [postId])
  
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [localComments, setLocalComments] = useState<string[]>([])
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

    setLocalComments((current) => [...current, draft])
    setCommentDrafts((current) => ({ ...current, [postIdToCommentOn]: '' }))
  }

  if (isLoading) return <div className="p-20 text-center">Loading article...</div>
  if (error) return <div className="p-20 text-center form-error">Unable to load article: {error}</div>
  if (!selectedPost) return <div className="p-20 text-center">Article not found.</div>

  const allComments = [
    ...(selectedPost.comments?.map(c => c.content) || []),
    ...localComments
  ]

  return (
    <>
      <section
        className="page-hero page-hero-with-image blog-detail-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54)), url(${selectedPost.image_url})`,
        }}
      >
        <div className="page-hero-copy">
          <button className="back-button" type="button" onClick={() => navigateTo('/blogs')}>
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            Back to blogs
          </button>
          <p className="eyebrow">Updates</p>
          <h1>{selectedPost.title}</h1>
          <p className="hero-text">{selectedPost.description.slice(0, 160)}...</p>
        </div>
      </section>

      <section className="blogs-section">
        <article className="blog-detail" aria-labelledby="selected-blog-title">
          <img className="blog-detail-image" src={selectedPost.image_url} alt={selectedPost.title} loading="lazy" decoding="async" />
          <div className="blog-detail-header">
            <div>
              <div className="blog-meta">
                <span>Updates</span>
                <span>5 min read</span>
              </div>
              <h2 id="selected-blog-title">{selectedPost.title}</h2>
            </div>
            <button
              className={postId && likedPosts.includes(postId) ? 'like-button active' : 'like-button'}
              type="button"
              onClick={() => postId && toggleLike(postId)}
              aria-pressed={postId ? likedPosts.includes(postId) : false}
            >
              <span className="material-symbols-outlined" aria-hidden="true">favorite</span>
              {postId && likedPosts.includes(postId) ? 1 : 0}
            </button>
          </div>

          <div className="blog-body">
            <p>{selectedPost.description}</p>
          </div>

          <section className="comments-section" aria-label="Blog comments">
            <h3>Comments</h3>
            <div className="comment-list">
              {allComments.map((comment, index) => (
                <p className="comment-item" key={index}>{comment}</p>
              ))}
            </div>
            {postId && (
              <form
                className="comment-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  addComment(postId)
                }}
              >
                <label>
                  Add a comment
                  <textarea
                    name="comment"
                    placeholder="Share your thoughts"
                    rows={3}
                    value={commentDrafts[postId] ?? ''}
                    onChange={(event) =>
                      setCommentDrafts((current) => ({
                        ...current,
                        [postId]: event.target.value,
                      }))
                    }
                  />
                </label>
                <button className="primary-button" type="submit">Post comment</button>
              </form>
            )}
          </section>
        </article>
      </section>
    </>
  )
}

export default BlogDetailPage
