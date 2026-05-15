import { useParams, Link } from 'react-router-dom'
import { getMockCourse } from '../data/mockCourses'
import { ALL_COURSES } from '../data/allCourses'
import '../pages-styles/CoursePage.css'

function Stars({ value }) {
  return (
    <span className="cp-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? 'cp-star cp-star--on' : 'cp-star'}>★</span>
      ))}
    </span>
  )
}

function StarRow({ label, value }) {
  return (
    <div className="cp-star-row">
      <span className="cp-star-label">{label}</span>
      <Stars value={value} />
      <span className="cp-star-val">{value.toFixed(1)}</span>
    </div>
  )
}

export default function CoursePage() {
  const { id } = useParams()
  const courseName = decodeURIComponent(id)

  // CSVの全科目から基本情報を取得
  const baseInfo = ALL_COURSES.find((c) => c.name === courseName)
  // モックデータから口コミを取得（なければnull）
  const mock = getMockCourse(courseName)

  if (!baseInfo) {
    return (
      <div className="cp-not-found">
        <p>科目が見つかりませんでした。</p>
        <Link to="/" className="cp-back-link">← トップに戻る</Link>
      </div>
    )
  }

  const reviewCount = mock ? mock.reviews.length : 0
  const displayTeacher = mock ? mock.teacher : baseInfo.teachers[0]

  return (
    <div className="cp-page">
      {/* パンくず */}
      <div className="cp-breadcrumb">
        <Link to="/">ホーム</Link>
        <span className="cp-breadcrumb-sep">›</span>
        <span>{courseName}</span>
      </div>

      {/* ヘッダーカード */}
      <div className="cp-header-card">
        <div className="cp-badge">{courseName.charAt(0)}</div>
        <div className="cp-header-info">
          <h1 className="cp-course-name">{courseName}</h1>
          <p className="cp-teacher">👨‍🏫 {displayTeacher}先生</p>
          <p className="cp-faculty">🏫 {baseInfo.faculty}</p>
          {baseInfo.teachers.length > 1 && (
            <p className="cp-teachers-all">他の担当者：{baseInfo.teachers.slice(1).join('、')}先生</p>
          )}
        </div>
        <div className="cp-review-count">
          <span className="cp-review-num">{reviewCount}</span>
          <span className="cp-review-unit">件の口コミ</span>
        </div>
      </div>

      {mock ? (
        <>
          {/* 平均スコア */}
          <div className="cp-score-card">
            <h2 className="cp-score-title">📊 平均評価</h2>
            <StarRow label="充実度" value={mock.avgContent} />
            <StarRow label="楽単度" value={mock.avgEasy} />
          </div>

          {/* 口コミ一覧 */}
          <div className="cp-reviews">
            <h2 className="cp-reviews-title">💬 口コミ一覧</h2>
            {mock.reviews.map((r, i) => (
              <div key={i} className="cp-review-card">
                <div className="cp-review-header">
                  <span className="cp-review-num-badge">#{i + 1}</span>
                  <div className="cp-review-scores">
                    <StarRow label="充実" value={r.content} />
                    <StarRow label="楽単" value={r.easy} />
                  </div>
                </div>
                <p className="cp-review-text">{r.comment}</p>
                <div className="cp-review-meta">
                  <span>📅 {r.year}年度</span>
                  <span>📚 {r.semester}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="cp-no-reviews">
          <div className="cp-no-reviews-icon">📭</div>
          <p>まだ口コミが投稿されていません</p>
          <p className="cp-no-reviews-sub">最初の口コミを投稿しませんか？</p>
        </div>
      )}
    </div>
  )
}
