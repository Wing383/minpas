import { useState } from 'react'
import '../pages-styles/ReviewsPage.css'

const SAMPLE_REVIEWS = [
  { id: 1, courseName: 'プログラミング基礎', teacher: '田中 太郎', faculty: 'システムデザイン工学部', stars: 4, difficulty: 'まぁ楽勝', comment: '先生の説明がわかりやすく、課題も適度な難易度でした。', year: 2026, semester: '前期', date: '2026-04-15', likes: 23 },
  { id: 2, courseName: '線形代数I', teacher: '佐藤 花子', faculty: '理工学部', stars: 2, difficulty: 'やや厳しい', comment: '証明問題が多く、テスト範囲が広い。しっかり勉強する必要あり。', year: 2026, semester: '前期', date: '2026-04-10', likes: 15 },
  { id: 3, courseName: '英語コミュニケーション', teacher: 'Smith John', faculty: '未来科学部', stars: 5, difficulty: 'かなり楽勝', comment: '出席とレポートだけで単位が取れます。おすすめ。', year: 2025, semester: '後期', date: '2026-03-20', likes: 42 },
  { id: 4, courseName: '電気回路理論', teacher: '山田 一郎', faculty: '工学部', stars: 1, difficulty: 'かなり厳しい', comment: 'テストがかなり難しい。過去問が役に立たない。覚悟が必要。', year: 2025, semester: '後期', date: '2026-02-28', likes: 31 },
  { id: 5, courseName: 'データベース論', teacher: '鈴木 次郎', faculty: 'システムデザイン工学部', stars: 3, difficulty: '普通', comment: 'SQL実習があるので実践的。テストは持ち込み可。', year: 2026, semester: '前期', date: '2026-04-05', likes: 18 },
]

function ReviewsPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [filterStars, setFilterStars] = useState(0)

  const filtered = SAMPLE_REVIEWS
    .filter(r => filterStars === 0 || r.stars === filterStars)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'likes') return b.likes - a.likes
      if (sortBy === 'rating-high') return b.stars - a.stars
      return a.stars - b.stars
    })

  return (
    <main className="reviews-page">
      <div className="reviews-container">
        <div className="reviews-page-header">
          <h1 className="reviews-title">💬 口コミ一覧</h1>
          <p className="reviews-subtitle">みんなの授業体験をチェック</p>
        </div>

        <div className="reviews-controls">
          <div className="reviews-filter">
            <span className="reviews-filter-label">楽単度フィルター</span>
            <div className="reviews-star-filter">
              <button className={`star-filter-btn ${filterStars === 0 ? 'star-filter-btn--active' : ''}`} onClick={() => setFilterStars(0)}>すべて</button>
              {[5, 4, 3, 2, 1].map(s => (
                <button key={s} className={`star-filter-btn ${filterStars === s ? 'star-filter-btn--active' : ''}`} onClick={() => setFilterStars(s)}>{'★'.repeat(s)}</button>
              ))}
            </div>
          </div>
          <div className="reviews-sort">
            <select id="sort-select" className="reviews-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">新着順</option>
              <option value="likes">いいね順</option>
              <option value="rating-high">楽単度（高い順）</option>
              <option value="rating-low">楽単度（低い順）</option>
            </select>
          </div>
        </div>

        <div className="reviews-list">
          {filtered.map((r, i) => (
            <div key={r.id} className="review-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="review-card-header">
                <h3 className="review-course-name">{r.courseName}</h3>
                <span className="review-faculty-badge">{r.faculty}</span>
              </div>
              <div className="review-rating-row">
                <span className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                <span className="review-difficulty-tag">{r.difficulty}</span>
                <span className="review-semester-tag">{r.year} {r.semester}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
              <div className="review-card-footer">
                <span className="review-teacher-name">👨‍🏫 {r.teacher}</span>
                <span className="review-date">{r.date}</span>
                <button className="review-like-btn">👍 {r.likes}</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="reviews-empty"><div className="reviews-empty-icon">🔍</div><p>該当する口コミがありません</p></div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ReviewsPage
