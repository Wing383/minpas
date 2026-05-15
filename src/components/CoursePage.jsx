import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  collection, query, where, orderBy,
  onSnapshot, addDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuth } from '../contexts/AuthContext'
import { ALL_COURSES } from '../data/allCourses'
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

      {/* 口コミ投稿フォーム */}
      <div className="review-form-section">
        <h2 className="cp-reviews-title">✏️ 口コミを投稿する</h2>

        {!isLoggedIn ? (
          <div className="review-login-prompt">
            <p>口コミを投稿するにはログインが必要です</p>
            <button className="review-login-btn" onClick={loginWithGoogle}>
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
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-row">
              <div className="review-form-field">
                <label className="review-form-label">充実度</label>
                <StarSelector value={contentScore} onChange={setContentScore} />
              </div>
              <div className="review-form-field">
                <label className="review-form-label">楽単度</label>
                <StarSelector value={easyScore} onChange={setEasyScore} />
              </div>
            </div>
            <div className="review-form-row">
              <div className="review-form-field">
                <label className="review-form-label">開講年度</label>
                <select className="review-form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">選択</option>
                  <option value="2026">2026年度</option>
                  <option value="2025">2025年度</option>
                  <option value="2024">2024年度</option>
                </select>
              </div>
              <div className="review-form-field">
                <label className="review-form-label">学期</label>
                <select className="review-form-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="">選択</option>
                  <option value="前期">前期</option>
                  <option value="後期">後期</option>
                  <option value="集中">集中</option>
                  <option value="通年">通年</option>
                </select>
              </div>
            </div>
            <div className="review-form-field">
              <label className="review-form-label">コメント（10文字以上）</label>
              <textarea
                className="review-form-textarea"
                placeholder="授業の内容・テスト・課題などについて書いてください"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <span className="review-form-charcount">{comment.length}文字</span>
            </div>
            {submitError && <p className="review-form-error">{submitError}</p>}
            {submitted && <p className="review-form-success">✅ 投稿しました！</p>}
            <button type="submit" className="review-submit-btn" disabled={submitting}>
              {submitting ? '投稿中...' : '口コミを投稿する'}
            </button>
          </form>
        )}
      </div>

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
