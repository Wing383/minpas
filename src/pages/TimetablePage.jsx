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

const SAMPLE_COLORS = ['#AB47BC', '#42A5F5', '#EF5350', '#66BB6A', '#FFA726', '#5C6BC0', '#26A69A', '#EC407A', '#26C6DA', '#78909C']

// ★ 前期（spring）と後期（fall）の全授業マスターデータ
const COURSE_MASTER = [
  // ================= 前期（spring）の授業 =================
  { day: '月', period: 2, name: '現代マスコミ論', color: '#FFA726', semester: 'spring' },
  { day: '月', period: 2, name: '情報セキュリティ概論', color: '#AB47BC', semester: 'spring' },
  { day: '月', period: 2, name: '動的システム', color: '#42A5F5', semester: 'spring' },
  { day: '月', period: 2, name: '情報数学Ⅰ', color: '#66BB6A', semester: 'spring' },
  { day: '月', period: 3, name: '情報数学Ⅱ', color: '#66BB6A', semester: 'spring' },
  { day: '月', period: 3, name: '計算量と暗号', color: '#42A5F5', semester: 'spring' },
  { day: '月', period: 3, name: 'インタラクティブデザイン論', color: '#EC407A', semester: 'spring' },
  { day: '月', period: 3, name: '社会心理学', color: '#FFA726', semester: 'spring' },
  { day: '月', period: 3, name: '認知心理学', color: '#FFA726', semester: 'spring' },
  { day: '月', period: 4, name: '情報システム総合演習', color: '#EF5350', semester: 'spring' },

  { day: '火', period: 2, name: 'プログラミング言語論', color: '#42A5F5', semester: 'spring' },
  { day: '火', period: 2, name: 'デザインリサーチ', color: '#EC407A', semester: 'spring' },
  { day: '火', period: 2, name: 'Webデザイン', color: '#EC407A', semester: 'spring' },
  { day: '火', period: 3, name: '環境心理学', color: '#FFA726', semester: 'spring' },
  { day: '火', period: 3, name: '技術者倫理', color: '#78909C', semester: 'spring' },
  { day: '火', period: 4, name: 'ソフトウェアエンジニアリング', color: '#42A5F5', semester: 'spring' },
  { day: '火', period: 4, name: 'ヒューマンインタフェース', color: '#EC407A', semester: 'spring' },
  { day: '火', period: 5, name: '知財と法規', color: '#78909C', semester: 'spring' },

  { day: '水', period: 1, name: '情報産業論', color: '#66BB6A', semester: 'spring' },
  { day: '水', period: 2, name: '多変量解析', color: '#42A5F5', semester: 'spring' },
  { day: '水', period: 2, name: 'メディア処理概論', color: '#EC407A', semester: 'spring' },
  { day: '水', period: 3, name: '人間関係の心理(鳩山C)', color: '#FFA726', semester: 'spring' },
  { day: '水', period: 3, name: 'モバイルアプリ開発', color: '#42A5F5', semester: 'spring' },
  { day: '水', period: 3, name: '情報デザイン基礎演習', color: '#EC407A', semester: 'spring' },
  { day: '水', period: 4, name: 'アジア文化研究', color: '#FFA726', semester: 'spring' },
  { day: '水', period: 4, name: 'コンピュータネットワーク', color: '#AB47BC', semester: 'spring' },
  { day: '水', period: 4, name: 'Webデザイン演習', color: '#EC407A', semester: 'spring' },
  { day: '水', period: 5, name: 'オブジェクト指向', color: '#42A5F5', semester: 'spring' },

  { day: '木', period: 2, name: 'オペレーティングシステム', color: '#AB47BC', semester: 'spring' },
  { day: '木', period: 2, name: 'ネットワークセキュリティ', color: '#AB47BC', semester: 'spring' },
  { day: '木', period: 2, name: '音響メディア論', color: '#EC407A', semester: 'spring' },
  { day: '木', period: 3, name: 'データベース構成論', color: '#AB47BC', semester: 'spring' },
  { day: '木', period: 3, name: '情報バリアフリー', color: '#EC407A', semester: 'spring' },
  { day: '木', period: 3, name: '社会調査法', color: '#26C6DA', semester: 'spring' },
  { day: '木', period: 4, name: '深層学習', color: '#42A5F5', semester: 'spring' },
  { day: '木', period: 4, name: '情報デザイン演習Ⅰ', color: '#EC407A', semester: 'spring' },

  { day: '金', period: 2, name: '数理とデザイン', color: '#42A5F5', semester: 'spring' },
  { day: '金', period: 2, name: '人間計測法', color: '#26C6DA', semester: 'spring' },
  { day: '金', period: 2, name: '実験心理・行動科学', color: '#FFA726', semester: 'spring' },
  { day: '金', period: 3, name: '基礎確率論', color: '#66BB6A', semester: 'spring' },
  { day: '金', period: 3, name: '数理最適化入門', color: '#AB47BC', semester: 'spring' },
  { day: '金', period: 4, name: '統計学Ⅰ', color: '#42A5F5', semester: 'spring' },
  { day: '金', period: 4, name: 'コンピュータプログラミングⅠ・同演習', color: '#42A5F5', semester: 'spring' },
  { day: '金', period: 5, name: 'コンピュータプログラミングⅠ・同演習', color: '#42A5F5', semester: 'spring' },

  // ================= 後期（fall）の授業 =================
  { day: '月', period: 3, name: '人工知能プログラミングⅡ', color: '#42A5F5', semester: 'fall' },
  { day: '月', period: 3, name: '生成人工知能', color: '#AB47BC', semester: 'fall' },
  { day: '火', period: 1, name: '教育システムデザイン論', color: '#EC407A', semester: 'fall' },
  { day: '水', period: 1, name: 'ゲームプログラミングⅡ', color: '#42A5F5', semester: 'fall' },
  { day: '水', period: 2, name: '統計学Ⅱ', color: '#66BB6A', semester: 'fall' },
  { day: '水', period: 3, name: 'コンピュータグラフィックス', color: '#EC407A', semester: 'fall' },
  { day: '水', period: 4, name: '組み込みシステム', color: '#5C6BC0', semester: 'fall' },
  { day: '水', period: 4, name: '映像制作論', color: '#FFA726', semester: 'fall' },
  { day: '木', period: 2, name: '音楽構造論', color: '#FFA726', semester: 'fall' },
  { day: '木', period: 2, name: 'アルゴリズムとデータ構造Ⅱ', color: '#42A5F5', semester: 'fall' },
  { day: '木', period: 3, name: '分散システム', color: '#AB47BC', semester: 'fall' },
  { day: '木', period: 3, name: '3次元インタラクション', color: '#EC407A', semester: 'fall' },
  { day: '木', period: 4, name: '情報システム演習Ⅱ', color: '#EF5350', semester: 'fall' },
  { day: '木', period: 4, name: '情報デザイン演習Ⅱ', color: '#EC407A', semester: 'fall' },
  { day: '木', period: 5, name: 'ITビジネスモデル論', color: '#78909C', semester: 'fall' },
  { day: '金', period: 2, name: 'ネットワーク構成論', color: '#AB47BC', semester: 'fall' },
  { day: '金', period: 2, name: 'ヒューマンファクターズ', color: '#26C6DA', semester: 'fall' },
  { day: '金', period: 3, name: '信号・システム基礎', color: '#66BB6A', semester: 'fall' },
  { day: '金', period: 3, name: 'サービスデザイン論', color: '#EC407A', semester: 'fall' },
  { day: '金', period: 4, name: 'コンピュータプログラミングⅡ・同演習', color: '#42A5F5', semester: 'fall' },
  { day: '金', period: 5, name: 'コンピュータプログラミングⅡ・同演習', color: '#42A5F5', semester: 'fall' }
];

function TimetablePage() {
  const [semester, setSemester] = useState('spring') // 'spring' (前期) or 'fall' (後期)
  
  // ★ 前期用・後期用それぞれの時間割登録状態を独立して保持する構造
  const [timetable, setTimetable] = useState({ spring: {}, fall: {} })
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const mainDepartments = [
    { id: 'RD', name: '情報システムデザイン学系' },
    { id: 'ru', name: '理学系' },
    { id: 'rb', name: '生命科学系' },
    { id: 'rg', name: '建築・都市環境学系' },
    { id: 'rm', name: '機械工学系' },
  ];

  const getCellKey = (day, period) => `${day}-${period}`

  // セルクリック時の処理
  const handleCellClick = (day, period) => {
    const key = getCellKey(day, period)
    // 現在選択されている「曜日」「時限」「学期」に一致する科目をマスターから抽出
    const availableCourses = COURSE_MASTER.filter(
      c => c.day === day && c.period === period && c.semester === semester
    )

    setEditingCell(key)
    
    const currentSemesterTimetable = timetable[semester] || {}
    if (currentSemesterTimetable[key]) {
      setEditValue(currentSemesterTimetable[key].name)
    } else if (availableCourses.length > 0) {
      setEditValue(availableCourses[0].name)
    } else {
      setEditValue('')
    }
  }

  // 保存（プルダウン選択確定）処理
  const handleSave = (currentValue) => {
    const targetValue = currentValue !== undefined ? currentValue : editValue;
    
    if (editingCell && targetValue) {
      const selectedCourse = COURSE_MASTER.find(c => c.name === targetValue && c.semester === semester);
      const color = selectedCourse ? selectedCourse.color : SAMPLE_COLORS[Math.floor(Math.random() * SAMPLE_COLORS.length)];
      
      setTimetable(prev => ({
        ...prev,
        [semester]: {
          ...(prev[semester] || {}),
          [editingCell]: { name: targetValue, color }
        }
      }))
    } else if (editingCell && !targetValue) {
      setTimetable(prev => {
        const nextSemesterMap = { ...(prev[semester] || {}) };
        delete nextSemesterMap[editingCell];
        return { ...prev, [semester]: nextSemesterMap };
      })
    }
    setEditingCell(null)
    setEditValue('')
  }

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

  // 現在表示している学期に登録されている科目の数・単位数を計算
  const currentSemesterTimetable = timetable[semester] || {}
  const registeredCount = Object.keys(currentSemesterTimetable).length
  const totalCredits = registeredCount * 2

  // 2. 学系選択後の時間割メイン画面
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
                  const entry = currentSemesterTimetable[key]
                  const isEditing = editingCell === key
                  
                  // 現在選択されている「学期（semester）」のデータだけをグリッドに反映
                  const availableCourses = COURSE_MASTER.filter(
                    c => c.day === day && c.period === period && c.semester === semester
                  );

                  return (
                    <div key={key} className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                      style={entry ? { '--cell-color': entry.color } : {}}
                      onClick={() => !isEditing && handleCellClick(day, period)}
                    >
                      {isEditing ? (
                        <select 
                          className="timetable-cell-input" 
                          value={editValue} 
                          onChange={e => {
                            setEditValue(e.target.value);
                            handleSave(e.target.value);
                          }} 
                          onBlur={() => handleSave(editValue)}
                          autoFocus
                          style={{ width: '100%', height: '100%', padding: '2px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                          {availableCourses.length > 0 ? (
                            availableCourses.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))
                          ) : (
                            <option value="">（予定なし）</option>
                          )}
                          {entry && <option value="">❌ 選択を解除（削除）</option>}
                        </select>
                      ) : entry ? (
                        <div className="timetable-cell-content"><span className="timetable-cell-name">{entry.name}</span></div>
                      ) : availableCourses.length > 0 ? (
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