import { useState } from 'react'
import '../pages-styles/TimetablePage.css'

const DAYS = ['月', '火', '水', '木', '金']
const PERIODS = [1, 2, 3, 4, 5]
const PERIOD_TIMES = {
  1: '9:00 - 10:30',
  2: '10:40 - 12:10',
  3: '13:00 - 14:30',
  4: '14:40 - 16:10',
  5: '16:20 - 17:50',
}

const SAMPLE_COLORS = [
  'var(--primary)',
  '#5C6BC0',
  '#26A69A',
  '#EF5350',
  '#AB47BC',
  '#42A5F5',
  '#66BB6A',
  '#FFA726',
]

function TimetablePage() {
  const [semester, setSemester] = useState('spring')
  const [timetable, setTimetable] = useState({})
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')

  const getCellKey = (day, period) => `${day}-${period}`

  const handleCellClick = (day, period) => {
    const key = getCellKey(day, period)
    setEditingCell(key)
    setEditValue(timetable[key]?.name || '')
  }

  const handleSave = () => {
    if (editingCell && editValue.trim()) {
      const color = SAMPLE_COLORS[Object.keys(timetable).length % SAMPLE_COLORS.length]
      setTimetable(prev => ({
        ...prev,
        [editingCell]: { name: editValue.trim(), color }
      }))
    } else if (editingCell && !editValue.trim()) {
      setTimetable(prev => {
        const next = { ...prev }
        delete next[editingCell]
        return next
      })
    }
    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setEditingCell(null)
      setEditValue('')
    }
  }

  const registeredCount = Object.keys(timetable).length
  const totalCredits = registeredCount * 2

  return (
    <main className="timetable-page">
      <div className="timetable-container">
        {/* Header */}
        <div className="timetable-page-header">
          <div className="timetable-title-area">
            <h1 className="timetable-title">📅 時間割</h1>
            <p className="timetable-subtitle">マスをタップして授業を登録</p>
          </div>
          <div className="semester-toggle">
            <button
              className={`semester-btn ${semester === 'spring' ? 'semester-btn--active' : ''}`}
              onClick={() => setSemester('spring')}
            >
              前期
            </button>
            <button
              className={`semester-btn ${semester === 'fall' ? 'semester-btn--active' : ''}`}
              onClick={() => setSemester('fall')}
            >
              後期
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="timetable-stats">
          <div className="timetable-stat">
            <span className="timetable-stat-icon">📚</span>
            <span className="timetable-stat-label">登録科目</span>
            <span className="timetable-stat-value">{registeredCount}</span>
          </div>
          <div className="timetable-stat">
            <span className="timetable-stat-icon">🎓</span>
            <span className="timetable-stat-label">合計単位</span>
            <span className="timetable-stat-value">{totalCredits}</span>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="timetable-grid-wrapper">
          <div className="timetable-grid">
            {/* Header Row */}
            <div className="timetable-cell timetable-cell--corner"></div>
            {DAYS.map(day => (
              <div key={day} className="timetable-cell timetable-cell--day-header">
                {day}
              </div>
            ))}

            {/* Body Rows */}
            {PERIODS.map(period => (
              <>
                <div key={`period-${period}`} className="timetable-cell timetable-cell--period-header">
                  <div className="period-number">{period}</div>
                  <div className="period-time">{PERIOD_TIMES[period]}</div>
                </div>
                {DAYS.map(day => {
                  const key = getCellKey(day, period)
                  const entry = timetable[key]
                  const isEditing = editingCell === key

                  return (
                    <div
                      key={key}
                      className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                      style={entry ? { '--cell-color': entry.color } : {}}
                      onClick={() => !isEditing && handleCellClick(day, period)}
                    >
                      {isEditing ? (
                        <input
                          className="timetable-cell-input"
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          placeholder="授業名"
                        />
                      ) : entry ? (
                        <div className="timetable-cell-content">
                          <span className="timetable-cell-name">{entry.name}</span>
                        </div>
                      ) : (
                        <span className="timetable-cell-placeholder">+</span>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default TimetablePage
