import { useState } from 'react'
import '../pages-styles/TimetablePage.css'

const DAYS = ['月', '火', '水', '木', '金', '土']
const PERIODS = [1, 2, 3, 4, 5]
const PERIOD_TIMES = {
  1: '9:20 - 10:50',
  2: '11:05 - 12:35',
  3: '13:40 - 15:15',
  4: '15:30 - 17:00',
  5: '17:15 - 18:45',
}

const SAMPLE_COLORS = ['#AB47BC', '#42A5F5', '#EF5350', '#66BB6A', '#FFA726', '#5C6BC0', '#26A69A']

const COURSE_MASTER = [
<<<<<<< HEAD
  { day: '月', period: 2, name: '情報数学Ⅰ', color: '#66BB6A', dept: ['d2'] },
=======
>>>>>>> 5373c44dacfad32144cb0f59dc838b72eaba51bf
  { day: '月', period: 2, name: '情報セキュリティ概論', color: '#AB47BC', dept: ['d1', 'd2'] },
  { day: '月', period: 3, name: '計算量と暗号', color: '#42A5F5', dept: ['d1', 'd2'] },
  { day: '月', period: 4, name: '情報システム総合演習', color: '#EF5350', dept: ['d1', 'd2'] },
  { day: '水', period: 1, name: '情報産業論', color: '#66BB6A', dept: ['RD'] },
  { day: '水', period: 2, name: '多変量解析', color: '#42A5F5', dept: ['d2', 'd3', 'd4'] },
  { day: '水', period: 3, name: '人間関係の心理(鳩山C)', color: '#FFA726', dept: ['all'] },
  { day: '水', period: 4, name: 'アジア文化研究', color: '#FFA726', dept: ['all'] },
  { day: '水', period: 5, name: 'オブジェクト指向', color: '#42A5F5', dept: ['d1', 'd2', 'd3'] },
  { day: '木', period: 4, name: '深層学習', color: '#42A5F5', dept: ['d1', 'd2', 'd3'] },
  { day: '金', period: 2, name: '数理とデザイン', color: '#42A5F5', dept: ['d1', 'd3', 'd4'] },
  { day: '金', period: 3, name: '数理最適化入門', color: '#AB47BC', dept: ['d1', 'd2', 'd3'] },
  { day: '金', period: 4, name: '統計学Ⅰ', color: '#42A5F5', dept: ['d1', 'd2', 'd3'] },
];

function TimetablePage() {
  const [semester, setSemester] = useState('spring')
  const [timetable, setTimetable] = useState({})
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  // 初期値を null にして、最初は選択画面を出す
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const mainDepartments = [
    { id: 'RD', name: '情報システムデザイン学系' },
    { id: 'ru', name: '理学系' },
    { id: 'rb', name: '生命科学系' },
    { id: 'rg', name: '建築・都市環境学系' },
    { id: 'rm', name: '機械工学系' },
  ];

  const courseOptions = [
    { id: 'RD', name: 'RD共通' },
    { id: 'd1', name: 'd1 (コンピュータシステム)' },
    { id: 'd2', name: 'd2 (ソフトウェアデザイン)' },
    { id: 'd3', name: 'd3 (インタラクションデザイン)' },
    { id: 'd4', name: 'd4 (社会情報デザイン)' },
  ];

  const getCellKey = (day, period) => `${day}-${period}`

  const handleCellClick = (day, period) => {
    const key = getCellKey(day, period)
    const masterCourse = COURSE_MASTER.find(c => 
      c.day === day && c.period === period && 
      (c.dept.includes(selectedDepartment) || c.dept.includes('all') || (selectedDepartment.startsWith('d') && c.dept.includes('RD')))
    );

    setEditingCell(key)
    setEditValue(masterCourse ? masterCourse.name : (timetable[key]?.name || ''))
  }

  const handleSave = () => {
    if (editingCell && editValue.trim()) {
      const [day, period] = editingCell.split('-');
      const masterCourse = COURSE_MASTER.find(c => 
        c.day === day && parseInt(period) === c.period &&
        (c.dept.includes(selectedDepartment) || c.dept.includes('all') || (selectedDepartment.startsWith('d') && c.dept.includes('RD')))
      );
      const color = masterCourse ? masterCourse.color : SAMPLE_COLORS[Math.floor(Math.random() * SAMPLE_COLORS.length)];
      setTimetable(prev => ({ ...prev, [editingCell]: { name: editValue.trim(), color } }))
    } else if (editingCell && !editValue.trim()) {
      setTimetable(prev => { const next = { ...prev }; delete next[editingCell]; return next; })
    }
    setEditingCell(null)
    setEditValue('')
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingCell(null); }

  // 1. 最初は学系選択画面を表示
  if (!selectedDepartment) {
    return (
      <main className="timetable-page">
        <div className="dept-selection-container" style={{ textAlign: 'center', marginTop: '100px' }}>
          <h1 className="timetable-title">🎓 所属学系を選択してください</h1>
          <div className="dept-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '40px' }}>
            {mainDepartments.map(dept => (
              <button key={dept.id} className="dept-card" onClick={() => setSelectedDepartment(dept.id)} style={{ padding: '20px', borderRadius: '10px', cursor: 'pointer' }}>
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const registeredCount = Object.keys(timetable).length
  const totalCredits = registeredCount * 2

  // 2. 学系選択後の時間割画面
  return (
    <main className="timetable-page">
      <div className="timetable-container">
        <div className="timetable-page-header">
          <button onClick={() => setSelectedDepartment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>← 学系を選び直す</button>
          <h1 className="timetable-title">📅 時間割</h1>
          <div className="semester-toggle">
            <button className={`semester-btn ${semester === 'spring' ? 'semester-btn--active' : ''}`} onClick={() => setSemester('spring')}>前期</button>
            <button className={`semester-btn ${semester === 'fall' ? 'semester-btn--active' : ''}`} onClick={() => setSemester('fall')}>後期</button>
          </div>
        </div>

        <div className="timetable-stats">
          <div className="timetable-stat">📚 <span className="timetable-stat-label">登録科目</span> <span className="timetable-stat-value">{registeredCount}</span></div>
          <div className="timetable-stat">🎓 <span className="timetable-stat-label">合計単位</span> <span className="timetable-stat-value">{totalCredits}</span></div>
          <div className="timetable-stat department-selector-stat">
            <span className="timetable-stat-label">コース選択</span>
            <div className="radio-group" style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              {courseOptions.map(opt => (
                <label key={opt.id} className="radio-item">
                  <input type="radio" name="course" value={opt.id} checked={selectedDepartment === opt.id} onChange={(e) => setSelectedDepartment(e.target.value)} />
                  {opt.name.split(' ')[0]}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="timetable-grid-wrapper">
          <div className="timetable-grid">
            <div className="timetable-cell timetable-cell--corner"></div>
            {DAYS.map(day => <div key={day} className="timetable-cell timetable-cell--day-header">{day}</div>)}
            {PERIODS.map(period => (
              <div key={`row-${period}`} style={{ display: 'contents' }}>
                <div className="timetable-cell timetable-cell--period-header">
                  <div className="period-number">{period}</div>
                  <div className="period-time">{PERIOD_TIMES[period]}</div>
                </div>
                {DAYS.map(day => {
                  const key = getCellKey(day, period)
                  const entry = timetable[key]
                  const isEditing = editingCell === key
                  const masterCourse = COURSE_MASTER.find(c => 
                    c.day === day && c.period === period && 
                    (c.dept.includes(selectedDepartment) || c.dept.includes('all') || (selectedDepartment.startsWith('d') && c.dept.includes('RD')))
                  );

                  return (
                    <div key={key} className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                      style={entry ? { '--cell-color': entry.color } : {}}
                      onClick={() => !isEditing && handleCellClick(day, period)}
                    >
                      {isEditing ? (
                        <input className="timetable-cell-input" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={handleSave} onKeyDown={handleKeyDown} autoFocus />
                      ) : entry ? (
                        <div className="timetable-cell-content"><span className="timetable-cell-name">{entry.name}</span></div>
                      ) : masterCourse ? (
                        <span className="timetable-cell-placeholder">+</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default TimetablePage;