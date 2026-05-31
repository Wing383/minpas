import { useEffect, useRef, useState } from 'react'
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

//古いレビューでのエラー対策
function reviewTimeValue(review) {
  if (review.createdAt) {
    return review.createdAt
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
              className={`autocomplete-item${
                index === highlighted ? ' autocomplete-item--active' : ''
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

  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem(STORAGE_KEY)

    if (savedReviews) {
      try {
        return JSON.parse(savedReviews)
      } catch {
        return createInitialReviews()
      }
    }

    return createInitialReviews()
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  }, [reviews])

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
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedCourse) {
      setErrorMessage('口コミを投稿する授業を選択してください。')
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

    const createdAt = Date.now()

    const newReview = {
      id: createdAt,
      courseName: selectedCourse.name,
      teacher: selectedCourse.teachers[0],
      faculty: selectedCourse.faculty,
      comment: trimmedComment,
      year: new Date().getFullYear(),
      semester: '未設定',
      date: getTodayString(),
      time: getCurrentTimeString(),
      createdAt,
    }

    setReviews((prev) => [newReview, ...prev])
    setComment('')
    setErrorMessage('')
    setSuccessMessage('口コミを投稿しました。')
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
                  <span className="review-faculty-badge">{review.faculty}</span>
                </div>

                <p className="review-comment">{review.comment}</p>

                <div className="review-card-footer">
                  <span className="review-teacher-name">
                    担当教員：{review.teacher}
                  </span>
                  <span className="review-date">
                    {review.date}{review.time ? ` ${review.time}` : ''}
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