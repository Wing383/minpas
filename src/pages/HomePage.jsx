import { useState } from 'react'

const DIFFICULTY_OPTIONS = [
  { stars: 1, label: 'かなり難しい' },
  { stars: 2, label: '難しい' },
  { stars: 3, label: '普通' },
  { stars: 4, label: '簡単' },
  { stars: 5, label: 'かなり簡単' },
]

const FACULTIES = [
  'システムデザイン工学部',
  '未来科学部',
  '工学部',
  '工学部第二部',
  '理工学部',
  '情報環境学部',
]

function StarRating({ count }) {
  return (
    <span className="difficulty-stars" aria-label={`星${count}つ`}>
      {'★'.repeat(count)}
    </span>
  )
}

function HomePage() {
  const [activeTab, setActiveTab] = useState('course')
  const [courseName, setCourseName] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')

  const toggleDifficulty = (stars) => {
    setSelectedDifficulties((prev) =>
      prev.includes(stars)
        ? prev.filter((s) => s !== stars)
        : [...prev, stars]
    )
  }

  const handleSearch = () => {
    console.log('検索実行:', {
      activeTab,
      courseName,
      teacherName,
      selectedDifficulties,
      selectedYear,
      selectedSemester,
      selectedFaculty,
    })
  }

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 東京電機大学 専用</div>
          <h1>授業評価・楽単情報を探す</h1>
          <p>電大生による、電大生のための授業口コミサイト</p>
        </div>
      </section>

      {/* ===== Main ===== */}
      <main className="main-content">
        {/* Search Card */}
        <div className="search-section">
          <div className="search-card">
            <div className="search-header">
              <div className="search-header-icon">🔍</div>
              <h2>授業評価・楽単情報を探す</h2>
            </div>

            <div className="search-body">
              {/* Tabs */}
              <div className="search-tabs">
                <button
                  id="tab-course"
                  className={`search-tab ${activeTab === 'course' ? 'search-tab--active' : ''}`}
                  onClick={() => setActiveTab('course')}
                >
                  授業名から探す
                </button>
                <button
                  id="tab-faculty"
                  className={`search-tab ${activeTab === 'faculty' ? 'search-tab--active' : ''}`}
                  onClick={() => setActiveTab('faculty')}
                >
                  学部学科から探す
                </button>
              </div>

              {activeTab === 'course' ? (
                <>
                  {/* Course Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-course">授業名</label>
                    <input
                      id="input-course"
                      className="form-input"
                      type="text"
                      placeholder="授業名を入力"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                  </div>

                  {/* Teacher Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-teacher">先生名</label>
                    <input
                      id="input-teacher"
                      className="form-input"
                      type="text"
                      placeholder="先生名を入力"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                    />
                  </div>

                  {/* Difficulty */}
                  <div className="difficulty-section">
                    <div className="difficulty-header">
                      <span className="form-label">楽単度</span>
                    </div>
                    <div className="difficulty-options">
                      {DIFFICULTY_OPTIONS.map((opt) => {
                        const isSelected = selectedDifficulties.includes(opt.stars)
                        return (
                          <label
                            key={opt.stars}
                            className={`difficulty-option ${isSelected ? 'difficulty-option--selected' : ''}`}
                          >
                            <input
                              className="difficulty-checkbox"
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDifficulty(opt.stars)}
                            />
                            <span className="difficulty-check">
                              <span className="difficulty-check-icon">✓</span>
                            </span>
                            <StarRating count={opt.stars} />
                            <span className="difficulty-label">：{opt.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Advanced Toggle */}
                  <button
                    id="btn-advanced"
                    className="advanced-toggle"
                    onClick={() => setAdvancedOpen(!advancedOpen)}
                  >
                    より詳しい条件で探す
                    <span className={`advanced-toggle-icon ${advancedOpen ? 'advanced-toggle-icon--open' : ''}`}>
                      ▼
                    </span>
                  </button>

                  {/* Advanced Panel */}
                  <div className={`advanced-panel ${advancedOpen ? 'advanced-panel--open' : ''}`}>
                    <div className="advanced-content">
                      <div className="advanced-row">
                        <div className="advanced-field">
                          <label className="advanced-label" htmlFor="select-year">開講年度</label>
                          <select
                            id="select-year"
                            className="advanced-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                          >
                            <option value="">すべて</option>
                            <option value="2026">2026年度</option>
                            <option value="2025">2025年度</option>
                            <option value="2024">2024年度</option>
                            <option value="2023">2023年度</option>
                          </select>
                        </div>
                        <div className="advanced-field">
                          <label className="advanced-label" htmlFor="select-semester">開講学期</label>
                          <select
                            id="select-semester"
                            className="advanced-select"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                          >
                            <option value="">すべて</option>
                            <option value="spring">前期</option>
                            <option value="fall">後期</option>
                            <option value="intensive">集中</option>
                            <option value="full">通年</option>
                          </select>
                        </div>
                      </div>
                      <div className="advanced-row">
                        <div className="advanced-field">
                          <label className="advanced-label" htmlFor="select-faculty">学部</label>
                          <select
                            id="select-faculty"
                            className="advanced-select"
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                          >
                            <option value="">すべて</option>
                            {FACULTIES.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Faculty Search Tab */
                <div className="faculty-search">
                  <p style={{ color: 'var(--text-light)', marginBottom: 12, fontSize: 14 }}>
                    学部を選択してください
                  </p>
                  <div className="faculty-grid">
                    {FACULTIES.map((f) => (
                      <button key={f} className="faculty-btn" onClick={() => console.log(f)}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className="search-btn-wrapper">
                <button id="btn-search" className="search-btn" onClick={handleSearch}>
                  検索結果を見る
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-number">1,240</div>
              <div className="stat-label">口コミ投稿数</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-number">830</div>
              <div className="stat-label">登録授業数</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">2,150</div>
              <div className="stat-label">利用ユーザー数</div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default HomePage
