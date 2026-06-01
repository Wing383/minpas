import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuth } from '../contexts/AuthContext'
import { ALL_COURSES } from '../data/allCourses'
import { getSyllabusDetail } from '../data/syllabusData'
import '../pages-styles/CoursePage.css'

// ---- 星コンポーネント ----
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
      <span className="cp-star-val">{Number(value).toFixed(1)}</span>
    </div>
  )
}

// ---- 星選択ボタン ----
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-selector">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hovered || value) ? 'star-btn--on' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
    </div>
  )
}

// ---- メイン ----
export default function CoursePage() {
  const { id } = useParams()
  const courseName = decodeURIComponent(id)
  const { user, isLoggedIn, loginWithGoogle } = useAuth()

  // CSVデータから基本情報
  const baseInfo = ALL_COURSES.find((c) => c.name === courseName)
  const syllabus = baseInfo ? getSyllabusDetail(courseName, baseInfo.faculty) : null

  // Firestoreの口コミ
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  // フォームのState
  const [contentScore, setContentScore] = useState(0)
  const [easyScore, setEasyScore] = useState(0)
  const [comment, setComment] = useState('')
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Firestoreからリアルタイム取得
  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('courseName', '==', courseName),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setLoadingReviews(false)
    })
    return () => unsub()
  }, [courseName])

  // 平均スコア計算
  const avgContent = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.contentScore, 0) / reviews.length
    : null
  const avgEasy = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.easyScore, 0) / reviews.length
    : null

  // 投稿処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (contentScore === 0 || easyScore === 0) { setSubmitError('充実度と楽単度を選択してください'); return }
    if (comment.trim().length < 10) { setSubmitError('コメントは10文字以上で入力してください'); return }
    if (!semester || !year) { setSubmitError('学期と年度を選択してください'); return }

    setSubmitting(true)
    setSubmitError('')
    try {
      await addDoc(collection(db, 'reviews'), {
        courseName,
        contentScore,
        easyScore,
        comment: comment.trim(),
        semester,
        year: Number(year),
        uid: user.uid,
        userName: user.displayName || '匿名',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      setContentScore(0); setEasyScore(0); setComment(''); setSemester(''); setYear('')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error(err)
      setSubmitError('投稿に失敗しました。もう一度お試しください。')
    } finally {
      setSubmitting(false)
    }
  }

  if (!baseInfo) {
    return (
      <div className="cp-not-found">
        <p>科目が見つかりませんでした。</p>
        <Link to="/" className="cp-back-link">← トップに戻る</Link>
      </div>
    )
  }

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
          <p className="cp-teacher">👨‍🏫 {baseInfo.teachers[0]}先生</p>
          <p className="cp-faculty">🏫 {baseInfo.faculty}</p>
          {baseInfo.teachers.length > 1 && (
            <p className="cp-teachers-all">他の担当者：{baseInfo.teachers.slice(1).join('、')}先生</p>
          )}
        </div>
        <div className="cp-review-count">
          <span className="cp-review-num">{reviews.length}</span>
          <span className="cp-review-unit">件の口コミ</span>
        </div>
      </div>

      {/* 平均スコア */}
      {avgContent !== null && (
        <div className="cp-score-card">
          <h2 className="cp-score-title">📊 平均評価</h2>
          <StarRow label="充実度" value={avgContent} />
          <StarRow label="楽単度" value={avgEasy} />
        </div>
      )}

      {/* 授業詳細（シラバス）情報 */}
      {syllabus && (
        <div className="cp-details-card">
          <h2 className="cp-details-title">📄 授業詳細情報</h2>
          <div className="cp-details-grid">
            <div className="cp-detail-item">
              <span className="cp-detail-label">開講情報</span>
              <span className="cp-detail-value">{syllabus.dayPeriod}</span>
            </div>
            <div className="cp-detail-item">
              <span className="cp-detail-label">単位数</span>
              <span className="cp-detail-value">{syllabus.credits}単位</span>
            </div>
            <div className="cp-detail-item">
              <span className="cp-detail-label">教室</span>
              <span className="cp-detail-value">{syllabus.classroom}</span>
            </div>
            <div className="cp-detail-item cp-detail-item--full">
              <span className="cp-detail-label">教科書</span>
              <span className="cp-detail-value">{syllabus.textbook}</span>
            </div>
          </div>

          <div className="cp-details-section">
            <h3 className="cp-details-subtitle">💡 授業概要</h3>
            <p className="cp-details-text">{syllabus.overview}</p>
          </div>

          <div className="cp-details-section">
            <h3 className="cp-details-subtitle">🎯 評価割合</h3>
            <div className="cp-grading-list">
              {syllabus.grading.exam > 0 && (
                <div className="cp-grading-item">
                  <div className="cp-grading-header">
                    <span className="cp-grading-label">期末試験</span>
                    <span className="cp-grading-percent">{syllabus.grading.exam}%</span>
                  </div>
                  <div className="cp-grading-bar-bg">
                    <div className="cp-grading-bar cp-grading-bar--exam" style={{ width: `${syllabus.grading.exam}%` }}></div>
                  </div>
                </div>
              )}
              {syllabus.grading.report > 0 && (
                <div className="cp-grading-item">
                  <div className="cp-grading-header">
                    <span className="cp-grading-label">レポート・課題</span>
                    <span className="cp-grading-percent">{syllabus.grading.report}%</span>
                  </div>
                  <div className="cp-grading-bar-bg">
                    <div className="cp-grading-bar cp-grading-bar--report" style={{ width: `${syllabus.grading.report}%` }}></div>
                  </div>
                </div>
              )}
              {syllabus.grading.attendance > 0 && (
                <div className="cp-grading-item">
                  <div className="cp-grading-header">
                    <span className="cp-grading-label">平常点・出席</span>
                    <span className="cp-grading-percent">{syllabus.grading.attendance}%</span>
                  </div>
                  <div className="cp-grading-bar-bg">
                    <div className="cp-grading-bar cp-grading-bar--attendance" style={{ width: `${syllabus.grading.attendance}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* 口コミ一覧 */}
      <div className="cp-reviews">
        <h2 className="cp-reviews-title">💬 口コミ一覧</h2>
        {loadingReviews ? (
          <div className="cp-loading">読み込み中...</div>
        ) : reviews.length === 0 ? (
          <div className="cp-no-reviews">
            <div className="cp-no-reviews-icon">📭</div>
            <p>まだ口コミが投稿されていません</p>
            <p className="cp-no-reviews-sub">最初の口コミを投稿しませんか？</p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={r.id} className="cp-review-card">
              <div className="cp-review-header">
                <span className="cp-review-num-badge">#{i + 1}</span>
                <div className="cp-review-scores">
                  <StarRow label="充実" value={r.contentScore} />
                  <StarRow label="楽単" value={r.easyScore} />
                </div>
              </div>
              <p className="cp-review-text">{r.comment}</p>
              <div className="cp-review-meta">
                <span>👤 {r.userName}</span>
                <span>📅 {r.year}年度</span>
                <span>📚 {r.semester}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
