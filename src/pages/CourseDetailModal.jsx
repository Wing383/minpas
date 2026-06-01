import { useEffect } from 'react'
import '../pages-styles/CourseDetailModal.css'

const DEFAULT_COURSE = {
  id: '2125295nh1',
  code: '2125295nh1',
  name: '現代マスコミ論',
  facultyCode: 'RD',
  term: '前期',
  grade: 2,
  day: '月',
  period: 2,
  credits: 2,
  classType: '講義',
  requirement: '選択',
  courseCategory: '(RD)',
  mainSub: '主',
  teacherType: '常勤',
  teacher: '中山　洋',
  classroom: '204',
  curriculumYears: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
  otherCourses: '',
  note: '',
}

const SAMPLE_REVIEWS = [
  {
    id: 1,
    rating: 4,
    difficulty: 'まぁ楽勝',
    comment: '授業内容はわかりやすく、出席していれば理解しやすい授業でした。',
    date: '2026-04-15',
  },
  {
    id: 2,
    rating: 3,
    difficulty: '普通',
    comment: 'レポートやテストの情報はまだ少ないですが、授業自体は受けやすい印象です。',
    date: '2026-04-20',
  },
]

function CourseDetailModal({
  course = DEFAULT_COURSE,
  reviews = SAMPLE_REVIEWS,
  onClose,
  onReviewClick,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleOverlayClick = () => {
    onClose()
  }

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleReviewClick = () => {
    if (onReviewClick) {
      onReviewClick(course)
    }
  }

  return (
    <div
      className="course-detail-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <section
        className="course-detail-modal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-detail-title"
      >
        <div className="course-detail-header">
          <div className="course-detail-title-area">
            <span className="course-detail-badge">{course.facultyCode}</span>
            <h2 id="course-detail-title" className="course-detail-title">
              {course.name}
            </h2>
            <p className="course-detail-subtitle">
              {course.teacher} / {course.term} / {course.day曜}{course.period}限
            </p>
          </div>

          <button
            type="button"
            className="course-detail-close-btn"
            onClick={onClose}
            aria-label="詳細ウィンドウを閉じる"
          >
            ×
          </button>
        </div>

        <div className="course-detail-actions">
          <button
            type="button"
            className="course-detail-review-btn"
            onClick={handleReviewClick}
          >
            口コミを投稿する
          </button>
        </div>

        <div className="course-detail-body">
          <div className="course-detail-section">
            <h3 className="course-detail-section-title">授業情報</h3>

            <div className="course-detail-info-grid">
              <div className="course-detail-info-item">
                <span className="course-detail-info-label">授業コード</span>
                <span className="course-detail-info-value">{course.code}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">主開講</span>
                <span className="course-detail-info-value">{course.facultyCode}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">開講学期</span>
                <span className="course-detail-info-value">{course.term}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">配当学年</span>
                <span className="course-detail-info-value">{course.grade}年</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">曜日・時限</span>
                <span className="course-detail-info-value">
                  {course.day曜}{course.period}限
                </span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">単位</span>
                <span className="course-detail-info-value">{course.credits}単位</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">授業形態</span>
                <span className="course-detail-info-value">{course.classType}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">必選区分</span>
                <span className="course-detail-info-value">{course.requirement}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">コース区分</span>
                <span className="course-detail-info-value">{course.courseCategory}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">担当者</span>
                <span className="course-detail-info-value">{course.teacher}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">教室</span>
                <span className="course-detail-info-value">{course.classroom}</span>
              </div>

              <div className="course-detail-info-item">
                <span className="course-detail-info-label">主・副</span>
                <span className="course-detail-info-value">{course.mainSub}</span>
              </div>
            </div>
          </div>

          <div className="course-detail-section">
            <h3 className="course-detail-section-title">対応カリキュラム年度</h3>

            <div className="course-detail-year-list">
              {course.curriculumYears.map((year) => (
                <span key={year} className="course-detail-year-tag">
                  {year}
                </span>
              ))}
            </div>
          </div>

          {(course.otherCourses || course.note) && (
            <div className="course-detail-section">
              <h3 className="course-detail-section-title">備考</h3>

              {course.otherCourses && (
                <p className="course-detail-note">
                  他学系の同時開講科目：{course.otherCourses}
                </p>
              )}

              {course.note && (
                <p className="course-detail-note">
                  {course.note}
                </p>
              )}
            </div>
          )}

          <div className="course-detail-section course-detail-review-section">
            <div className="course-detail-review-header">
              <h3 className="course-detail-section-title">口コミ</h3>
              <span className="course-detail-review-count">
                {reviews.length}件
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="course-detail-review-list">
                {reviews.map((review) => (
                  <article key={review.id} className="course-detail-review-card">
                    <div className="course-detail-review-rating">
                      <span className="course-detail-review-stars">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="course-detail-review-difficulty">
                        {review.difficulty}
                      </span>
                    </div>

                    <p className="course-detail-review-comment">
                      {review.comment}
                    </p>

                    <div className="course-detail-review-date">
                      {review.date}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="course-detail-review-empty">
                まだ口コミは投稿されていません。
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetailModal