import { useEffect, useState } from 'react'
import '../pages-styles/ReviewsPage.css'

const COURSE = {
  id: '2125295nh1',
  courseName: '現代マスコミ論',
  teacher: '中山　洋',
  faculty: '理工学部',
  year: 2026,
  semester: '前期',
}

const INITIAL_REVIEWS = [
  {
    id: 1,
    courseId: COURSE.id,
    courseName: COURSE.courseName,
    teacher: COURSE.teacher,
    faculty: COURSE.faculty,
    comment: '授業内容はわかりやすく、出席していれば理解しやすい授業でした。',
    year: 2026,
    semester: '前期',
    date: '2026-04-15',
  },
  {
    id: 2,
    courseId: COURSE.id,
    courseName: COURSE.courseName,
    teacher: COURSE.teacher,
    faculty: COURSE.faculty,
    comment: 'レポートやテストの情報はまだ少ないですが、授業自体は受けやすい印象です。',
    year: 2026,
    semester: '前期',
    date: '2026-04-20',
  },
]

const STORAGE_KEY = 'mindai-reviews-gendai-mass-communication'

function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const savedReviews = localStorage.getItem(STORAGE_KEY)

    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    } else {
      setReviews(INITIAL_REVIEWS)
    }
  }, [])

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    }
  }, [reviews])

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedComment = comment.trim()

    if (!trimmedComment) {
      setErrorMessage('口コミ内容を入力してください。')
      setSuccessMessage('')
      return
    }

    if (trimmedComment.length < 10) {
      setErrorMessage('口コミは10文字以上で入力してください。')
      setSuccessMessage('')
      return
    }

    const newReview = {
      id: Date.now(),
      courseId: COURSE.id,
      courseName: COURSE.courseName,
      teacher: COURSE.teacher,
      faculty: COURSE.faculty,
      comment: trimmedComment,
      year: COURSE.year,
      semester: COURSE.semester,
      date: getTodayString(),
    }

    setReviews((prev) => [newReview, ...prev])
    setComment('')
    setErrorMessage('')
    setSuccessMessage('口コミを投稿しました。')
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date)
    }

    return new Date(a.date) - new Date(b.date)
  })

  return (
    <main className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-page-header">
          <h1 className="reviews-title">口コミ投稿</h1>
          <p className="reviews-subtitle">
            今回は「現代マスコミ論」の口コミ投稿機能のみ実装しています
          </p>
        </div>

        <section className="review-post-card">
          <div className="review-post-header">
            <div>
              <h2 className="review-post-title">{COURSE.courseName}</h2>
              <p className="review-post-course-info">
                {COURSE.teacher} / {COURSE.year}年度 {COURSE.semester} / {COURSE.faculty}
              </p>
            </div>
            <span className="review-post-badge">口コミ対象</span>
          </div>

          <form className="review-post-form" onSubmit={handleSubmit}>
            <div className="review-post-field">
              <label className="review-post-label" htmlFor="review-comment">
                口コミ内容
              </label>
              <textarea
                id="review-comment"
                className="review-post-textarea"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value)
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
                placeholder="授業の雰囲気、課題、テスト、出席、単位の取りやすさなどを書いてください。"
                rows={5}
              />
              <div className="review-post-count">
                {comment.length}文字
              </div>
            </div>

            {errorMessage && (
              <p className="review-message review-message--error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="review-message review-message--success">
                {successMessage}
              </p>
            )}

            <div className="review-post-actions">
              <button type="submit" className="review-submit-btn">
                口コミを投稿する
              </button>
            </div>
          </form>
        </section>

        <div className="reviews-controls">
          <div className="reviews-sort">
            <select
              id="sort-select"
              className="reviews-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">新着順</option>
              <option value="oldest">古い順</option>
            </select>
          </div>
        </div>

        <div className="reviews-list">
          {sortedReviews.map((review, index) => (
            <div
              key={review.id}
              className="review-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="review-card-header">
                <h3 className="review-course-name">{review.courseName}</h3>
                <span className="review-faculty-badge">{review.faculty}</span>
              </div>

              <p className="review-comment">{review.comment}</p>

              <div className="review-card-footer">
                <span className="review-teacher-name">
                  担当教員：{review.teacher}
                </span>
                <span className="review-date">{review.date}</span>
              </div>
            </div>
          ))}

          {sortedReviews.length === 0 && (
            <div className="reviews-empty">
              <p>まだ口コミが投稿されていません</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ReviewsPage