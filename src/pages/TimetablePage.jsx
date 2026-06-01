<<<<<<< HEAD
import { useState } from 'react'
import { Link } from 'react-router-dom'
=======
import { useState, useEffect } from 'react'
>>>>>>> いい
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

// 🎓 卒業要件の定数（アップロード画像に基づく）
const GRADUATION_REQUIREMENTS = {
  total: 124,
  common: 22,   // 全学共通
  faculty: 14,  // 学系共通
  special: 88,  // 学系専門
};

const COURSE_COLORS = {
  d1: '#FFF59D', // 🟡 コンピュータソフトウェア
  d2: '#90CAF9', // 🔵 情報システム
  d3: '#A5D6A7', // 🟢 知能情報デザイン
  d4: '#F48FB1', // 💗 アミューズメントデザイン
  default: '#E0E0E0', 
};

const COURSES = [
  { id: 'd1', name: 'コンピュータソフトウェア (d1)' },
  { id: 'd2', name: '情報システム (d2)' },
  { id: 'd3', name: '知能情報デザイン (d3)' },
  { id: 'd4', name: 'アミューズメントデザイン (d4)' },
];

const COURSE_MASTER = [
  // 🗓️ 月曜日
  { day: '月', period: 2, name: '現代マスコミ論', teacher: '中山 洋', room: '204', semester: 'spring', target: 'RD', grade: 2, type: '選択', hasAttendance: false },
  { day: '月', period: 2, name: '情報セキュリティ概論', teacher: '橋本 侑知', room: '201', semester: 'spring', target: 'd1,d2', grade: 3, type: '選択', hasAttendance: true }, 
  { day: '月', period: 2, name: '動的システム', teacher: '小河 誠巳', room: '6101', semester: 'spring', target: 'd2', grade: 2, type: '選択', hasAttendance: true }, 
  { day: '月', period: 2, name: '情報数学Ⅰ', teacher: '小河/築地/松浦/佐藤/橋本/萩原', room: '3220他', semester: 'spring', target: 'RD', grade: 1, type: '選択', hasAttendance: true }, 
  { day: '月', period: 3, name: '情報数学Ⅱ', teacher: '築地 立家 / 小河 誠巳', room: '3330,3340', semester: 'spring', target: 'RD', grade: 2, type: '選択', hasAttendance: true }, 
  { day: '月', period: 3, name: '計算量と暗号', teacher: '橋本 侑知', room: '201', semester: 'spring', target: 'd1,d2', grade: 3, type: '選択', hasAttendance: true }, 
  { day: '月', period: 3, name: 'インタラクティブデザイン論', teacher: '矢口 博之', room: '221', semester: 'spring', target: 'd3,d4', grade: 3, type: '選択', hasAttendance: false },
  { day: '月', period: 3, name: '社会心理学', teacher: '鳥居 拓馬', room: '6102', semester: 'spring', target: 'd3', grade: 2, type: '選択', hasAttendance: true }, 
  { day: '月', period: 3, name: '認知心理学', teacher: '高橋 徹', room: '202', semester: 'spring', target: 'd4', grade: 2, type: '選択', hasAttendance: true }, 
  { day: '月', period: 4, name: '情報システム総合演習', teacher: '学系教員', room: '各実験室', semester: 'spring', target: '学系専門', grade: 3, type: '選択', hasAttendance: true }, 
  
  // 🗓️ 火曜日
  { day: '火', period: 2, name: 'データベース構成論', teacher: '陳 致中', room: '201', semester: 'spring', target: 'd1,d2', grade: 2, type: '選択', hasAttendance: true },
  { day: '火', period: 3, name: '深層学習', teacher: '佐藤 聖起', room: '201', semester: 'spring', target: 'd1', grade: 3, type: '選択', hasAttendance: true },
  { day: '火', period: 4, name: 'コンピュータネットワーク', teacher: '秋山 康智', room: '201', semester: 'spring', target: 'd2,d3', grade: 2, type: '選択', hasAttendance: true },
  { day: '火', period: 5, name: 'オブジェクト指向', teacher: '藤本 衡', room: '3210', semester: 'spring', target: 'd1,d2', grade: 2, type: '選択', hasAttendance: true },

  // 🗓️ 水曜日以降
  { day: '水', period: 1, name: '情報産業論', teacher: '大場/秋山/藤本/柴山', room: '201', semester: 'spring', target: 'RD', grade: 2, type: '選択' },
  { day: '水', period: 2, name: '多変量解析', teacher: '佐藤 聖也', room: '201', semester: 'spring', target: 'd1', grade: 3, type: '選択' },
  { day: '水', period: 2, name: 'メディア処理概論', teacher: '柴山 拓郎', room: '221', semester: 'spring', target: 'd3,d4', grade: 2, type: '選択' },
  { day: '水', period: 3, name: '人間関係の心理(鳩山C)', teacher: '高橋 徹', room: '204', semester: 'spring', target: '全コース', grade: 2, type: '選択' },
  { day: '水', period: 3, name: 'モバイルアプリ開発', teacher: '陳 致中', room: '3210', semester: 'spring', target: 'd2,d3', grade: 3, type: '選択' },
  { day: '水', period: 3, name: '情報デザイン基礎演習', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd4', grade: 2, type: '選択' },
  { day: '水', period: 4, name: 'Webデザイン演習', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd4', grade: 2, type: '選択' },
  { day: '木', period: 2, name: 'プログラミング言語論', teacher: '松浦 昭洋', room: '201', semester: 'spring', target: 'd1,d2', grade: 2, type: '選択' },
  { day: '木', period: 2, name: 'デザインリサーチ', teacher: '徳田 太郎', room: '283A', semester: 'spring', target: 'd4', grade: 3, type: '選択' },
  { day: '木', period: 2, name: 'Webデザイン', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd3', grade: 2, type: '選択' },
  { day: '木', period: 3, name: '環境心理学', teacher: '鳥居 拓馬', room: '201', semester: 'spring', target: 'd3,d4', grade: 2, type: '選択' },
  { day: '木', period: 3, name: '技術者倫理', teacher: '大場 みち子', room: '204', semester: 'spring', target: 'RD', grade: 3, type: '選択' },
  { day: '木', period: 4, name: 'ソフトウェアエンジニアリング', teacher: '大場 みち子', room: '201', semester: 'spring', target: 'd2,d3', grade: 3, type: '選択' },
  { day: '木', period: 4, name: 'ヒューマンインタフェース', teacher: '矢口 博之', room: '221', semester: 'spring', target: 'd1,d4', grade: 2, type: '選択' },
  { day: '木', period: 5, name: '知財と法規', teacher: '浅井 寿如', room: '202', semester: 'spring', target: 'RD', grade: 3, type: '選択' },
  { day: '金', period: 2, name: '数理とデザイン', teacher: '築地 立家', room: '202', semester: 'spring', target: 'd1,d4', grade: 2, type: '選択' },
  { day: '金', period: 4, name: 'コンピュータプログラミングⅠ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'spring', target: 'RD', grade: 1, type: '必修' },
  { day: '金', period: 5, name: 'コンピュータプログラミングⅠ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'spring', target: 'RD', grade: 1, type: '必修' }
];

const REGISTRATION_PERIODS = [
  { start: '2026-04-08T10:00', end: '2026-04-09T17:00', name: '履修登録期間 (1次登録)' },
  { start: '2026-04-15T10:00', end: '2026-04-17T17:00', name: '履修登録期間 (2次登録)' },
  { start: '2026-04-22T10:00', end: '2026-04-24T17:00', name: '履修登録修正期間 (春学期修正)' },
];

function TimetablePage() {
  const [semester, setSemester] = useState('spring')
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saveMessage, setSaveMessage] = useState('') 
  
  const [pageMode, setPageMode] = useState(null)
  const [editStep, setEditStep] = useState('date-lock-check') 
  const [viewStep, setViewStep] = useState('date-input')
  
  const [simulatedDateTime, setSimulatedDateTime] = useState('')
  const [activePeriodName, setActivePeriodName] = useState('')
  const [lockError, setLockError] = useState('')

  const [todayDate, setTodayDate] = useState('')
  const [todayDayOfWeek, setTodayDayOfWeek] = useState('')
  const [lessonCount, setLessonCount] = useState(1)

  const [unipaData, setUnipaData] = useState(() => {
    const saved = localStorage.getItem('isd_manual_attendance')
    return saved ? JSON.parse(saved) : {}
  })

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('isd_timetable_data')
    return saved ? JSON.parse(saved) : { spring: {}, fall: {} }
  })

  const [grade, setGrade] = useState(() => localStorage.getItem('isd_grade') || '')
  const [mainCourse, setMainCourse] = useState(() => localStorage.getItem('isd_main_course') || '')
  const [subCourse, setSubCourse] = useState(() => localStorage.getItem('isd_sub_course') || '')

  useEffect(() => { localStorage.setItem('isd_grade', grade) }, [grade])
  useEffect(() => { localStorage.setItem('isd_main_course', mainCourse) }, [mainCourse])
  useEffect(() => { localStorage.setItem('isd_sub_course', subCourse) }, [subCourse])
  useEffect(() => { localStorage.setItem('isd_timetable_data', JSON.stringify(timetable)) }, [timetable])
  useEffect(() => { localStorage.setItem('isd_manual_attendance', JSON.stringify(unipaData)) }, [unipaData])

  // 🧮 登録された時間割から現在の合計単位数を計算するロジック
  const calculateRegisteredCredits = () => {
    const currentSemesterTimetable = timetable[semester] || {};
    let totalCredits = 0;

    Object.values(currentSemesterTimetable).forEach(cell => {
      if (cell && cell.name) {
        // 例: 「コンピュータプログラミングⅠ・同演習」のような演習系は本来多めですが、基本は1科目2単位として計算
        totalCredits += 2; 
      }
    });

    const remainingCredits = GRADUATION_REQUIREMENTS.total - totalCredits;
    return {
      current: totalCredits,
      remaining: remainingCredits < 0 ? 0 : remainingCredits,
      percentage: Math.min(Math.round((totalCredits / GRADUATION_REQUIREMENTS.total) * 100), 100)
    };
  };

  const creditStats = calculateRegisteredCredits();

  const checkRegistrationLock = () => {
    if (!simulatedDateTime) return;
    const userTime = new Date(simulatedDateTime).getTime();
    const matchedPeriod = REGISTRATION_PERIODS.find(p => {
      const startTime = new Date(p.start).getTime();
      const endTime = new Date(p.end).getTime();
      return userTime >= startTime && userTime <= endTime;
    });

    if (matchedPeriod) {
      setActivePeriodName(matchedPeriod.name);
      setLockError('');
      setEditStep('course-select'); 
    } else {
      setActivePeriodName('');
      setLockError('❌ 申し訳ありません。期間外のため履修登録がロックされています。');
    }
  };

  const handleDateChange = (dateString) => {
    setTodayDate(dateString);
    if (!dateString) {
      setTodayDayOfWeek('');
      return;
    }
    const dateObj = new Date(dateString);
    const dayIndex = dateObj.getDay(); 
    const dayMap = ['日', '月', '火', '水', '木', '金', '土'];
    setTodayDayOfWeek(dayMap[dayIndex]);

    const baseDate = new Date('2026-04-09'); 
    const diffTime = dateObj.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let calculatedWeek = Math.floor(diffDays / 7) + 1;
    
    if (calculatedWeek < 1) calculatedWeek = 1;
    if (calculatedWeek > 15) calculatedWeek = 15;
    
    setLessonCount(calculatedWeek);
  };

  const handleCountAttendance = (courseName, type, operation, e) => {
    e.stopPropagation();
    setUnipaData(prev => {
      const current = prev[courseName] || { absents: 0, lates: 0 };
      let newVal = current[type] + (operation === 'plus' ? 1 : -1);
      if (newVal < 0) newVal = 0;
      return { ...prev, [courseName]: { ...current, [type]: newVal } };
    });
  };

  const calculateAttendanceRate = (courseName) => {
    const data = unipaData[courseName] || { absents: 0, lates: 0 };
    const total = lessonCount;
    const attends = total - data.absents;
    const safeAttends = attends < 0 ? 0 : attends;
    const rate = total === 0 ? 100 : Math.round((safeAttends / total) * 100);
    return { attends: safeAttends, absents: data.absents, lates: data.lates, rate: rate };
  };

  const getCellKey = (day, period) => `${day}-${period}`

  const handleCellClick = (day, period) => {
    if (pageMode !== 'edit') return; 
    const key = getCellKey(day, period)
    const availableCourses = getFilteredCourses(day, period)
    setEditingCell(key)
    
    const currentSemesterTimetable = timetable[semester] || {}
    if (currentSemesterTimetable[key]) setEditValue(currentSemesterTimetable[key].name)
    else if (availableCourses.length > 0) setEditValue(availableCourses[0].name)
    else setEditValue('')
  }

  const getFilteredCourses = (day, period) => {
    return COURSE_MASTER.filter(c => c.day === day && c.period === period && c.semester === semester);
  }

  const handleSaveCell = (currentValue) => {
    const targetValue = currentValue !== undefined ? currentValue : editValue;
    if (editingCell && targetValue) {
      const selectedCourse = COURSE_MASTER.find(c => c.name === targetValue && c.semester === semester);
      
      const noAttendanceCourses = ['現代マスコミ論', 'インタラクティブデザイン論'];
      
      let defaultHasAttendance = true;
      if (noAttendanceCourses.includes(targetValue)) {
        defaultHasAttendance = false;
      } else if (selectedCourse) {
        defaultHasAttendance = selectedCourse.hasAttendance ?? true;
      }
      
      const color = selectedCourse ? COURSE_COLORS[selectedCourse.target] || COURSE_COLORS.default : COURSE_COLORS.default;

      setTimetable(prev => ({
        ...prev,
        [semester]: {
          ...(prev[semester] || {}),
          [editingCell]: { 
            name: targetValue, 
            color, 
            room: selectedCourse?.room || '',
            hasAttendance: defaultHasAttendance 
          }
        }
      }))
    } else if (editingCell && !targetValue) {
      setTimetable(prev => {
        const nextMap = { ...(prev[semester] || {}) };
        delete nextMap[editingCell];
        return { ...prev, [semester]: nextMap };
      })
    }
    setEditingCell(null)
    setEditValue('')
  }

  const toggleAttendanceTarget = (key, e) => {
    e.stopPropagation();
    const currentSemesterMap = timetable[semester] || {};
    const cellData = currentSemesterMap[key];
    if (!cellData) return;

    const noAttendanceCourses = ['現代マスコミ論', 'インタラクティブデザイン論'];
    if (noAttendanceCourses.includes(cellData.name)) {
      return;
    }

    setTimetable(prev => ({
      ...prev,
      [semester]: {
        ...currentSemesterMap,
        [key]: { ...cellData, hasAttendance: !cellData.hasAttendance }
      }
    }));
  };

  const handleSaveToStorage = () => {
    localStorage.setItem('isd_timetable_data', JSON.stringify(timetable));
    setSaveMessage('✅ 時間割情報を保存しました！');
    setTimeout(() => {
      setSaveMessage('');
      setPageMode(null);
      setEditStep('date-lock-check');
    }, 1500);
  }

  return (
    <main className="timetable-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* 1. 目的の選択 */}
      {pageMode === null && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '450px', width: '100%' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#333' }}>🔍 目的を選択</h2>
            <button onClick={() => setPageMode('edit')} style={{ width: '100%', padding: '15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
              📝 履修登録をする（新規・編集）
            </button>
            <button onClick={() => { setPageMode('view'); setViewStep('date-input'); }} style={{ width: '100%', padding: '15px', backgroundColor: '#1abc9c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px' }}>
              👀 出欠状況・時間割の確認
            </button>
          </div>
        </div>
      )}

      {/* 2. 履修登録：日時確認 */}
      {pageMode === 'edit' && editStep === 'date-lock-check' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '15px' }}>日時確認</h3>
            <input type="datetime-local" value={simulatedDateTime} onChange={(e) => setSimulatedDateTime(e.target.value)} style={{ width: '85%', padding: '12px', marginBottom: '15px' }} />
            {lockError && ( <div style={{ color: '#c0392b', marginBottom: '20px' }}>{lockError}</div> )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setPageMode(null)} style={{ flex: 1, padding: '12px' }}>戻る</button>
              <button onClick={checkRegistrationLock} disabled={!simulatedDateTime} style={{ flex: 2, padding: '12px', background: '#3498db', color: 'white' }}>認証する</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 出欠確認：今日の日付入力 */}
      {pageMode === 'view' && viewStep === 'date-input' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>出席基準日を入力してください</h3>
            <input type="date" value={todayDate} onChange={(e) => handleDateChange(e.target.value)} style={{ width: '85%', padding: '12px', marginBottom: '15px', textAlign: 'center' }} />
            {todayDayOfWeek && (
              <div style={{ padding: '12px', background: '#e8f8f5', borderRadius: '8px', marginBottom: '25px' }}>
                <div>🗓️ 判定結果: <b>{todayDayOfWeek}曜日</b> (第 {lessonCount} 回目)</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setPageMode(null)} style={{ flex: 1, padding: '12px' }}>戻る</button>
              <button onClick={() => setViewStep('grid')} disabled={!todayDate} style={{ flex: 2, padding: '12px', background: '#1abc9c', color: 'white' }}>進む ➔</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 履修登録：基本設定 */}
      {pageMode === 'edit' && editStep === 'course-select' && (
        <div style={{ maxWidth: '500px', margin: '60px auto', background: '#fff', padding: '30px', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '20px' }}>⚙️ 基本設定</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px' }}>学年</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="">-- 学年を選択 --</option><option value="2">2年生</option><option value="3">3年生</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px' }}>主コース</label>
            <select value={mainCourse} onChange={e => setMainCourse(e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="">-- 主コースを選択 --</option>{COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '6px' }}>副コース</label>
            <select value={subCourse} onChange={e => setSubCourse(e.target.value)} style={{ width: '100%', padding: '10px' }}>
              <option value="">-- 副コースを選択 --</option>{COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setEditStep('date-lock-check')} style={{ flex: 1, padding: '12px' }}>戻る</button>
            <button onClick={() => setEditStep('grid')} disabled={!grade || !mainCourse || !subCourse} style={{ flex: 2, padding: '12px', background: '#3498db', color: 'white' }}>時間割登録へ ➔</button>
          </div>
        </div>
      )}

      {/* 5. メイン時間割シート */}
      {((pageMode === 'edit' && editStep === 'grid') || (pageMode === 'view' && viewStep === 'grid')) && (
        <div className="timetable-container">
          
          {/* 🎓 単位カウンター表示エリア（追加機能） */}
          <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '12px', padding: '20px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#495057' }}>🎓 卒業要件単位カウンター (目標: {GRADUATION_REQUIREMENTS.total}単位)</h3>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: creditStats.remaining === 0 ? '#2ecc71' : '#e74c3c' }}>
                {creditStats.remaining === 0 ? '🎉 卒業要件クリア！' : `🚨 卒業まであと ${creditStats.remaining} 単位足りません`}
              </span>
            </div>
            
            {/* プログレスバー */}
            <div style={{ width: '100%', height: '20px', background: '#dee2e6', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${creditStats.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #3498db, #2ecc71)', transition: 'width 0.5s ease' }}></div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6c757d' }}>
              <span>現在の登録単位数: <b>{creditStats.current}</b> 単位</span>
              <span>進捗率: <b>{creditStats.percentage}%</b></span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: '5px 0 0 0', fontSize: '24px' }}>📅 時間割メインシート</h1>
            </div>
            <button onClick={() => { setPageMode(null); setEditStep('date-lock-check'); }} style={{ padding: '8px 15px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px' }}>目的選択へ戻る</button>
          </div>

          <div className="timetable-grid" style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: '6px', background: '#f5f5f5', padding: '8px', borderRadius: '8px' }}>
            <div style={{ background: '#ddd', borderRadius: '4px' }}></div>
            {DAYS.map(day => {
              const isTodayColumn = pageMode === 'view' && day === todayDayOfWeek;
              return (
                <div key={day} style={{ background: isTodayColumn ? '#f1c40f' : '#34495e', color: isTodayColumn ? '#2c3e50' : 'white', textAlign: 'center', padding: '8px 0', fontWeight: 'bold', borderRadius: '4px' }}>
                  {day} {isTodayColumn && '★'}
                </div>
              )
            })}
            
            {PERIODS.map(period => (
              <div key={`row-${period}`} style={{ display: 'contents' }}>
                <div style={{ background: '#ecf0f1', padding: '10px 4px', textAlign: 'center', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{period}</div>
                </div>
                
                {DAYS.map(day => {
                  const key = getCellKey(day, period)
                  const entry = (timetable[semester] || {})[key]
                  const isEditing = editingCell === key
                  const availableCourses = getFilteredCourses(day, period);
                  
                  const noAttendanceCourses = ['現代マスコミ論', 'インタラクティブデザイン論'];
                  const isNoAttendanceCourse = entry && noAttendanceCourses.includes(entry.name);
                  const hasAttendance = isNoAttendanceCourse ? false : (entry?.hasAttendance ?? true);

                  const attStats = entry ? calculateAttendanceRate(entry.name) : null;
                  const isTodayCell = pageMode === 'view' && day === todayDayOfWeek;

                  return (
<<<<<<< HEAD
                    <div key={key} className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                      style={entry ? { '--cell-color': entry.color } : {}}
                      onClick={() => !isEditing && !entry && handleCellClick(day, period)}
=======
                    <div key={key} 
                      onClick={() => !isEditing && handleCellClick(day, period)}
                      style={{
                        background: entry ? entry.color : '#fff',
                        border: isTodayCell ? '3px solid #f1c40f' : '1px solid #e0e0e0',
                        minHeight: '130px',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: pageMode === 'edit' ? 'pointer' : 'default',
                        position: 'relative'
                      }}
>>>>>>> いい
                    >
                      {isEditing ? (
                        <select value={editValue} onChange={e => { setEditValue(e.target.value); handleSaveCell(e.target.value); }} onBlur={() => handleSaveCell(editValue)} autoFocus style={{ width: '100%', padding: '4px', fontSize: '11px' }}>
                          <option value="">-- 科目を選択 --</option>
                          {availableCourses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          {entry && <option value="">❌ この枠を削除</option>}
                        </select>
                      ) : entry ? (
<<<<<<< HEAD
                        <div className="timetable-cell-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
                          <Link to={`/course/${encodeURIComponent(entry.name)}`} className="timetable-cell-name" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                            {entry.name}
                          </Link>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleCellClick(day, period); }} 
                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '2px', fontSize: '10px' }}
                            title="編集"
                          >
                            ✏️
                          </button>
                        </div>
                      ) : masterCourse ? (
                        <span className="timetable-cell-placeholder">+</span>
=======
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#2c3e50', lineHeight: '1.2' }}>{entry.name}</div>
                            
                            {pageMode === 'edit' && (
                              <button 
                                onClick={(e) => toggleAttendanceTarget(key, e)}
                                disabled={isNoAttendanceCourse}
                                style={{
                                  marginTop: '5px', width: '100%', fontSize: '8px', padding: '2px 0', borderRadius: '3px', border: '1px solid #7f8c8d', 
                                  cursor: isNoAttendanceCourse ? 'not-allowed' : 'pointer',
                                  background: hasAttendance ? '#E8F8F5' : '#E5E7E9',
                                  color: hasAttendance ? '#117A65' : '#5D6D7E',
                                  fontWeight: 'bold'
                                }}
                              >
                                {hasAttendance ? '📊 出欠評価：あり' : '🔇 出欠評価：なし'}
                              </button>
                            )}
                          </div>
                          
                          {/* 確認モード（view） */}
                          {pageMode === 'view' && (
                            hasAttendance ? (
                              <div style={{ background: 'rgba(255,255,255,0.9)', padding: '4px 2px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold' }}>
                                  <span style={{ color: attStats.rate < 75 ? '#D32F2F' : '#2E7D32' }}>📊 {attStats.rate}%</span>
                                  <span style={{ color: '#555' }}>{attStats.attends}出-{attStats.absents}欠</span>
                                </div>
                                <div style={{ display: 'flex', gap: '2px' }} onClick={e => e.stopPropagation()}>
                                  <button onClick={(e) => handleCountAttendance(entry.name, 'absents', 'plus', e)} style={{ flex: 1, fontSize: '8px', background: '#FFEBEE', color: '#c62828' }}>欠</button>
                                  <button onClick={(e) => handleCountAttendance(entry.name, 'lates', 'plus', e)} style={{ flex: 1, fontSize: '8px', background: '#FFF3E0', color: '#ef6c00' }}>遅</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ background: '#f2f4f4', border: '1px dashed #bdc3c7', padding: '12px 2px', borderRadius: '4px', marginTop: 'auto', textAlign: 'center' }}>
                                <div style={{ fontSize: '9px', color: '#7f8c8d', fontWeight: 'bold', lineHeight: '1.2' }}>
                                  🔇 出席評価は<br />ありません
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (pageMode === 'edit' && availableCourses.length > 0) ? (
                        <div style={{ textAlign: 'center', color: '#bbb', fontSize: '20px', paddingTop: '40px' }}>+</div>
>>>>>>> いい
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {pageMode === 'edit' && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {saveMessage && <div style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '10px' }}>{saveMessage}</div>}
              <button onClick={handleSaveToStorage} style={{ padding: '12px 30px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                💾 変更を確定して保存する
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default TimetablePage;