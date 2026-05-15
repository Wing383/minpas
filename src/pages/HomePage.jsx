import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { COURSE_NAMES, TEACHER_NAMES } from '../data/courseData'
import { MOCK_COURSES } from '../data/mockCourses'
import { ALL_COURSES } from '../data/allCourses'

const DIFFICULTY_OPTIONS = [
  { stars: 1, label: 'かなり難しい' },
  { stars: 2, label: '難しい' },
  { stars: 3, label: '普通' },
  { stars: 4, label: '簡単' },
  { stars: 5, label: 'かなり簡単' },
]

const FACULTIES = [
  'システムデザイン工学部', '未来科学部', '工学部', '工学部第二部', '理工学部', '情報環境学部',
]

function StarRating({ count }) {
  return (
    <span className="difficulty-stars" aria-label={`星${count}つ`}>{'★'.repeat(count)}</span>
  )
}

// ---- オートコンプリート ----
function AutocompleteInput({ id, placeholder, value, onChange, suggestions }) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef(null)

  const filtered = value.trim() === ''
    ? []
    : suggestions.filter((s) => s.replace(/\s/g, '').includes(value.replace(/\s/g, ''))).slice(0, 10)

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const handleSelect = (item) => { onChange(item); setOpen(false); setHighlighted(-1) }

  const handleKeyDown = (e) => {
    if (!open || filtered.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(filtered[highlighted]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        id={id} className="form-input" type="text" placeholder={placeholder}
        value={value} autoComplete="off"
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlighted(-1) }}
        onFocus={() => value.trim() !== '' && setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {filtered.map((item, i) => (
            <li key={item}
              className={`autocomplete-item${i === highlighted ? ' autocomplete-item--active' : ''}`}
              role="option" aria-selected={i === highlighted}
              onMouseDown={() => handleSelect(item)} onMouseEnter={() => setHighlighted(i)}
            >{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ---- 検索結果カード ----
function CourseResultCard({ course, index }) {
  const mock = MOCK_COURSES.find((m) => m.name === course.name)
  const reviewCount = mock ? mock.reviews.length : 0
  const firstComment = mock?.reviews[0]?.comment ?? ''
  const teacherDisplay = mock ? mock.teacher : course.teachers[0]
  const url = `/course/${encodeURIComponent(course.name)}`

  return (
    <Link to={url} className="course-card">
      <div className="course-card-left">
        <div className="course-card-badge">{index + 1}</div>
      </div>
      <div className="course-card-body">
        <div className="course-card-name">
          {course.name}
          <span className="course-card-count">({reviewCount})</span>
        </div>
        <div className="course-card-teacher">👨‍🏫 {teacherDisplay}先生</div>
        {firstComment && (
          <div className="course-card-comment">💬 {firstComment}</div>
        )}
        {mock && (
          <div className="course-card-scores">
            <span className="course-card-score-tag">充実</span>
            <span className="course-card-stars">
              {[1,2,3,4,5].map(n => (
                <span key={n} className={n <= Math.round(mock.avgContent) ? 'cs-star cs-star--on' : 'cs-star'}>★</span>
              ))}
            </span>
            <span className="course-card-score-tag">楽単</span>
            <span className="course-card-stars">
              {[1,2,3,4,5].map(n => (
                <span key={n} className={n <= Math.round(mock.avgEasy) ? 'cs-star cs-star--on' : 'cs-star'}>★</span>
              ))}
            </span>
          </div>
        )}
      </div>
      <div className="course-card-arrow">›</div>
    </Link>
  )
}

// ---- メインコンポーネント ----
function HomePage() {
  const [activeTab, setActiveTab] = useState('course')
  const [courseName, setCourseName] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [searchResults, setSearchResults] = useState(null) // null=未検索, []=0件

  const toggleDifficulty = (stars) => {
    setSelectedDifficulties((prev) =>
      prev.includes(stars) ? prev.filter((s) => s !== stars) : [...prev, stars]
    )
  }

  const handleSearch = () => {
    const nameQ = courseName.trim().replace(/\s/g, '')
    const teacherQ = teacherName.trim().replace(/\s/g, '')

    const results = ALL_COURSES.filter((c) => {
      const nameMatch = nameQ === '' || c.name.replace(/\s/g, '').includes(nameQ)
      const teacherMatch = teacherQ === '' || c.teachers.some((t) => t.replace(/\s/g, '').includes(teacherQ))
      return nameMatch && teacherMatch
    })

    setSearchResults(results)
  }

  const hasQuery = courseName.trim() !== '' || teacherName.trim() !== ''

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
                <button id="tab-course" className={`search-tab ${activeTab === 'course' ? 'search-tab--active' : ''}`} onClick={() => setActiveTab('course')}>授業名から探す</button>
                <button id="tab-faculty" className={`search-tab ${activeTab === 'faculty' ? 'search-tab--active' : ''}`} onClick={() => setActiveTab('faculty')}>学部学科から探す</button>
              </div>

              {activeTab === 'course' ? (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-course">授業名</label>
                    <AutocompleteInput id="input-course" placeholder="授業名を入力" value={courseName} onChange={setCourseName} suggestions={COURSE_NAMES} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-teacher">先生名</label>
                    <AutocompleteInput id="input-teacher" placeholder="担当者を入力" value={teacherName} onChange={setTeacherName} suggestions={TEACHER_NAMES} />
                  </div>
                  <div className="difficulty-section">
                    <div className="difficulty-header"><span className="form-label">楽単度</span></div>
                    <div className="difficulty-options">
                      {DIFFICULTY_OPTIONS.map((opt) => {
                        const isSelected = selectedDifficulties.includes(opt.stars)
                        return (
                          <label key={opt.stars} className={`difficulty-option ${isSelected ? 'difficulty-option--selected' : ''}`}>
                            <input className="difficulty-checkbox" type="checkbox" checked={isSelected} onChange={() => toggleDifficulty(opt.stars)} />
                            <span className="difficulty-check"><span className="difficulty-check-icon">✓</span></span>
                            <StarRating count={opt.stars} />
                            <span className="difficulty-label">：{opt.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <button id="btn-advanced" className="advanced-toggle" onClick={() => setAdvancedOpen(!advancedOpen)}>
                    より詳しい条件で探す
                    <span className={`advanced-toggle-icon ${advancedOpen ? 'advanced-toggle-icon--open' : ''}`}>▼</span>
                  </button>
                  <div className={`advanced-panel ${advancedOpen ? 'advanced-panel--open' : ''}`}>
                    <div className="advanced-content">
                      <div className="advanced-row">
                        <div className="advanced-field">
                          <label className="advanced-label" htmlFor="select-year">開講年度</label>
                          <select id="select-year" className="advanced-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            <option value="">すべて</option>
                            <option value="2026">2026年度</option>
                            <option value="2025">2025年度</option>
                            <option value="2024">2024年度</option>
                          </select>
                        </div>
                        <div className="advanced-field">
                          <label className="advanced-label" htmlFor="select-semester">開講学期</label>
                          <select id="select-semester" className="advanced-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
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
                          <select id="select-faculty" className="advanced-select" value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
                            <option value="">すべて</option>
                            {FACULTIES.map((f) => (<option key={f} value={f}>{f}</option>))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="faculty-search">
                  <p style={{ color: 'var(--text-light)', marginBottom: 12, fontSize: 14 }}>学部を選択してください</p>
                  <div className="faculty-grid">
                    {FACULTIES.map((f) => (
                      <button key={f} className="faculty-btn" onClick={() => console.log(f)}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="search-btn-wrapper">
                <button id="btn-search" className="search-btn" onClick={handleSearch}>検索結果を見る</button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 検索結果 ===== */}
        {searchResults !== null && (
          <div className="popular-section">
            <h2 className="popular-title">
              🔍 検索結果
              <span className="search-result-count">{searchResults.length}件</span>
            </h2>
            {searchResults.length === 0 ? (
              <div className="search-empty">
                <div className="search-empty-icon">😢</div>
                <p>該当する授業が見つかりませんでした</p>
                <p className="search-empty-sub">別のキーワードで検索してみてください</p>
              </div>
            ) : (
              <div className="popular-list">
                {searchResults.map((course, i) => (
                  <CourseResultCard key={course.name} course={course} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== 人気の授業（未検索時のみ表示） ===== */}
        {searchResults === null && (
          <div className="popular-section">
            <h2 className="popular-title">🔥 人気の授業口コミ</h2>
            <div className="popular-list">
              {MOCK_COURSES.map((course, i) => {
                const allCourse = ALL_COURSES.find((c) => c.name === course.name) || { teachers: [course.teacher], faculty: course.faculty }
                return <CourseResultCard key={course.name} course={allCourse} index={i} />
              })}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default HomePage
