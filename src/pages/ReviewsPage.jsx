import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase/firebase'
import { useAuth } from '../contexts/AuthContext'
import {
  collection, query, orderBy,
  onSnapshot, addDoc, serverTimestamp,
} from 'firebase/firestore'
import '../pages-styles/ReviewsPage.css'

import { COURSE_NAMES, TEACHER_NAMES } from '../data/courseData'
import { ALL_COURSES } from '../data/allCourses'
import { MOCK_COURSES } from '../data/mockCourses'

const STORAGE_KEY = 'minden-reviews'

function normalizeText(text) {
  return String(text || '').replace(/\s/g, '')
}

function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getCurrentTimeString() {
  const now = new Date()
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')

  return `${hour}:${minute}`
}

// 星選択ボタン
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-selector" style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hovered || value) ? 'star-btn--on' : ''}`}
          style={{
            fontSize: '24px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: n <= (hovered || value) ? 'var(--star-color)' : 'var(--border)',
            padding: 0,
            lineHeight: 1,
            transition: 'color 0.15s'
          }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  )
}

function formatReviewDate(createdAt) {
  if (!createdAt) return ''
  let dateObj;
  if (typeof createdAt.toDate === 'function') {
    dateObj = createdAt.toDate()
  } else if (createdAt instanceof Date) {
    dateObj = createdAt
  } else if (typeof createdAt === 'number') {
    dateObj = new Date(createdAt)
  } else if (createdAt.seconds !== undefined) {
    dateObj = new Date(createdAt.seconds * 1000)
  } else {
    dateObj = new Date(createdAt)
  }

  if (isNaN(dateObj.getTime())) return ''
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  const hh = String(dateObj.getHours()).padStart(2, '0')
  const mm = String(dateObj.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}`
}

//古いレビューでのエラー対策
function reviewTimeValue(review) {
  if (review.createdAt) {
    if (typeof review.createdAt.toMillis === 'function') {
      return review.createdAt.toMillis()
    }
    if (review.createdAt.seconds !== undefined) {
      return review.createdAt.seconds * 1000
    }
    return new Date(review.createdAt).getTime()
  }

  if (review.date && review.time) {
    return new Date(`${review.date}T${review.time}:00`).getTime()
  }

  return new Date(review.date).getTime()
}

function createInitialReviews() {
  return MOCK_COURSES.flatMap((course) =>
    course.reviews.map((review, index) => ({
      id: `${course.name}-${index}`,
      courseName: course.name,
      teacher: course.teacher,
      faculty: course.faculty,
      comment: review.comment,
      year: review.year,
      semester: review.semester,
      date: `${review.year}-04-01`,
      time: '00:00',
      createdAt: new Date(`${review.year}-04-01T00:00:00`).getTime() + index,
    }))
  )
}

function AutocompleteInput({ id, placeholder, value, onChange, suggestions }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef(null)

  const filtered =
    value.trim() === ''
      ? []
      : suggestions
        .filter((suggestion) =>
          normalizeText(suggestion).includes(normalizeText(value))
        )
        .slice(0, 10)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSelect = (item) => {
    onChange(item)
    setOpen(false)
    setHighlighted(-1)
  }

  const handleKeyDown = (e) => {
    if (!open || filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((current) => Math.min(current + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((current) => Math.max(current - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      handleSelect(filtered[highlighted])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="review-autocomplete-wrapper">
      <input
        id={id}
        className="form-input"
        type="text"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setHighlighted(-1)
        }}
        onFocus={() => {
          if (value.trim() !== '') {
            setOpen(true)
          }
        }}
        onKeyDown={handleKeyDown}
      />

      {open && filtered.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {filtered.map((item, index) => (
            <li
              key={item}
              className={`autocomplete-item${index === highlighted ? ' autocomplete-item--active' : ''
                }`}
              role="option"
              aria-selected={index === highlighted}
              onMouseDown={() => handleSelect(item)}
              onMouseEnter={() => setHighlighted(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ReviewCourseCard({ course, reviewCount, onSelect }) {
  const mockCourse = MOCK_COURSES.find((item) => item.name === course.name)
  const teacher = mockCourse ? mockCourse.teacher : course.teachers[0]

  return (
    <button
      type="button"
      className="review-course-card"
      onClick={() => onSelect(course)}
    >
      <div className="review-course-card-main">
        <div className="review-course-card-name">{course.name}</div>
        <div className="review-course-card-meta">
          担当教員：{teacher} / {course.faculty}
        </div>
      </div>

      <div className="review-course-card-side">
        <span className="review-course-card-count">{reviewCount}件</span>
        <span className="review-course-card-action">投稿する</span>
      </div>
    </button>
  )
}

function ReviewsPage() {
  const [courseName, setCourseName] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [comment, setComment] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // 新しく追加するフォーム項目
  const [contentScore, setContentScore] = useState(0)
  const [easyScore, setEasyScore] = useState(0)
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')

  const { user, isLoggedIn, loginWithGoogle } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  // Firestoreからすべての口コミをリアルタイム監視取得
  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setLoadingReviews(false)
    }, (error) => {
      console.error("Firestore loading error:", error)
      setLoadingReviews(false)
    })
    return () => unsub()
  }, [])

  const handleSearch = () => {
    const nameQuery = normalizeText(courseName)
    const teacherQuery = normalizeText(teacherName)

    const results = ALL_COURSES.filter((course) => {
      const nameMatch =
        nameQuery === '' || normalizeText(course.name).includes(nameQuery)

      const teacherMatch =
        teacherQuery === '' ||
        course.teachers.some((teacher) =>
          normalizeText(teacher).includes(teacherQuery)
        )

      return nameMatch && teacherMatch
    })

    setSearchResults(results)
    setSelectedCourse(null)
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSelectCourse = (course) => {
    setSelectedCourse(course)
    setComment('')
    setContentScore(0)
    setEasyScore(0)
    setSemester('')
    setYear('')
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCourse) {
      setErrorMessage('口コミを投稿する授業を選択してください。')
      setSuccessMessage('')
      return
    }

    if (contentScore === 0 || easyScore === 0) {
      setErrorMessage('充実度と楽単度を選択してください。')
      setSuccessMessage('')
      return
    }

    if (!semester || !year) {
      setErrorMessage('学期と年度を選択してください。')
      setSuccessMessage('')
      return
    }

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

    try {
      await addDoc(collection(db, 'reviews'), {
        courseName: selectedCourse.name,
        teacher: selectedCourse.teachers[0],
        faculty: selectedCourse.faculty,
        contentScore,
        easyScore,
        comment: trimmedComment,
        semester,
        year: Number(year),
        uid: user.uid,
        userName: user.displayName || '匿名',
        createdAt: serverTimestamp(),
      })

      setComment('')
      setContentScore(0)
      setEasyScore(0)
      setSemester('')
      setYear('')
      setErrorMessage('')
      setSuccessMessage('✅ 口コミを投稿しました！')

      // 成功メッセージは一定時間で消す
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setErrorMessage('投稿に失敗しました。もう一度お試しください。')
      setSuccessMessage('')
    }
  }

  const getReviewCount = (courseNameValue) => {
    return reviews.filter((review) => review.courseName === courseNameValue).length
  }

  const displayReviews = selectedCourse
    ? [...reviews]
      .filter((review) => review.courseName === selectedCourse.name)
      .sort((a, b) => {
        const aTime = reviewTimeValue(a)
        const bTime = reviewTimeValue(b)

        if (sortBy === 'oldest') {
          return aTime - bTime
        }

        return bTime - aTime
      })
    : []

  return (
    <main className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-page-header">
          <h1 className="reviews-title">口コミ投稿</h1>
          <p className="reviews-subtitle">
            授業を検索して、選択した授業に口コミを投稿できます
          </p>
        </div>

        <section className="review-search-section">
          <div className="search-card">
            <div className="search-header">
              <div className="search-header-icon">検索</div>
              <h2>口コミを投稿する授業を探す</h2>
            </div>

            <div className="search-body">
              <div className="form-group">
                <label className="form-label" htmlFor="review-course-search">
                  授業名
                </label>
                <AutocompleteInput
                  id="review-course-search"
                  placeholder="授業名を入力"
                  value={courseName}
                  onChange={setCourseName}
                  suggestions={COURSE_NAMES}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="review-teacher-search">
                  先生名
                </label>
                <AutocompleteInput
                  id="review-teacher-search"
                  placeholder="担当者を入力"
                  value={teacherName}
                  onChange={setTeacherName}
                  suggestions={TEACHER_NAMES}
                />
              </div>

              <div className="search-btn-wrapper">
                <button
                  id="btn-review-search"
                  type="button"
                  className="search-btn"
                  onClick={handleSearch}
                >
                  検索結果を見る
                </button>
              </div>
            </div>
          </div>
        </section>

        {searchResults !== null && (
          <section className="review-search-result-section">
            <div className="review-section-heading">
              <h2 className="review-section-title">検索結果</h2>
              <span className="review-section-count">
                {searchResults.length}件
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="reviews-empty">
                <p>該当する授業が見つかりませんでした。</p>
                <p>別の授業名または先生名で検索してください。</p>
              </div>
            ) : (
              <div className="review-course-list">
                {searchResults.map((course) => (
                  <ReviewCourseCard
                    key={course.name}
                    course={course}
                    reviewCount={getReviewCount(course.name)}
                    onSelect={handleSelectCourse}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        <section className="review-post-card">
          <div className="review-post-header">
            <div>
              <h2 className="review-post-title">口コミを投稿する</h2>
              <p className="review-post-course-info">
                {selectedCourse
                  ? `${selectedCourse.name} / ${selectedCourse.teachers[0]} / ${selectedCourse.faculty}`
                  : '検索結果から授業を選択してください'}
              </p>
            </div>

            {selectedCourse && (
              <span className="review-post-badge">選択中</span>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="review-login-prompt" style={{ textAlign: 'center', padding: '24px 0 8px', color: 'var(--text-light)', fontSize: '14px' }}>
              <p>口コミを投稿するにはログインが必要です</p>
              <button
                type="button"
                className="review-login-btn"
                onClick={loginWithGoogle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Googleでログインして投稿
              </button>
            </div>
          ) : (
            <form className="review-post-form" onSubmit={handleSubmit}>
              <div className="review-form-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <div className="review-post-field" style={{ flex: 1, minWidth: '120px' }}>
                  <label className="review-post-label">充実度</label>
                  <StarSelector value={contentScore} onChange={setContentScore} />
                </div>
                <div className="review-post-field" style={{ flex: 1, minWidth: '120px' }}>
                  <label className="review-post-label">楽単度</label>
                  <StarSelector value={easyScore} onChange={setEasyScore} />
                </div>
              </div>

              <div className="review-form-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <div className="review-post-field" style={{ flex: 1, minWidth: '120px' }}>
                  <label className="review-post-label" htmlFor="review-year">開講年度</label>
                  <select
                    id="review-year"
                    className="reviews-sort-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ width: '100%' }}
                    disabled={!selectedCourse}
                  >
                    <option value="">選択</option>
                    <option value="2026">2026年度</option>
                    <option value="2025">2025年度</option>
                    <option value="2024">2024年度</option>
                  </select>
                </div>
                <div className="review-post-field" style={{ flex: 1, minWidth: '120px' }}>
                  <label className="review-post-label" htmlFor="review-semester">学期</label>
                  <select
                    id="review-semester"
                    className="reviews-sort-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    style={{ width: '100%' }}
                    disabled={!selectedCourse}
                  >
                    <option value="">選択</option>
                    <option value="前期">前期</option>
                    <option value="後期">後期</option>
                    <option value="集中">集中</option>
                    <option value="通年">通年</option>
                  </select>
                </div>
              </div>

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
                  disabled={!selectedCourse}
                />
                <div className="review-post-count">{comment.length}文字</div>
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
                <button
                  type="submit"
                  className="review-submit-btn"
                  disabled={!selectedCourse}
                >
                  口コミを投稿する
                </button>
              </div>
            </form>
          )}
        </section>

        <div className="review-section-heading">
          <h2 className="review-section-title">
            {selectedCourse ? `${selectedCourse.name}の口コミ` : '口コミ一覧'}
          </h2>

          {selectedCourse && (
            <span className="review-section-count">
              {displayReviews.length}件
            </span>
          )}
        </div>

        {selectedCourse && (
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
        )}

        <div className="reviews-list">
          {!selectedCourse && (
            <div className="reviews-empty">
              <p>授業を検索し、口コミを確認したい授業を選択してください。</p>
            </div>
          )}

          {selectedCourse && displayReviews.length === 0 && (
            <div className="reviews-empty">
              <p>まだ口コミがありません</p>
            </div>
          )}

          {selectedCourse &&
            displayReviews.length > 0 &&
            displayReviews.map((review, index) => (
              <div
                key={review.id}
                className="review-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="review-card-header">
                  <h3 className="review-course-name">{review.courseName}</h3>
                  <span className="review-faculty-badge">{review.faculty || selectedCourse.faculty}</span>
                </div>

                {/* スコア表示 */}
                {(review.contentScore > 0 || review.easyScore > 0) && (
                  <div className="review-rating-row" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <span className="review-stars" style={{ display: 'flex', gap: '6px', fontSize: '13px', alignItems: 'center' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>充実</span>
                      <span style={{ color: 'var(--star-color)' }}>
                        {'★'.repeat(review.contentScore || 0)}{'☆'.repeat(5 - (review.contentScore || 0))}
                      </span>
                    </span>
                    <span className="review-stars" style={{ display: 'flex', gap: '6px', fontSize: '13px', alignItems: 'center' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>楽単</span>
                      <span style={{ color: 'var(--star-color)' }}>
                        {'★'.repeat(review.easyScore || 0)}{'☆'.repeat(5 - (review.easyScore || 0))}
                      </span>
                    </span>
                  </div>
                )}

                <p className="review-comment">{review.comment}</p>

                <div className="review-card-footer" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>👤 {review.userName || '匿名'}</span>
                  <span>📅 {review.year ? `${review.year}年度` : '未設定'}</span>
                  <span>📚 {review.semester || '未設定'}</span>
                  <span className="review-date" style={{ marginLeft: 'auto' }}>
                    ⏱️ {formatReviewDate(review.createdAt)}
                  </span>
                </div>
              </div>
            ))}

        </div>
      </div>
    </main>
  )
}

export default ReviewsPage