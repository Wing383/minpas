import { useState, useEffect } from 'react'
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

const COURSE_COLORS = {
  d1: '#FFF59D', // 🟡 黄色
  d2: '#90CAF9', // 🔵 青色
  d3: '#A5D6A7', // 🟢 緑色
  d4: '#F48FB1', // 💗 ピンク色
  default: '#E0E0E0', // ⚪ その他
};

const COURSES = [
  { id: 'd1', name: 'コンピュータソフトウェア (d1)' },
  { id: 'd2', name: '情報システム (d2)' },
  { id: 'd3', name: '知能情報デザイン (d3)' },
  { id: 'd4', name: 'アミューズメントデザイン (d4)' },
];

const COURSE_MASTER = [
  // ================= 前期（spring）の授業 =================
  { day: '月', period: 2, name: '現代マスコミ論', teacher: '中山 洋', room: '204', semester: 'spring', target: 'RD' },
  { day: '月', period: 2, name: '情報セキュリティ概論', teacher: '橋本 侑知', room: '201', semester: 'spring', target: 'd1,d2' },
  { day: '月', period: 2, name: '動的システム', teacher: '小河 誠巳', room: '6101', semester: 'spring', target: 'd2' },
  { day: '月', period: 2, name: '情報数学Ⅰ', teacher: '小河/築地/松浦/佐藤/橋本/萩原', room: '3220他', semester: 'spring', target: 'RD' },
  { day: '月', period: 3, name: '情報数学Ⅱ', teacher: '築地 立家 / 小河 誠巳', room: '3330,3340', semester: 'spring', target: 'RD' },
  { day: '月', period: 3, name: '計算量と暗号', teacher: '橋本 侑知', room: '201', semester: 'spring', target: 'd1,d2' },
  { day: '月', period: 3, name: 'インタラクティブデザイン論', teacher: '矢口 博之', room: '221', semester: 'spring', target: 'd3,d4' },
  { day: '月', period: 3, name: '社会心理学', teacher: '鳥居 拓馬', room: '6102', semester: 'spring', target: 'd3' },
  { day: '月', period: 3, name: '認知心理学', teacher: '高橋 徹', room: '202', semester: 'spring', target: 'd4' },
  { day: '月', period: 4, name: '情報システム総合演習', teacher: '学系教員', room: '各実験室', semester: 'spring', target: '学系専門' },

  { day: '火', period: 2, name: 'プログラミング言語論', teacher: '松浦 昭洋', room: '201', semester: 'spring', target: 'd1,d2' },
  { day: '火', period: 2, name: 'デザインリサーチ', teacher: '徳田 太郎', room: '283A', semester: 'spring', target: 'd4' },
  { day: '火', period: 2, name: 'Webデザイン', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd3' },
  { day: '火', period: 3, name: '環境心理学', teacher: '鳥居 拓馬', room: '201', semester: 'spring', target: 'd3,d4' },
  { day: '火', period: 3, name: '技術者倫理', teacher: '大場 みち子', room: '204', semester: 'spring', target: 'RD' },
  { day: '火', period: 4, name: 'ソフトウェアエンジニアリング', teacher: '大場 みち子', room: '201', semester: 'spring', target: 'd2,d3' },
  { day: '火', period: 4, name: 'ヒューマンインタフェース', teacher: '矢口 博之', room: '221', semester: 'spring', target: 'd1,d4' },
  { day: '火', period: 5, name: '知財と法規', teacher: '浅井 寿如', room: '202', semester: 'spring', target: 'RD' },

  { day: '水', period: 1, name: '情報産業論', teacher: '大場/秋山/藤本/柴山', room: '201', semester: 'spring', target: 'RD' },
  { day: '水', period: 2, name: '多変量解析', teacher: '佐藤 聖也', room: '201', semester: 'spring', target: 'd1' },
  { day: '水', period: 2, name: 'メディア処理概論', teacher: '柴山 拓郎', room: '221', semester: 'spring', target: 'd3,d4' },
  { day: '水', period: 3, name: '人間関係の心理(鳩山C)', teacher: '高橋 徹', room: '204', semester: 'spring', target: '全コース' },
  { day: '水', period: 3, name: 'モバイルアプリ開発', teacher: '陳 致中', room: '3210', semester: 'spring', target: 'd2,d3' },
  { day: '水', period: 3, name: '情報デザイン基礎演習', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd4' },
  { day: '水', period: 4, name: 'アジア文化研究', teacher: '金 泰勲', room: '202', semester: 'spring', target: '全コース' },
  { day: '水', period: 4, name: 'コンピュータネットワーク', teacher: '秋山 康智', room: '201', semester: 'spring', target: 'd2,d3' },
  { day: '水', period: 4, name: 'Webデザイン演習', teacher: '柳 実', room: '3310', semester: 'spring', target: 'd4' },
  { day: '水', period: 5, name: 'オブジェクト指向', teacher: '藤本 衡', room: '3210', semester: 'spring', target: 'd1,d2' },

  { day: '木', period: 2, name: 'オペレーティングシステム', teacher: '中山 洋', room: '201', semester: 'spring', target: 'd2,d3' },
  { day: '木', period: 2, name: 'ネットワークセキュリティ', teacher: '秋山 康智', room: '221', semester: 'spring', target: 'd1,d3' },
  { day: '木', period: 2, name: '音響メディア論', teacher: '柴山 拓郎', room: '202', semester: 'spring', target: 'd4' },
  { day: '木', period: 3, name: 'データベース構成論', teacher: '陳 致中', room: '201', semester: 'spring', target: 'd1,d2' },
  { day: '木', period: 3, name: '情報バリアフリー', teacher: '徳田 太郎', room: '283A', semester: 'spring', target: 'd3,d4' },
  { day: '木', period: 3, name: '社会調査法', teacher: '鳥居 拓馬', room: '6102', semester: 'spring', target: 'd1' },
  { day: '木', period: 4, name: '深層学習', teacher: '佐藤 聖也', room: '201', semester: 'spring', target: 'd1' },
  { day: '木', period: 4, name: '情報デザイン演習Ⅰ', teacher: '徳田 太郎', room: '283A', semester: 'spring', target: 'd4' },

  { day: '金', period: 2, name: '数理とデザイン', teacher: '築地 立家', room: '202', semester: 'spring', target: 'd1,d4' },
  { day: '金', period: 2, name: '人間計測法', teacher: '矢口 博之', room: '221', semester: 'spring', target: 'd3' },
  { day: '金', period: 2, name: '実験心理・行動科学', teacher: '高橋 徹', room: '6109', semester: 'spring', target: 'd2' },
  { day: '金', period: 3, name: '基礎確率論', teacher: '佐藤 聖也', room: '201', semester: 'spring', target: 'RD' },
  { day: '金', period: 3, name: '数理最適化入門', teacher: '松浦 昭洋', room: '202', semester: 'spring', target: 'd1,d2' },
  { day: '金', period: 4, name: '統計学Ⅰ', teacher: '小河 誠巳', room: '201', semester: 'spring', target: 'RD' },
  { day: '金', period: 4, name: 'コンピュータプログラミングⅠ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'spring', target: 'RD' },
  { day: '金', period: 5, name: 'コンピュータプログラミングⅠ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'spring', target: 'RD' },

  // ================= 後期（fall）の授業 =================
  { day: '月', period: 2, name: '情報数学Ⅰ (再履修)', teacher: '小河/築地/松浦/佐藤/橋本/萩原', room: '3220他', semester: 'fall', target: 'RD' },
  { day: '月', period: 2, name: 'センサ工学', teacher: '泉 隆', room: '201', semester: 'fall', target: 'RD' },
  { day: '月', period: 3, name: '人工知能プログラミングⅡ', teacher: '佐藤 聖也', room: '3210', semester: 'fall', target: 'd1' },
  { day: '月', period: 3, name: '生成人工知能', teacher: '橋本 侑知', room: '201', semester: 'fall', target: 'd1,d2' },
  
  { day: '火', period: 1, name: '教育システムデザイン論', teacher: '徳田 太郎', room: '283A', semester: 'fall', target: 'd4' },
  { day: '火', period: 3, name: '環境心理学', teacher: '鳥居 拓馬', room: '201', semester: 'fall', target: 'd3,d4' },

  { day: '水', period: 1, name: 'ゲームプログラミングⅡ', teacher: '藤本 衡', room: '3210', semester: 'fall', target: 'd2' },
  { day: '水', period: 2, name: '統計学Ⅱ', teacher: '佐藤 聖也', room: '201', semester: 'fall', target: 'd1' },
  { day: '水', period: 3, name: 'コンピュータグラフィックス', teacher: '茅 暁陽', room: '221', semester: 'fall', target: 'd2,d4' },
  { day: '水', period: 4, name: '組み込みシステム', teacher: '中山 洋', room: '6205', semester: 'fall', target: 'd2,d3' },
  { day: '水', period: 4, name: '映像制作論', teacher: '柴山 拓郎', room: '202', semester: 'fall', target: 'd4' },
  
  { day: '木', period: 2, name: '音楽構造論', teacher: '柴山 拓郎', room: '202', semester: 'fall', target: 'd4' },
  { day: '木', period: 2, name: 'アルゴリズムとデータ構造Ⅱ', teacher: '松浦 昭洋', room: '201', semester: 'fall', target: 'd1,d2' },
  { day: '木', period: 3, name: '分散システム', teacher: '秋山 康智', room: '201', semester: 'fall', target: 'd2,d3' },
  { day: '木', period: 3, name: '3次元インタラクション', teacher: '矢口 博之', room: '221', semester: 'fall', target: 'd3,d4' },
  { day: '木', period: 4, name: '情報システム演習Ⅱ', teacher: '陳 致中 / 中山 洋', room: '3210,3220', semester: 'fall', target: 'd2,d3' },
  { day: '木', period: 4, name: '情報デザイン演習Ⅱ', teacher: '徳田 太郎', room: '283A', semester: 'fall', target: 'd4' },
  { day: '木', period: 5, name: 'ITビジネスモデル論', teacher: '大場 みち子', room: '201', semester: 'fall', target: 'RD' },
  
  { day: '金', period: 2, name: 'ネットワーク構成論', teacher: '秋山 康智', room: '201', semester: 'fall', target: 'd3' },
  { day: '金', period: 2, name: 'ヒューマンファクターズ', teacher: '矢口 博之', room: '221', semester: 'fall', target: 'd1,d3' },
  { day: '金', period: 3, name: '信号・システム基礎', teacher: '小河 誠巳', room: '201', semester: 'fall', target: 'd1,d3' },
  { day: '金', period: 3, name: 'サービスデザイン論', teacher: '徳田 太郎', room: '283A', semester: 'fall', target: 'd4' },
  { day: '金', period: 4, name: 'コンピュータプログラミングⅡ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'fall', target: 'RD' },
  { day: '金', period: 5, name: 'コンピュータプログラミングⅡ・同演習', teacher: '藤本 衡 / 萩原 健夫', room: '3210,3220', semester: 'fall', target: 'RD' }
];

function TimetablePage() {
  const [semester, setSemester] = useState('spring')
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saveMessage, setSaveMessage] = useState('') 
  
  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('isd_timetable_data')
    return saved ? JSON.parse(saved) : { spring: {}, fall: {} }
  })

  const [grade, setGrade] = useState(() => {
    return localStorage.getItem('isd_grade') || ''
  })

  const [mainCourse, setMainCourse] = useState(() => {
    return localStorage.getItem('isd_main_course') || ''
  })

  const [subCourse, setSubCourse] = useState(() => {
    return localStorage.getItem('isd_sub_course') || ''
  })

  const [isGradeConfirmed, setIsGradeConfirmed] = useState(() => {
    const saved = localStorage.getItem('isd_is_grade_confirmed')
    return saved ? JSON.parse(saved) : false
  })

  const [isCourseConfirmed, setIsCourseConfirmed] = useState(() => {
    const saved = localStorage.getItem('isd_is_course_confirmed')
    return saved ? JSON.parse(saved) : false
  })

  const [isTargetDept, setIsTargetDept] = useState(null)
  const [pageMode, setPageMode] = useState(null)

  useEffect(() => {
    localStorage.setItem('isd_grade', grade)
  }, [grade])

  useEffect(() => {
    localStorage.setItem('isd_main_course', mainCourse)
  }, [mainCourse])

  useEffect(() => {
    localStorage.setItem('isd_sub_course', subCourse)
  }, [subCourse])

  useEffect(() => {
    localStorage.setItem('isd_is_grade_confirmed', JSON.stringify(isGradeConfirmed))
  }, [isGradeConfirmed])

  useEffect(() => {
    localStorage.setItem('isd_is_course_confirmed', JSON.stringify(isCourseConfirmed))
  }, [isCourseConfirmed])


  const getCellKey = (day, period) => `${day}-${period}`

  const handleCellClick = (day, period) => {
    if (isTargetDept !== true || pageMode !== 'edit' || !isCourseConfirmed) return;

    const key = getCellKey(day, period)
    const availableCourses = getFilteredCourses(day, period)

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

  // 💡 【修正】選択中のコース（mainCourse, subCourse）に関係あるターゲット表記だけを抽出するヘルパー関数
  const getDisplayTarget = (originalTarget) => {
    if (['RD', '全コース', '学系専門'].includes(originalTarget)) return originalTarget;
    
    // カンマ区切り（例: 'd3,d4'）を分解し、自分の選択コースに含まれるものだけを残す
    const targets = originalTarget.split(',');
    const filtered = targets.filter(t => t === mainCourse || t === subCourse);
    
    // もしフィルター後に何も残らなければ元の文字列を返し、残れば綺麗にカンマで再結合する
    return filtered.length > 0 ? filtered.join(',') : originalTarget;
  };

  // 💡 【修正】フィルタリングしつつ、ドロップダウン表示用にtarget文字列を書き換えたオブジェクトを返す
  const getFilteredCourses = (day, period) => {
    const baseCourses = COURSE_MASTER.filter(
      c => c.day === day && c.period === period && c.semester === semester
    );

    if (pageMode === 'edit' && isCourseConfirmed) {
      return baseCourses
        .filter(course => {
          const target = course.target;
          if (target === 'RD' || target === '全コース' || target === '学系専門') return true;
          const targetCourses = target.split(',');
          return targetCourses.includes(mainCourse) || targetCourses.includes(subCourse);
        })
        .map(course => ({
          ...course,
          // 💡 表示用に、自分に関係のないコース文字（例：d3）を削る
          displayTarget: getDisplayTarget(course.target)
        }));
    }
    
    return baseCourses.map(course => ({ ...course, displayTarget: course.target }));
  }

  const determineColor = (target) => {
    if (!target) return COURSE_COLORS.default;
    
    if (target.includes('d1') && (mainCourse === 'd1' || !target.includes(mainCourse))) return COURSE_COLORS.d1;
    if (target.includes('d2') && (mainCourse === 'd2' || !target.includes(mainCourse))) return COURSE_COLORS.d2;
    if (target.includes('d3') && (mainCourse === 'd3' || !target.includes(mainCourse))) return COURSE_COLORS.d3;
    if (target.includes('d4') && (mainCourse === 'd4' || !target.includes(mainCourse))) return COURSE_COLORS.d4;
    
    if (target.includes('d1')) return COURSE_COLORS.d1;
    if (target.includes('d2')) return COURSE_COLORS.d2;
    if (target.includes('d3')) return COURSE_COLORS.d3;
    if (target.includes('d4')) return COURSE_COLORS.d4;
    
    return COURSE_COLORS.default;
  };

  const handleSaveCell = (currentValue) => {
    const targetValue = currentValue !== undefined ? currentValue : editValue;
    
    if (editingCell && targetValue) {
      const selectedCourse = COURSE_MASTER.find(c => c.name === targetValue && c.semester === semester);
      const color = selectedCourse ? determineColor(selectedCourse.target) : COURSE_COLORS.default;
      
      setTimetable(prev => ({
        ...prev,
        [semester]: {
          ...(prev[semester] || {}),
          [editingCell]: { 
            name: targetValue, 
            color,
            room: selectedCourse ? selectedCourse.room : '',
            teacher: selectedCourse ? selectedCourse.teacher : '',
            target: selectedCourse ? selectedCourse.target : ''
          }
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

  const handleSaveToStorage = () => {
    localStorage.setItem('isd_timetable_data', JSON.stringify(timetable));
    setSaveMessage('✅ 変更内容を保存しました！');
    setTimeout(() => setSaveMessage(''), 3000);
  }

  const handleStartNewTimetable = () => {
    if (window.confirm('⚠️ 警告\n保存されている現在の時間割やコース設定がすべて消去されます。本当によろしいですか？')) {
      setGrade('');
      setMainCourse('');
      setSubCourse('');
      setIsGradeConfirmed(false);
      setIsCourseConfirmed(false);
      setTimetable({ spring: {}, fall: {} });
      localStorage.removeItem('isd_timetable_data');
      localStorage.removeItem('isd_grade');
      localStorage.removeItem('isd_main_course');
      localStorage.removeItem('isd_sub_course');
      localStorage.removeItem('isd_is_grade_confirmed');
      localStorage.removeItem('isd_is_course_confirmed');
      
      setPageMode('edit');
    }
  }

  const handleBackToStart = () => {
    setIsTargetDept(null);
    setPageMode(null);
  }

  const canShowTimetable = isTargetDept === true && (pageMode === 'view' || (pageMode === 'edit' && isCourseConfirmed));

  const currentSemesterTimetable = timetable[semester] || {}
  const registeredCount = Object.keys(currentSemesterTimetable).length
  const totalCredits = registeredCount * 2

  const getCourseName = (courseId) => {
    const course = COURSES.find(c => c.id === courseId);
    return course ? course.name.split(' ')[0] : courseId;
  }

  return (
    <main className="timetable-page" style={{ position: 'relative', paddingBottom: '60px' }}>
      
      {/* 1. 対象外の学系ブロック画面 */}
      {isTargetDept === false && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#fff', zIndex: 100, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center'
        }}>
          <h1 style={{ color: '#EF5350', fontSize: '24px' }}>⚠️ 対象外の学系です</h1>
          <p style={{ fontSize: '16px', marginTop: '15px', lineHeight: '1.6', color: '#555' }}>
            申し訳ありません。この時間割作成ツールは<br />
            <strong>「情報システムデザイン学系」</strong>の学生専用です。
          </p>
          <button onClick={handleBackToStart} style={{ marginTop: '25px', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', border: '1px solid #ccc', background: '#fff' }}>
            ← やり直す
          </button>
        </div>
      )}

      {/* 2. 第一段階：学系の確認 */}
      {isTargetDept === null && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)',
          zIndex: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>🎓 確認</h2>
            <p style={{ fontSize: '15px', marginBottom: '25px', color: '#666', lineHeight: '1.5' }}>
              あなたは<strong>「情報システムデザイン学系」</strong>の所属ですか？
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button onClick={() => setIsTargetDept(true)} style={{ flex: 1, padding: '12px 0', fontSize: '15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#42A5F5', color: '#fff', border: 'none', fontWeight: 'bold' }}>はい</button>
              <button onClick={() => setIsTargetDept(false)} style={{ flex: 1, padding: '12px 0', fontSize: '15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#EF5350', color: '#fff', border: 'none', fontWeight: 'bold' }}>いいえ</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 第二段階：目的の確認 */}
      {isTargetDept === true && pageMode === null && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)',
          zIndex: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#333' }}>🔍 目的を選択</h2>
            <p style={{ fontSize: '14px', marginBottom: '25px', color: '#666' }}>行いたい操作を選択してください。</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => { setPageMode('edit'); setIsGradeConfirmed(true); }} style={{ padding: '14px 0', fontSize: '15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#42A5F5', color: '#fff', border: 'none', fontWeight: 'bold' }}>
                📝 前回の続きから登録・編集
              </button>
              
              <button onClick={handleStartNewTimetable} style={{ padding: '14px 0', fontSize: '15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#FF9800', color: '#fff', border: 'none', fontWeight: 'bold' }}>
                ✨ 完全に新規で履修登録する
              </button>
              
              <button onClick={() => setPageMode('view')} style={{ padding: '14px 0', fontSize: '15px', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#26A69A', color: '#fff', border: 'none', fontWeight: 'bold' }}>
                👀 時間割の確認（見るだけ）
              </button>

              <button onClick={handleBackToStart} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginTop: '10px', fontSize: '13px' }}>
                ← 前の画面に戻る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 第三段階：学年選択 */}
      {isTargetDept === true && pageMode === 'edit' && !isGradeConfirmed && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)',
          zIndex: 93, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>🌱 学年選択</h2>
            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>
              あなたの現在の<strong>学年</strong>を選択してください。
            </p>
            
            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <select value={grade} onChange={e => setGrade(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}>
                <option value="">-- 学年を選択してください --</option>
                <option value="1">1年生</option>
                <option value="2">2年生</option>
                <option value="3">3年生</option>
                <option value="4">4年生</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setIsGradeConfirmed(true)} disabled={!grade} style={{ padding: '12px 0', fontSize: '15px', borderRadius: '6px', cursor: !grade ? 'not-allowed' : 'pointer', backgroundColor: !grade ? '#ccc' : '#42A5F5', color: '#fff', border: 'none', fontWeight: 'bold' }}>次へ進む (コース選択) →</button>
              <button onClick={() => setPageMode(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginTop: '5px', fontSize: '13px' }}>← 目的の選択に戻る</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 第四段階：コース選択 */}
      {isTargetDept === true && pageMode === 'edit' && isGradeConfirmed && !isCourseConfirmed && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)',
          zIndex: 95, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>🎯 コース選択</h2>
            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>
              {grade && <span style={{ color: '#42A5F5', fontWeight: 'bold' }}>{grade}年生の</span>}
              <strong>「主コース」</strong>と<strong>「副コース」</strong>をそれぞれ選択してください。
            </p>
            
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>主コース</label>
              <select value={mainCourse} onChange={e => setMainCourse(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}>
                <option value="">-- 主コースを選択してください --</option>
                {COURSES.map(c => <option key={`main-${c.id}`} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>副コース</label>
              <select value={subCourse} onChange={e => setSubCourse(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}>
                <option value="">-- 副コースを選択してください --</option>
                {COURSES.map(c => <option key={`sub-${c.id}`} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => setIsCourseConfirmed(true)} disabled={!mainCourse || !subCourse} style={{ padding: '12px 0', fontSize: '15px', borderRadius: '6px', cursor: !mainCourse || !subCourse ? 'not-allowed' : 'pointer', backgroundColor: !mainCourse || !subCourse ? '#ccc' : '#42A5F5', color: '#fff', border: 'none', fontWeight: 'bold' }}>決定して時間割へ</button>
              <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginTop: '5px', fontSize: '13px' }} onClick={() => setIsGradeConfirmed(false)}>← 学年選択に戻る</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 本体の時間割画面 */}
      {canShowTimetable && (
        <div className="timetable-container">
          <div className="timetable-page-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#42A5F5', fontWeight: 'bold', marginBottom: '2px' }}>
                🎓 情報システムデザイン学系 
                {grade && <span> [{grade}年生]</span>}
                {pageMode === 'view' && <span style={{ color: '#26A69A', marginLeft: '8px' }}>[閲覧モード]</span>}
                {pageMode === 'edit' && isCourseConfirmed && (
                  <span style={{ color: '#ff9800', marginLeft: '8px' }}>
                    [主: {getCourseName(mainCourse)} / 副: {getCourseName(subCourse)}]
                  </span>
                )}
              </div>
            </div>
            <h1 className="timetable-title" style={{ marginTop: 0 }}>📅 時間割作成</h1>
            <div className="semester-toggle">
              <button className={`semester-btn ${semester === 'spring' ? 'semester-btn--active' : ''}`} onClick={() => setSemester('spring')}>前期</button>
              <button className={`semester-btn ${semester === 'fall' ? 'semester-btn--active' : ''}`} onClick={() => setSemester('fall')}>後期</button>
            </div>
          </div>

          <div className="timetable-stats">
            <div className="timetable-stat">📚 <span className="timetable-stat-label">登録科目</span> <span className="timetable-stat-value">{registeredCount}</span></div>
            <div className="timetable-stat">🎓 <span className="timetable-stat-label">合計単位</span> <span className="timetable-stat-value">{totalCredits}</span></div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: COURSE_COLORS.d1, borderRadius: '3px', border: '1px solid #ddd' }}></span> AI・DS (d1)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: COURSE_COLORS.d2, borderRadius: '3px', border: '1px solid #ddd' }}></span> ソフデリ (d2)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: COURSE_COLORS.d3, borderRadius: '3px', border: '1px solid #ddd' }}></span> ネット (d3)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: COURSE_COLORS.d4, borderRadius: '3px', border: '1px solid #ddd' }}></span> メディア (d4)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: COURSE_COLORS.default, borderRadius: '3px', border: '1px solid #ddd' }}></span> 共通・学系</div>
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
                    
                    const availableCourses = getFilteredCourses(day, period);

                    return (
                      <div key={key} className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                        style={entry ? { '--cell-color': entry.color, color: '#333' } : {}}
                        onClick={() => !isEditing && handleCellClick(day, period)}
                      >
                        {isEditing ? (
                          <select 
                            className="timetable-cell-input" 
                            value={editValue} 
                            onChange={e => {
                              setEditValue(e.target.value);
                              handleSaveCell(e.target.value);
                            }} 
                            onBlur={() => handleSaveCell(editValue)}
                            autoFocus
                            style={{ width: '100%', height: '100%', padding: '2px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc' }}
                          >
                            <option value="">-- 科目を選択 --</option>
                            {availableCourses.map(c => (
                              <option key={c.name} value={c.name}>
                                {/* 💡 【修正】c.target ではなく、自分に関係あるコースに絞られた c.displayTarget を使う */}
                                {c.name} ({c.room}) [{c.displayTarget}]
                              </option>
                            ))}
                            {entry && <option value="">❌ 選択を解除（削除）</option>}
                          </select>
                        ) : entry ? (
                          <div className="timetable-cell-content" style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px', height: '100%', justifyContent: 'center' }}>
                            <span className="timetable-cell-name" style={{ fontWeight: 'bold', fontSize: '12px', lineHeight: '1.2' }}>{entry.name}</span>
                            {entry.room && <span className="timetable-cell-room" style={{ fontSize: '10px', opacity: 0.9 }}>📍 {entry.room}</span>}
                            {entry.teacher && <span className="timetable-cell-teacher" style={{ fontSize: '9px', opacity: 0.8 }}>👤 {entry.teacher}</span>}
                          </div>
                        ) : (availableCourses.length > 0 && pageMode === 'edit') ? (
                          <span className="timetable-cell-placeholder">+</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 操作ボタンエリア */}
          <div style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {saveMessage && (
              <div style={{ color: '#4CAF50', fontSize: '14px', fontWeight: 'bold' }}>
                {saveMessage}
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '500px' }}>
              {pageMode === 'edit' && (
                <button 
                  onClick={handleSaveToStorage} 
                  style={{ flex: 2, padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                >
                  💾 現在の時間割を保存する
                </button>
              )}
              <button 
                onClick={handleBackToStart} 
                style={{ flex: 1, padding: '12px 16px', backgroundColor: '#fff', color: '#EF5350', border: '1px solid #EF5350', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🔄 モード選択に戻る
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TimetablePage;