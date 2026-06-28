import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

// 🎓 東京電機大学理工学部の学年別単位目安
// 1→2年次：30単位、3→4年次：104単位、卒業要件：124単位
const GRADE_CREDIT_REQUIREMENTS = {
  '1': { label: '2年次進級まで', required: 30 },
  '2': { label: '4年次進級まで', required: 104 },
  '3': { label: '4年次進級まで', required: 104 },
  '4': { label: '卒業まで', required: 124 },
};

const COURSE_COLORS = {
  RD: '#E3F2FD',      // RD共通科目
  d1: '#FFF59D',      // コンピュータソフトウェア
  d2: '#90CAF9',      // 情報システム
  d3: '#A5D6A7',      // 知能情報デザイン
  d4: '#F48FB1',      // アミューズメントデザイン
  mixed: '#D1C4E9',   // 複数コース対象
  default: '#E0E0E0',
};

const COURSE_LABELS = {
  RD: 'RD共通',
  d1: 'd1',
  d2: 'd2',
  d3: 'd3',
  d4: 'd4',
  mixed: '複数',
  default: 'その他',
}

const normalizeCourseId = (value = '') => {
  const text = String(value)
  if (text.includes('d1')) return 'd1'
  if (text.includes('d2')) return 'd2'
  if (text.includes('d3')) return 'd3'
  if (text.includes('d4')) return 'd4'
  if (text.includes('RD')) return 'RD'
  return 'default'
}

const getCourseColorKey = (target = '', preferredCourse = '') => {
  const text = String(target)
  const preferred = normalizeCourseId(preferredCourse)

  // 複数コース対象の授業は、選択中の主コースが含まれていればその色を優先
  if (['d1', 'd2', 'd3', 'd4'].includes(preferred) && text.includes(preferred)) {
    return preferred
  }

  if (text === 'RD' || text.includes('RD')) return 'RD'

  const targets = ['d1', 'd2', 'd3', 'd4'].filter((id) => text.includes(id))
  if (targets.length === 1) return targets[0]
  if (targets.length >= 2) return 'mixed'

  return 'default'
}

const getCourseColor = (target = '', preferredCourse = '') => {
  const key = getCourseColorKey(target, preferredCourse)
  return COURSE_COLORS[key] || COURSE_COLORS.default
}

const COURSES = [
  { id: 'd1', name: 'コンピュータソフトウェア (d1)' },
  { id: 'd2', name: '情報システム (d2)' },
  { id: 'd3', name: '知能情報デザイン (d3)' },
  { id: 'd4', name: 'アミューズメントデザイン (d4)' },
];


// 📊 コース別単位要件
// 画像の学生便覧に合わせて、主コースは18/26単位、副コースは5/8単位で判定します。
// ※副コースが他学系の場合は 9/14 単位に変更してください。
const COURSE_CREDIT_META = {
  d1: { icon: '💻', name: 'コンピュータソフトウェア', theme: '#3498db' },
  d2: { icon: '🗄️', name: '情報システム', theme: '#27ae60' },
  d3: { icon: '🧠', name: '知能情報デザイン', theme: '#f1c40f' },
  d4: { icon: '🎮', name: 'アミューズメントデザイン', theme: '#e84393' },
}

const COURSE_ROLE_REQUIREMENTS = {
  main: { label: '主コース', thirdYear: 18, graduation: 26 },
  sub: { label: '副コース', thirdYear: 5, graduation: 8 },
}

const COURSE_CREDIT_INITIAL = {
  d1: '',
  d2: '',
  d3: '',
  d4: '',
}

const COURSE_MASTER = [
  // 🗓️ 月曜日
  { day: "月", period: 2, name: "動的システム", teacher: "小河 誠巳", room: "6101", semester: 'spring', target: "d2", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 2, name: "現代マスコミ論", teacher: "中山 洋", room: "204", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: false },
  { day: "月", period: 2, name: "情報セキュリティ概論", teacher: "橋本 侑知", room: "201", semester: 'spring', target: "d1,d2", grade: 3, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "情報数学Ⅱ", teacher: "築地 立家 / 小河 誠巳", room: "3330,3340", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "社会心理学", teacher: "鳥居 拓馬", room: "6102", semester: 'spring', target: "d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "認知心理学", teacher: "鳥居 拓馬", room: "6102", semester: 'spring', target: "d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "インタラクティブデザイン論", teacher: "矢口 博之", room: "221", semester: 'spring', target: "d3,d4", grade: 3, type: "選択", hasAttendance: false },
  { day: "月", period: 3, name: "計算量と暗号", teacher: "橋本 侑知", room: "201", semester: 'spring', target: "d1,d2", grade: 3, type: "選択", hasAttendance: true },
  { day: "月", period: 4, name: "情報システム総合演習", teacher: "学系教員", room: "203,204,124,221", semester: 'spring', target: "d1,d2", grade: 3, type: "必修", hasAttendance: true },
  { day: "月", period: 5, name: "人工知能プログラミングⅠ", teacher: "高橋 達二 / 甲野 佑", room: "117", semester: 'spring', target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },

  // 🗓️ 火曜日
  { day: "火", period: 1, name: "業務システム設計論", teacher: "中山 洋", room: "117", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 1, name: "ＵＮＩＸプログラミング", teacher: "泉 智紀", room: "203", semester: 'spring', target: "d2", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 2, name: "データベース", teacher: "中山 洋", room: "117", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 3, name: "造形デザイン入門", teacher: "柴山 拓郎 / 大場 久恵 / 志水 賢二 / 大野 茉莉 / 小池 駿太", room: "321,3311,3320", semester: 'spring', target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 3, name: "電気基礎", teacher: "泉 智紀", room: "8203", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "火", period: 3, name: "コンピュータ設計学", teacher: "築地 立家", room: "203", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "造形デザイン入門", teacher: "柴山 拓郎 / 大場 久恵 / 志水 賢二 / 大野 茉莉 / 小池 駿太", room: "321,3311,3320", semester: 'spring', target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "数値解析学", teacher: "徳田 太郎", room: "6102", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "オペレーティングシステム", teacher: "藤本 衡", room: "203", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 5, name: "知能情報デザイン概論", teacher: "篠原 修二 / 高橋 達二 / 日髙 章理 / 佐藤 聖也 / 小林 春美 / 鳥居 拓馬", room: "321", semester: 'spring', target: "d3", grade: 2, type: "選択", hasAttendance: true },

  // 🗓️ 水曜日
  { day: "水", period: 1, name: "情報産業論", teacher: "中山 洋", room: "201", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "コミュニケーションデザイン", teacher: "矢口 博之 / 大場 久恵", room: "221", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "コミュニケーション科学", teacher: "矢口 博之 / 大場 久恵", room: "221", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "音楽とデザイン", teacher: "柴山 拓郎 / 新井 聡真 / 中村 隆行", room: "201", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "多変量解析", teacher: "佐藤 聖也 / 高橋 達二", room: "117", semester: 'spring', target: "d2,d3,d4", grade: 3, type: "選択", hasAttendance: true },
  { day: "水", period: 3, name: "ゲームプログラミングⅠ", teacher: "柴田 良二", room: "203,204", semester: 'spring', target: "d1,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 5, name: "オブジェクト指向プログラミング", teacher: "佐藤 聖也 / 高橋 達二", room: "204", semester: 'spring', target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },

  // 🗓️ 木曜日
  { day: "木", period: 1, name: "情報システムデザイン概論", teacher: "学系教員", room: "201", semester: 'spring', target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "木", period: 1, name: "五感とデザイン", teacher: "中山 洋 / 竹本 清香 / 村田 早苗 / 佐藤 英里子", room: "204", semester: 'spring', target: "d3,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "アルゴリズムとデータ構造Ⅰ", teacher: "笹川 隆史 / 橋本 侑知 / 橋浦 弘明", room: "204", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "技術と表現", teacher: "勝本 雄一朗", room: "203", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "空間演出デザイン論", teacher: "勝本 雄一朗", room: "203", semester: 'spring', target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "地域貢献論", teacher: "柴山 拓郎 / 竹本 清香 / 村田 早苗 / 小田 雅昭 / 石川 智弥", room: "321", semester: 'spring', target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "木", period: 3, name: "データ表現とプログラミング", teacher: "高橋 達二 / 佐藤 聖也", room: "204", semester: 'spring', target: "d1,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 3, name: "情報デザイン総合演習", teacher: "学系教員", room: "124,221,321,324,325", semester: 'spring', target: "d3,d4", grade: 3, type: "必修", hasAttendance: true },
  { day: "木", period: 4, name: "情報システム演習Ⅰ", teacher: "学系教員", room: "124,2320", semester: 'spring', target: "d1,d2", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 4, name: "情報デザイン演習Ⅰ", teacher: "学系教員", room: "221,321,324,325,329", semester: 'spring', target: "d3,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 4, name: "深層学習", teacher: "日髙 章理", room: "117", semester: 'spring', target: "d1,d2,d3", grade: 3, type: "選択", hasAttendance: true },

  // 🗓️ 金曜日
  { day: "金", period: 2, name: "人間計測法", teacher: "篠原 修二", room: "124", semester: 'spring', target: "d3,d4", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 2, name: "実験心理・行動科学", teacher: "篠原 修二", room: "124", semester: 'spring', target: "d3,d4", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 2, name: "数理とデザイン", teacher: "松浦 昭洋", room: "204", semester: 'spring', target: "d1,d3,d4", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 3, name: "基礎確率論", teacher: "藤本 衡", room: "204", semester: 'spring', target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "金", period: 3, name: "数理最適化入門", teacher: "陳 致中", room: "324", semester: 'spring', target: "d1,d2,d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 4, name: "コンピュータプログラミングⅠ・同演習", teacher: "徳田 太郎 / 陳 致中 / 佐藤 聖也 / 小河 誠巳 / 橋浦 弘明", room: "203,124,221,321,207", semester: 'spring', target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "金", period: 4, name: "ＣプログラミングⅠ・同演習", teacher: "徳田 太郎 / 陳 致中 / 佐藤 聖也 / 小河 誠巳 / 橋浦 弘明", room: "203,124,221,321,207", semester: 'spring', target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "金", period: 4, name: "統計学Ⅰ", teacher: "篠原 修二 / 鳥居 拓馬", room: "204", semester: 'spring', target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "金", period: 5, name: "コンピュータプログラミングⅠ・同演習", teacher: "徳田 太郎 / 陳 致中 / 佐藤 聖也 / 小河 誠巳 / 橋浦 弘明", room: "203,124,221,321,207", semester: 'spring', target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "金", period: 5, name: "ＣプログラミングⅠ・同演習", teacher: "徳田 太郎 / 陳 致中 / 佐藤 聖也 / 小河 誠巳 / 橋浦 弘明", room: "203,124,221,321,207", semester: 'spring', target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "金", period: 5, name: "ＣＧプログラミング", teacher: "築地 立家 / 萩原 健夫", room: "2111,2112,2113", semester: 'spring', target: "d1,d3,d4", grade: 3, type: "選択", hasAttendance: true },

  // 🗓️ 土曜日
  { day: "土", period: 1, name: "情報システムデザイン卒業研究Ⅰ", teacher: "学系教員", room: "", semester: 'spring', target: "RDコース専門", grade: 4, type: "必修", hasAttendance: true },
  { day: "土", period: 2, name: "情報システムデザイン卒業研究Ⅰ", teacher: "学系教員", room: "", semester: 'spring', target: "RDコース専門", grade: 4, type: "必修", hasAttendance: true },
  { day: "土", period: 3, name: "情報システムデザイン卒業研究Ⅰ", teacher: "学系教員", room: "", semester: 'spring', target: "RDコース専門", grade: 4, type: "必修", hasAttendance: true },

  // ===== 後期授業 =====
  { day: "月", period: 2, name: "情報数学Ⅰ", teacher: "小河 誠巳 / 築地 立家 / 松浦 昭洋 / 佐藤 聖也 / 橋本 侑知 / 萩原 健夫", room: "3220,3230,3320,3330,3340,3350", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "月", period: 2, name: "センサ工学", teacher: "泉 智紀", room: "3150", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "コンピュータ基礎", teacher: "築地 立家 / 笹川 隆史 / 小河 誠巳 / 秋山 康智 / 萩原 健夫", room: "3320,3330,3340,3350,3150", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "コンピュータ基礎Ⅰ", teacher: "築地 立家 / 笹川 隆史 / 小河 誠巳 / 秋山 康智 / 萩原 健夫", room: "3320,3330,3340,3350,3150", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "人工知能プログラミングⅡ", teacher: "高橋 達二 / 甲野 佑", room: "117", semester: "fall", target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "人工知能プログラミングⅡ", teacher: "高橋 達二 / 甲野 佑", room: "117", semester: "fall", target: "d1,d2,d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "月", period: 3, name: "生成人工知能", teacher: "日髙 章理", room: "203", semester: "fall", target: "d1,d2,d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "月", period: 4, name: "情報ネットワーク概論", teacher: "藤本 衡", room: "204", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "月", period: 5, name: "情報学ゼミ", teacher: "小河 誠巳 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 秋山 康智 / 大場 久恵 / 神戸 英利 / 橋浦 弘明 / 竹本 清香 / 村田 早苗 / 佐藤 英里子 / 甲野 佑", room: "2112,2113", semester: "fall", target: "RD", grade: 3, type: "必修", hasAttendance: true },
  { day: "火", period: 1, name: "教育システムデザイン論", teacher: "中山 洋", room: "12426A", semester: "fall", target: "d4", grade: 3, type: "選択", hasAttendance: true },
  { day: "火", period: 2, name: "線形代数学Ⅱ", teacher: "小黒 隆 / 髙橋 秀慈", room: "3220,3230", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 3, name: "コンピュータプログラミングⅡ・同演習", teacher: "陳 致中 / 徳田 太郎 / 日髙 章理 / 佐藤 聖也 / 橋浦 弘明", room: "203,124,221,224,321", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 3, name: "ＣプログラミングⅡ・同演習", teacher: "陳 致中 / 徳田 太郎 / 日髙 章理 / 佐藤 聖也 / 橋浦 弘明", room: "203,124,221,224,321", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "コンピュータプログラミングⅡ・同演習", teacher: "陳 致中 / 徳田 太郎 / 日髙 章理 / 佐藤 聖也 / 橋浦 弘明", room: "203,124,221,224,321", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "ＣプログラミングⅡ・同演習", teacher: "陳 致中 / 徳田 太郎 / 日髙 章理 / 佐藤 聖也 / 橋浦 弘明", room: "203,124,221,224,321", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "火", period: 4, name: "情報・符号理論", teacher: "松浦 昭洋", room: "6102", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "火", period: 5, name: "キャリア開発論", teacher: "小田 雅昭", room: "6101", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 1, name: "微分積分学Ⅱ", teacher: "越智 禎宏", room: "6104", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "水", period: 1, name: "ゲームプログラミングⅡ", teacher: "築地 立家 / 萩原 健夫", room: "117,2110", semester: "fall", target: "d1,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "統計学Ⅱ", teacher: "鳥居 拓馬 / 中村 光晃", room: "204", semester: "fall", target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 2, name: "美術・芸術学", teacher: "大場 久恵", room: "201", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 3, name: "コンピュータグラフィックス", teacher: "柴田 良二", room: "203,204", semester: "fall", target: "d1,d3,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 4, name: "映像制作論", teacher: "柴田 良二", room: "204", semester: "fall", target: "d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "水", period: 4, name: "組み込みシステム", teacher: "泉 智紀", room: "3230", semester: "fall", target: "d2", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 1, name: "色彩論", teacher: "大場 久恵", room: "201", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "アルゴリズムとデータ構造Ⅱ", teacher: "藤本 衡 / 橋浦 弘明", room: "204", semester: "fall", target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "音楽構造論", teacher: "柴山 拓郎", room: "203", semester: "fall", target: "d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "イメージ創造学", teacher: "勝本 雄一朗", room: "221", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "木", period: 2, name: "思考と試行", teacher: "勝本 雄一朗", room: "221", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "木", period: 3, name: "情報システム演習Ⅱ", teacher: "泉 智紀 / 藤本 衡 / 築地 立家 / 松浦 昭洋 / 笹川 隆史 / 小河 誠巳 / 秋山 康智 / 神戸 英利 / 橋浦 弘明 / 萩原 健夫 / 伊藤 史崇", room: "204", semester: "fall", target: "d1,d2", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 3, name: "情報デザイン演習Ⅱ", teacher: "矢口 博之 / 中山 洋 / 柴山 拓郎 / 高橋 達二 / 勝本 雄一朗 / 篠原 修二 / 鳥居 拓馬 / 大場 久恵 / 竹本 清香 / 村田 早苗 / 佐藤 英里子 / 大野 茉莉 / 石川 智弥", room: "124,321,324,325,326", semester: "fall", target: "d3,d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 3, name: "社会調査論", teacher: "氏家 豊", room: "203", semester: "fall", target: "d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "木", period: 4, name: "出版メディア論", teacher: "矢口 博之 / 石川 智弥", room: "124", semester: "fall", target: "d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 4, name: "応用Ｊａｖａプログラミング", teacher: "陳 致中", room: "117", semester: "fall", target: "d1,d2,d3", grade: 2, type: "選択", hasAttendance: true },
  { day: "木", period: 5, name: "情報学ゼミ", teacher: "小河 誠巳 / 矢口 博之 / 陳 致中 / 日髙 章理 / 勝本 雄一朗 / 石川 智弥 / 新井 聡真 / 中村 隆行", room: "2110,2112,2113", semester: "fall", target: "RD", grade: 3, type: "必修", hasAttendance: true },
  { day: "金", period: 1, name: "メディア×カルチャー", teacher: "米田 祐介", room: "201", semester: "fall", target: "d4", grade: 2, type: "選択", hasAttendance: true },
  { day: "金", period: 1, name: "論理回路", teacher: "泉 智紀", room: "3210", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "金", period: 2, name: "デザイン学", teacher: "大場 久恵", room: "201", semester: "fall", target: "RD", grade: 1, type: "選択", hasAttendance: true },
  { day: "金", period: 2, name: "ソフトウェア工学", teacher: "秋山 康智 / 神戸 英利", room: "3210", semester: "fall", target: "d1,d2,d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 3, name: "基本情報処理技術", teacher: "伊藤 史崇", room: "204", semester: "fall", target: "RD", grade: 2, type: "選択", hasAttendance: true },
  { day: "金", period: 3, name: "データサイエンス入門", teacher: "鳥居 拓馬 / 篠原 修二", room: "221", semester: "fall", target: "d3", grade: 3, type: "選択", hasAttendance: true },
  { day: "金", period: 4, name: "情報学基礎実習", teacher: "松浦 昭洋 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 柴山 拓郎 / 日髙 章理 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 橋浦 弘明", room: "2320,203,204,321,327,328,329,12427", semester: "fall", target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "金", period: 5, name: "情報学基礎実習", teacher: "松浦 昭洋 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 柴山 拓郎 / 日髙 章理 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 橋浦 弘明", room: "2320,203,204,321,327,328,329,12427", semester: "fall", target: "RD", grade: 1, type: "必修", hasAttendance: true },
  { day: "土", period: 1, name: "情報システムデザイン特別卒業研究", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "土", period: 1, name: "情報システムデザイン卒業研究Ⅱ", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 4, type: "必修", hasAttendance: true },
  { day: "土", period: 2, name: "情報システムデザイン特別卒業研究", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "土", period: 2, name: "情報システムデザイン卒業研究Ⅱ", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 4, type: "必修", hasAttendance: true },
  { day: "土", period: 3, name: "情報システムデザイン特別卒業研究", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 3, type: "選択", hasAttendance: true },
  { day: "土", period: 3, name: "情報システムデザイン卒業研究Ⅱ", teacher: "秋山 康智 / 矢口 博之 / 陳 致中 / 中山 洋 / 藤本 衡 / 徳田 太郎 / 築地 立家 / 柴山 拓郎 / 松浦 昭洋 / 高橋 達二 / 日髙 章理 / 泉 智紀 / 笹川 隆史 / 佐藤 聖也 / 小林 春美 / 勝本 雄一朗 / 小河 誠巳 / 篠原 修二 / 橋本 侑知 / 鳥居 拓馬 / 大場 久恵 / 神戸 英利", room: "", semester: "fall", target: "RD", grade: 4, type: "必修", hasAttendance: true },
];

const REQUIRED_COURSES_BY_COURSE = {
  d1: [
    '情報システムデザイン概論',
    '情報学基礎実習',
    'CプログラミングⅠ・同演習',
    '情報学ゼミ',
    '情報システム演習Ⅰ',
    '情報システム演習Ⅱ',
    '情報システム総合演習',
  ],
  d2: [
    '情報システムデザイン概論',
    '情報学基礎実習',
    'CプログラミングⅠ・同演習',
    '情報学ゼミ',
    '情報システム演習Ⅰ',
    '情報システム演習Ⅱ',
    '情報システム総合演習',
  ],
  d3: [
    '情報システムデザイン概論',
    '情報学基礎実習',
    'CプログラミングⅠ・同演習',
    '情報学ゼミ',
    '情報デザイン演習Ⅰ',
    '情報デザイン演習Ⅱ',
    '情報デザイン総合演習',
  ],
  d4: [
    '情報システムデザイン概論',
    '情報学基礎実習',
    'CプログラミングⅠ・同演習',
    '情報学ゼミ',
    '情報デザイン演習Ⅰ',
    '情報デザイン演習Ⅱ',
    '情報デザイン総合演習',
  ],
};


const readJsonStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const readSessionJson = (key, fallback) => {
  try {
    const saved = sessionStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function TimetablePage() {
  const [semester, setSemester] = useState(() => localStorage.getItem('isd_selected_term') || 'spring')
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saveMessage, setSaveMessage] = useState('') 
  
  // 口コミページからブラウザバックした時だけ、直前の時間割画面を復元する
  // ホームなど別タブへ移動してから戻った場合は、必ず初期画面から表示する
  const shouldRestoreFromCourse = sessionStorage.getItem('isd_restore_timetable_from_course') === 'true'
  const savedScreenState = shouldRestoreFromCourse
    ? readSessionJson('isd_timetable_screen_state', {})
    : {}

  const [pageMode, setPageMode] = useState(savedScreenState.pageMode ?? null)
  const [editStep, setEditStep] = useState(savedScreenState.editStep ?? 'course-select') 
  const [viewStep, setViewStep] = useState(savedScreenState.viewStep ?? 'date-input')
  
  const [simulatedDateTime, setSimulatedDateTime] = useState(savedScreenState.simulatedDateTime ?? '')
  const [activePeriodName, setActivePeriodName] = useState(savedScreenState.activePeriodName ?? '')
  const [lockError, setLockError] = useState('')

  const [todayDate, setTodayDate] = useState(savedScreenState.todayDate ?? '')
  const [todayDayOfWeek, setTodayDayOfWeek] = useState(savedScreenState.todayDayOfWeek ?? '')
  const [lessonCount, setLessonCount] = useState(savedScreenState.lessonCount ?? 1)

  const [unipaData, setUnipaData] = useState(() => readJsonStorage('isd_manual_attendance', {}))

  const [timetable, setTimetable] = useState(() => readJsonStorage('isd_timetable_data', { spring: {}, fall: {} }))

  const [grade, setGrade] = useState(() => localStorage.getItem('isd_grade') || '')
  const [earnedCredits, setEarnedCredits] = useState(() => localStorage.getItem('isd_earned_credits') || '')
  const [courseEarnedCredits, setCourseEarnedCredits] = useState(() => readJsonStorage('isd_course_earned_credits', COURSE_CREDIT_INITIAL))
  const [studentId, setStudentId] = useState(() => localStorage.getItem('isd_student_id') || '')
  const [checkStudentId, setCheckStudentId] = useState('')
  const [studentIdError, setStudentIdError] = useState('')
  const [mainCourse, setMainCourse] = useState(() => localStorage.getItem('isd_main_course') || '')
  const [subCourse, setSubCourse] = useState(() => localStorage.getItem('isd_sub_course') || '')
  const [selectedTerm, setSelectedTerm] = useState(() => localStorage.getItem('isd_selected_term') || 'spring')
  const [missingRequiredCourses, setMissingRequiredCourses] = useState(() => readJsonStorage('isd_missing_required_courses', []))

  useEffect(() => { localStorage.setItem('isd_grade', grade) }, [grade])
  useEffect(() => { localStorage.setItem('isd_earned_credits', earnedCredits) }, [earnedCredits])
  useEffect(() => { localStorage.setItem('isd_student_id', studentId.trim().toUpperCase()) }, [studentId])
  useEffect(() => { localStorage.setItem('isd_main_course', mainCourse) }, [mainCourse])
  useEffect(() => { localStorage.setItem('isd_sub_course', subCourse) }, [subCourse])
  useEffect(() => {
    localStorage.setItem('isd_selected_term', selectedTerm)
    setSemester(selectedTerm)
  }, [selectedTerm])
  useEffect(() => {
    localStorage.setItem('isd_missing_required_courses', JSON.stringify(missingRequiredCourses))
  }, [missingRequiredCourses])
  useEffect(() => { localStorage.setItem('isd_timetable_data', JSON.stringify(timetable)) }, [timetable])
  useEffect(() => { localStorage.setItem('isd_manual_attendance', JSON.stringify(unipaData)) }, [unipaData])

  // 1年生を選択した場合は、以前の学年で入力した取得単位・コース情報を残さない
  useEffect(() => {
    if (grade === '1') {
      setEarnedCredits('0')
      setCourseEarnedCredits(COURSE_CREDIT_INITIAL)
      setMainCourse('')
      setSubCourse('')
      setMissingRequiredCourses([])

      localStorage.setItem('isd_earned_credits', '0')
      localStorage.setItem('isd_course_earned_credits', JSON.stringify(COURSE_CREDIT_INITIAL))
      localStorage.removeItem('isd_main_course')
      localStorage.removeItem('isd_sub_course')
      localStorage.setItem('isd_missing_required_courses', JSON.stringify([]))
    }
  }, [grade])

  useEffect(() => {
    sessionStorage.setItem('isd_timetable_screen_state', JSON.stringify({
      pageMode,
      editStep,
      viewStep,
      simulatedDateTime,
      activePeriodName,
      todayDate,
      todayDayOfWeek,
      lessonCount,
    }))
  }, [pageMode, editStep, viewStep, simulatedDateTime, activePeriodName, todayDate, todayDayOfWeek, lessonCount])

  useEffect(() => {
    // 復元は「口コミページから戻った1回だけ」にする
    if (shouldRestoreFromCourse) {
      sessionStorage.removeItem('isd_restore_timetable_from_course')
    }
  }, [])

  // 🧮 登録された時間割から現在の合計単位数を計算するロジック
  const calculateRegisteredCredits = () => {
    const currentSemesterTimetable = timetable[semester] || {};
    let registeredCredits = 0;

    Object.values(currentSemesterTimetable).forEach(cell => {
      if (cell && cell.name) {
        // 基本は1科目2単位として計算
        registeredCredits += 2;
      }
    });

    // 1年生は前年度取得単位がない前提なので、過去に保存された値が残っていても0単位として扱う
    const earned = grade === '1' ? 0 : Number(earnedCredits || 0);
    const projectedTotal = earned + registeredCredits;
    const gradeRequirement = GRADE_CREDIT_REQUIREMENTS[grade] || { label: '卒業まで', required: GRADUATION_REQUIREMENTS.total };
    const remainingForGrade = Math.max(gradeRequirement.required - earned, 0);
    const remainingAfterRegistration = Math.max(gradeRequirement.required - projectedTotal, 0);
    const remainingForGraduation = Math.max(GRADUATION_REQUIREMENTS.total - earned, 0);

    // 登録した授業のうち、何単位まで落としても進級・卒業目標を満たせるかを計算
    // 例：あと20単位必要で24単位登録している場合、4単位までは落としても目標達成、5単位落とすと留年リスク
    const safeFailCredits = Math.max(registeredCredits - remainingForGrade, 0);
    const failDangerCredits = registeredCredits > 0
      ? safeFailCredits + 1
      : remainingForGrade > 0 ? 1 : 0;
    const isAlreadyShortAfterRegistration = remainingAfterRegistration > 0;

    return {
      earned,
      registered: registeredCredits,
      projectedTotal,
      gradeTargetLabel: gradeRequirement.label,
      gradeTarget: gradeRequirement.required,
      remainingForGrade,
      remainingAfterRegistration,
      remainingForGraduation,
      safeFailCredits,
      failDangerCredits,
      isAlreadyShortAfterRegistration,
      percentage: Math.min(Math.round((earned / gradeRequirement.required) * 100), 100),
      projectedPercentage: Math.min(Math.round((projectedTotal / gradeRequirement.required) * 100), 100),
    };
  };

  const creditStats = calculateRegisteredCredits();


  const clampPercent = (value) => Math.max(0, Math.min(Math.round(value), 100));

  const calculateRegisteredCreditsByCourse = (courseId) => {
    const currentSemesterTimetable = timetable[semester] || {};
    let registeredCredits = 0;

    Object.values(currentSemesterTimetable).forEach((cell) => {
      if (!cell || !cell.name) return;
      const targetText = String(cell.target || '');
      if (targetText.includes(courseId)) {
        registeredCredits += 2;
      }
    });

    return registeredCredits;
  };

  const getSelectedCourseCreditItems = () => {
    const mainId = normalizeCourseId(mainCourse);
    const subId = normalizeCourseId(subCourse);
    const items = [];

    if (COURSE_CREDIT_META[mainId]) {
      items.push({ courseId: mainId, role: 'main' });
    }

    if (COURSE_CREDIT_META[subId] && subId !== mainId) {
      items.push({ courseId: subId, role: 'sub' });
    }

    return items;
  };

  const courseCreditStats = getSelectedCourseCreditItems().map(({ courseId, role }) => {
    const meta = COURSE_CREDIT_META[courseId];
    const requirement = COURSE_ROLE_REQUIREMENTS[role];
    const earned = grade === '1' ? 0 : Number(courseEarnedCredits?.[courseId] || 0);
    const registered = grade === '1' ? 0 : calculateRegisteredCreditsByCourse(courseId);
    const projectedTotal = earned + registered;
    const thirdYearRemaining = Math.max(requirement.thirdYear - projectedTotal, 0);
    const graduationRemaining = Math.max(requirement.graduation - projectedTotal, 0);

    return {
      id: courseId,
      role,
      roleLabel: requirement.label,
      ...meta,
      earned,
      registered,
      projectedTotal,
      thirdYear: requirement.thirdYear,
      graduation: requirement.graduation,
      thirdYearRemaining,
      graduationRemaining,
      thirdYearPercent: clampPercent((projectedTotal / requirement.thirdYear) * 100),
      graduationPercent: clampPercent((projectedTotal / requirement.graduation) * 100),
    };
  });

  // 主コースの値が 'd3' でも '知能情報デザイン (d3)' でも判定できるように正規化
  const normalizedMainCourse =
    mainCourse.includes('d1') ? 'd1' :
    mainCourse.includes('d2') ? 'd2' :
    mainCourse.includes('d3') ? 'd3' :
    mainCourse.includes('d4') ? 'd4' :
    mainCourse

  const currentRequiredCourses = REQUIRED_COURSES_BY_COURSE[normalizedMainCourse] || [];
  const missingCurrentRequiredCourses = missingRequiredCourses.filter((course) =>
    currentRequiredCourses.includes(course)
  );

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



  const getTodayLessons = () => {
    if (!todayDayOfWeek) return [];

    const currentSemesterTimetable = timetable[semester] || {};

    return Object.entries(currentSemesterTimetable)
      .filter(([key, entry]) => {
        const [day] = key.split('-');
        return day === todayDayOfWeek && entry;
      })
      .map(([key, entry]) => {
        const [, period] = key.split('-');

        return {
          ...entry,
          period: Number(period),
          time: PERIOD_TIMES[Number(period)]
        };
      })
      .sort((a, b) => a.period - b.period);
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
      
      const color = selectedCourse ? getCourseColor(selectedCourse.target, mainCourse) : COURSE_COLORS.default;
      const colorKey = selectedCourse ? getCourseColorKey(selectedCourse.target, mainCourse) : 'default';

      setTimetable(prev => ({
        ...prev,
        [semester]: {
          ...(prev[semester] || {}),
          [editingCell]: { 
            name: targetValue, 
            color, 
            room: selectedCourse?.room || '',
            target: selectedCourse?.target || '',
            type: selectedCourse?.type || '',
            colorKey,
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
      setEditStep('course-select');
    }, 1500);
  }

  const resetToInitialScreen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    sessionStorage.removeItem('isd_timetable_screen_state');
    sessionStorage.removeItem('isd_restore_timetable_from_course');

    setPageMode(null);
    setEditStep('course-select');
    setViewStep('date-input');
    setEditingCell(null);
    setEditValue('');
    setSaveMessage('');
    setLockError('');
    setCheckStudentId('');
    setStudentIdError('');
    setSimulatedDateTime('');
    setActivePeriodName('');
    setTodayDate('');
    setTodayDayOfWeek('');
    setLessonCount(1);
  }


  const renderCreditNumberLine = ({ title, max, ticks, beforeCurrent, current, targetLabel }) => {
    const safeMax = max || 1;
    const beforeValue = Number(beforeCurrent || 0);
    const currentValue = Number(current || 0);
    const beforePercent = Math.max(0, Math.min((beforeValue / safeMax) * 100, 100));
    const currentPercent = Math.max(0, Math.min((currentValue / safeMax) * 100, 100));
    const markersOverlap = Math.abs(beforePercent - currentPercent) < 6;

    return (
      <div
        style={{
          marginTop: '18px',
          padding: '16px',
          background: '#f8fbff',
          border: '1px solid #dbeafe',
          borderRadius: '14px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{title}</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '12px', color: '#555' }}>
            <span>履修前：<b>{beforeValue}</b> 単位</span>
            <span>登録後見込み：<b>{currentValue}</b> 単位</span>
          </div>
        </div>

        <div style={{ position: 'relative', height: markersOverlap ? '86px' : '74px', margin: '0 8px' }}>
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: 0,
              right: 0,
              height: '6px',
              borderRadius: '999px',
              background: '#dfe6e9'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: 0,
              width: `${beforePercent}%`,
              height: '6px',
              borderRadius: '999px',
              background: '#74b9ff'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: 0,
              width: `${currentPercent}%`,
              height: '6px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #3498db, #2ecc71)',
              opacity: 0.9
            }}
          />

          {ticks.map((tick) => {
            const left = Math.max(0, Math.min((tick / safeMax) * 100, 100));
            const isGoal = tick === max;
            return (
              <div
                key={`${title}-${tick}`}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '22px',
                  transform: 'translateX(-50%)',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: isGoal ? '3px' : '2px',
                    height: isGoal ? '24px' : '18px',
                    background: isGoal ? '#e74c3c' : '#2c3e50',
                    margin: '0 auto'
                  }}
                />
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    fontWeight: isGoal ? 'bold' : 'normal',
                    color: isGoal ? '#e74c3c' : '#555',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tick}
                </div>
              </div>
            );
          })}

          {/* 履修前の単位数マーカー */}
          <div
            style={{
              position: 'absolute',
              left: `${beforePercent}%`,
              top: markersOverlap ? '4px' : '2px',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 3
            }}
          >
            <div style={{ fontSize: '16px', lineHeight: 1, color: '#0984e3' }}>◆</div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                background: '#0984e3',
                color: 'white',
                borderRadius: '999px',
                padding: '2px 8px',
                whiteSpace: 'nowrap'
              }}
            >
              履修前 {beforeValue}単位
            </div>
          </div>

          {/* 今学期登録後の見込み単位数マーカー */}
          <div
            style={{
              position: 'absolute',
              left: `${currentPercent}%`,
              top: markersOverlap ? '42px' : '-18px',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 4
            }}
          >
            <div style={{ fontSize: '18px', lineHeight: 1, color: '#2c3e50' }}>▼</div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                background: '#2c3e50',
                color: 'white',
                borderRadius: '999px',
                padding: '2px 8px',
                whiteSpace: 'nowrap'
              }}
            >
              登録後 {currentValue}単位
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '12px',
            color: '#666'
          }}
        >
          <span>🔵 履修前：<b>{beforeValue}</b> 単位</span>
          <span>⚫ 登録後：<b>{currentValue}</b> 単位</span>
          <span>🎯 {targetLabel}：<b>{max}</b> 単位</span>
        </div>
      </div>
    );
  };

  return (
    <main
      className="timetable-page"
      onContextMenu={resetToInitialScreen}
      style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}
    >
      
      {/* 1. 目的の選択 */}
      {pageMode === null && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '450px', width: '100%' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#333' }}>🔍 目的を選択</h2>
            <button
              onClick={() => {
                const hasRegisteredCourses =
                  Object.keys(timetable.spring || {}).length > 0 ||
                  Object.keys(timetable.fall || {}).length > 0;

                if (hasRegisteredCourses) {
                  const reset = window.confirm(
                    '前回登録した授業をすべて削除して、新しく登録しますか？\n\nOK：削除して新規登録\nキャンセル：前回の登録を残して編集'
                  );

                  if (reset) {
                    const emptyTimetable = { spring: {}, fall: {} };
                    setTimetable(emptyTimetable);
                    setUnipaData({});
                    localStorage.setItem('isd_timetable_data', JSON.stringify(emptyTimetable));
                    localStorage.setItem('isd_manual_attendance', JSON.stringify({}));
                  }
                }

                setPageMode('edit');
                setEditStep('course-select');
                setEditingCell(null);
                setEditValue('');
                setSaveMessage('');
              }}
              style={{ width: '100%', padding: '15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}
            >
              📝 授業登録をする
            </button>
            <button onClick={() => { setPageMode('view'); setViewStep('student-id-check'); setCheckStudentId(''); setStudentIdError('') }} style={{ width: '100%', padding: '15px', backgroundColor: '#1abc9c', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px' }}>
              👀 出欠状況・時間割の確認
            </button>
          </div>
        </div>
      )}

      {/* 2. 時間割確認：学籍番号確認 */}
      {pageMode === 'view' && viewStep === 'student-id-check' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>学籍番号確認</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', lineHeight: 1.7 }}>
              授業登録時に入力した学籍番号を入力してください。
              一致した場合のみ時間割確認へ進めます。
            </p>

            <input
              type="text"
              value={checkStudentId}
              onChange={(e) => {
                setCheckStudentId(e.target.value.toUpperCase())
                setStudentIdError('')
              }}
              placeholder="例：24RD100"
              style={{ width: '85%', padding: '12px', marginBottom: '15px', textAlign: 'center' }}
            />

            {studentIdError && (
              <div style={{ color: '#c0392b', marginBottom: '15px', fontWeight: 'bold', fontSize: '13px' }}>
                {studentIdError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setPageMode(null); setCheckStudentId(''); setStudentIdError('') }} style={{ flex: 1, padding: '12px' }}>
                戻る
              </button>
              <button
                onClick={() => {
                  const savedId = studentId.trim().toUpperCase()
                  const inputId = checkStudentId.trim().toUpperCase()

                  if (!savedId) {
                    setStudentIdError('先に授業登録で学籍番号を登録してください。')
                    return
                  }

                  if (inputId === savedId) {
                    setStudentIdError('')
                    setViewStep('date-input')
                  } else {
                    setStudentIdError('学籍番号が一致しません。')
                  }
                }}
                disabled={!checkStudentId.trim()}
                style={{ flex: 2, padding: '12px', background: '#1abc9c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
              >
                確認する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 出欠確認：今日の日付入力 */}
      {pageMode === 'view' && viewStep === 'date-input' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ backgroundColor: '#fff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>検索したい日付を入力してください</h3>
            <input type="date" value={todayDate} onChange={(e) => handleDateChange(e.target.value)} style={{ width: '85%', padding: '12px', marginBottom: '15px', textAlign: 'center' }} />
            {todayDayOfWeek && (
              <div
                style={{
                  padding: '12px',
                  background: '#e8f8f5',
                  borderRadius: '8px',
                  marginBottom: '25px'
                }}
              >
                <div style={{ marginBottom: '10px' }}>
                  🗓️ <b>{todayDayOfWeek}曜日</b>
                </div>

                {getTodayLessons().length > 0 ? (
                  <>
                    <div
                      style={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#27ae60'
                      }}
                    >
                      🔔 この日の授業
                    </div>

                    {getTodayLessons().map((lesson) => (
                      <div
                        key={`${lesson.name}-${lesson.period}`}
                        style={{
                          background: '#fff',
                          borderRadius: '8px',
                          padding: '10px',
                          marginBottom: '8px',
                          textAlign: 'left',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          {lesson.period}限目
                        </div>
                        <div style={{ color: '#666' }}>
                          {lesson.time}
                        </div>
                        <div style={{ marginTop: '5px' }}>
                          {lesson.name}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ color: '#666' }}>
                    この日に授業はありません
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setPageMode(null)} style={{ flex: 1, padding: '12px' }}>戻る</button>
              <button onClick={() => setViewStep('grid')} disabled={!todayDate} style={{ flex: 2, padding: '12px', background: '#1abc9c', color: 'white' }}>進む ➔</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 授業登録：基本設定 */}
      {pageMode === 'edit' && editStep === 'course-select' && (
        <div
          style={{
            maxWidth: '820px',
            margin: '50px auto',
            background: '#fff',
            padding: '34px',
            borderRadius: '20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '22px', color: '#2c3e50' }}>⚙️ 基本設定</h3>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#7f8c8d', lineHeight: 1.7 }}>
              1年生はコース配属前のため、学籍番号と学年のみで時間割登録へ進めます。2年生以上は取得単位数とコース情報を入力してください。
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              marginBottom: '18px'
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>学籍番号</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="例：24RD100"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dcdde1', boxSizing: 'border-box', fontSize: '15px' }}
              />
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#7f8c8d' }}>
                時間割確認時に同じ学籍番号の入力が必要です。
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>学年</label>
              <select
                value={grade}
                onChange={(e) => {
                  const newGrade = e.target.value
                  setGrade(newGrade)

                  if (newGrade === '1') {
                    setEarnedCredits('0')
                    setCourseEarnedCredits(COURSE_CREDIT_INITIAL)
                    setMainCourse('')
                    setSubCourse('')
                    setMissingRequiredCourses([])

                    localStorage.setItem('isd_earned_credits', '0')
                    localStorage.setItem('isd_course_earned_credits', JSON.stringify(COURSE_CREDIT_INITIAL))
                    localStorage.removeItem('isd_main_course')
                    localStorage.removeItem('isd_sub_course')
                    localStorage.setItem('isd_missing_required_courses', JSON.stringify([]))
                  }
                }}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dcdde1', boxSizing: 'border-box', fontSize: '15px', background: '#fff' }}
              >
                <option value="">-- 学年を選択 --</option>
                <option value="1">1年生</option>
                <option value="2">2年生</option>
                <option value="3">3年生</option>
                <option value="4">4年生</option>
              </select>
            </div>
          </div>

          {grade === '1' && (
            <div
              style={{
                marginTop: '18px',
                padding: '16px',
                background: '#e8f8ef',
                border: '1px solid #b7ebc6',
                borderRadius: '14px',
                color: '#137333',
                fontWeight: 'bold',
                lineHeight: 1.8
              }}
            >
              🌱 1年生はコース配属前のため、取得済み単位数・主コース・副コースの入力は表示していません。
              前期／後期は次の時間割登録画面で切り替えできます。
            </div>
          )}

          {grade && grade !== '1' && (
            <>
              <div style={{ marginTop: '22px', marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>現在までに取得済みの単位数</label>
                <input
                  type="number"
                  min="0"
                  max="124"
                  value={earnedCredits}
                  onChange={(e) => setEarnedCredits(e.target.value)}
                  placeholder="例：75"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dcdde1', boxSizing: 'border-box', fontSize: '15px' }}
                />
                {earnedCredits !== '' && (
                  <div style={{ marginTop: '12px', padding: '14px', background: '#f8f9fa', borderRadius: '12px', fontSize: '13px', lineHeight: 1.8 }}>
                    <div>目標：<b>{creditStats.gradeTargetLabel}</b> に <b>{creditStats.gradeTarget}</b> 単位</div>
                    <div>現在の取得単位数：<b>{creditStats.earned}</b> 単位</div>
                    <div style={{ color: creditStats.remainingForGrade === 0 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                      残り必要単位数：{creditStats.remainingForGrade} 単位
                    </div>
                    <div>卒業要件124単位まで：あと <b>{creditStats.remainingForGraduation}</b> 単位</div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '18px',
                  marginBottom: '22px'
                }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>主コース</label>
                  <select
                    value={mainCourse}
                    onChange={(e) => {
                      setMainCourse(e.target.value)
                      setMissingRequiredCourses([])
                    }}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dcdde1', boxSizing: 'border-box', fontSize: '15px', background: '#fff' }}
                  >
                    <option value="">-- 主コースを選択 --</option>
                    {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50' }}>副コース</label>
                  <select
                    value={subCourse}
                    onChange={(e) => setSubCourse(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #dcdde1', boxSizing: 'border-box', fontSize: '15px', background: '#fff' }}
                  >
                    <option value="">-- 副コースを選択 --</option>
                    {COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '14px', color: '#2c3e50' }}>📊 コース別単位入力</h3>

                {courseCreditStats.length === 0 ? (
                  <div style={{ padding: '14px', background: '#fff3cd', borderRadius: '12px', color: '#856404', fontSize: '13px' }}>
                    主コースと副コースを選択すると、必要な単位数に合わせて入力欄が表示されます。
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '14px'
                    }}
                  >
                    {courseCreditStats.map((course) => (
                      <div
                        key={`${course.role}-${course.id}`}
                        style={{
                          background: '#fff',
                          border: `2px solid ${course.theme}55`,
                          borderRadius: '16px',
                          padding: '18px',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{course.icon}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{course.roleLabel}</div>
                        <div style={{ color: '#2c3e50', fontWeight: 'bold', marginBottom: '8px' }}>{course.id} {course.name}</div>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                          3年次目標：{course.thirdYear}単位 ／ 卒業目標：{course.graduation}単位
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="124"
                          value={courseEarnedCredits?.[course.id] || ''}
                          onChange={(e) => {
                            setCourseEarnedCredits((prev) => ({
                              ...prev,
                              [course.id]: e.target.value
                            }))
                          }}
                          placeholder="取得済み単位数を入力"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '14px', marginTop: '30px' }}>
            <button
              onClick={() => { setPageMode(null); setEditStep('course-select'); }}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #bdc3c7', background: '#fff', fontWeight: 'bold' }}
            >
              戻る
            </button>
            <button
              onClick={() => {
                if (grade === '1') {
                  setEditStep('grid')
                } else {
                  setEditStep('required-check')
                }
              }}
              disabled={
                !studentId.trim() ||
                !grade ||
                (grade !== '1' && (!earnedCredits.trim() || !mainCourse || !subCourse))
              }
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: (!studentId.trim() || !grade || (grade !== '1' && (!earnedCredits.trim() || !mainCourse || !subCourse))) ? '#bdc3c7' : '#3498db',
                color: 'white',
                fontWeight: 'bold',
                cursor: (!studentId.trim() || !grade || (grade !== '1' && (!earnedCredits.trim() || !mainCourse || !subCourse))) ? 'not-allowed' : 'pointer'
              }}
            >
              {grade === '1' ? '時間割登録へ ➔' : '必修科目確認へ ➔'}
            </button>
          </div>
        </div>
      )}

      {/* 5. 必修科目取得状況確認 */}
      {pageMode === 'edit' && editStep === 'required-check' && (
        <div style={{ maxWidth: '650px', margin: '60px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '10px' }}>✅ 未取得の必修科目確認</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: 1.7 }}>
            選択した主コースに対応する必修科目が表示されています。まだ取得していない必修科目にチェックを入れてください。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentRequiredCourses.map((course) => {
              const checked = missingRequiredCourses.includes(course)

              return (
                <label
                  key={course}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    border: checked ? '2px solid #3498db' : '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: checked ? '#ebf5ff' : '#fff',
                    fontWeight: checked ? 'bold' : 'normal'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMissingRequiredCourses((prev) => prev.includes(course) ? prev : [...prev, course])
                      } else {
                        setMissingRequiredCourses((prev) => prev.filter((c) => c !== course))
                      }
                    }}
                  />
                  <span>{course}</span>
                </label>
              )
            })}
          </div>

          <div style={{ marginTop: '18px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#555' }}>
            未取得：<b>{missingCurrentRequiredCourses.length}</b> / {currentRequiredCourses.length} 科目
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button onClick={() => setEditStep('course-select')} style={{ flex: 1, padding: '12px' }}>
              戻る
            </button>
            <button
              onClick={() => setEditStep('grid')}
              style={{
                flex: 2,
                padding: '12px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              時間割登録へ ➔
            </button>
          </div>
        </div>
      )}

      {/* 6. メイン時間割シート */}
      {((pageMode === 'edit' && editStep === 'grid') || (pageMode === 'view' && viewStep === 'grid')) && (
        <div className="timetable-container" onContextMenu={resetToInitialScreen} title="右クリックで初期画面へ戻る">
          
          {/* 🎓 単位カウンター表示エリア */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '22px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>🎓 全体の単位進捗</h3>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: creditStats.remainingAfterRegistration === 0 ? '#27ae60' : '#e74c3c' }}>
                {creditStats.remainingAfterRegistration === 0
                  ? `🎉 ${creditStats.gradeTargetLabel} 達成見込み`
                  : `🚨 ${creditStats.gradeTargetLabel} まであと ${creditStats.remainingAfterRegistration} 単位必要`}
              </span>
            </div>

            <div style={{ width: '100%', height: '22px', background: '#dee2e6', borderRadius: '999px', overflow: 'hidden', marginBottom: '14px' }}>
              <div
                style={{
                  width: `${creditStats.projectedPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3498db, #2ecc71)',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', fontSize: '13px', color: '#495057' }}>
              <span>取得済み: <b>{creditStats.earned}</b> 単位</span>
              <span>今学期登録予定: <b>{creditStats.registered}</b> 単位</span>
              <span>登録後見込み: <b>{creditStats.projectedTotal}</b> 単位</span>
              <span>{creditStats.gradeTargetLabel}: <b>{creditStats.gradeTarget}</b> 単位</span>
              <span>卒業まで: <b>{creditStats.remainingForGraduation}</b> 単位</span>
              <span>進捗率: <b>{creditStats.projectedPercentage}%</b></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
              {renderCreditNumberLine({
                title: '進級目標までの位置',
                max: creditStats.gradeTarget,
                ticks: creditStats.gradeTarget <= 30 ? [0, 10, 20, 30] : [0, 30, 60, 90, creditStats.gradeTarget],
                beforeCurrent: creditStats.earned,
                current: creditStats.projectedTotal,
                targetLabel: creditStats.gradeTargetLabel
              })}
              {renderCreditNumberLine({
                title: '卒業要件までの位置',
                max: 124,
                ticks: [0, 30, 60, 90, 124],
                beforeCurrent: creditStats.earned,
                current: creditStats.projectedTotal,
                targetLabel: '卒業要件'
              })}
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '12px',
                background: creditStats.isAlreadyShortAfterRegistration ? '#fff3cd' : '#ffebee',
                border: creditStats.isAlreadyShortAfterRegistration ? '1px solid #ffecb5' : '1px solid #ffcdd2',
                color: creditStats.isAlreadyShortAfterRegistration ? '#7a5d00' : '#b71c1c',
                fontSize: '13px',
                fontWeight: 'bold',
                lineHeight: 1.7
              }}
            >
              {creditStats.registered === 0 ? (
                <div>⚠️ まだ授業が登録されていません。進級・卒業判定のために授業を登録してください。</div>
              ) : creditStats.isAlreadyShortAfterRegistration ? (
                <div>
                  ⚠️ 登録予定単位をすべて取得しても、{creditStats.gradeTargetLabel} の目標まであと {creditStats.remainingAfterRegistration} 単位不足します。
                  追加で授業を登録しないと留年リスクがあります。
                </div>
              ) : (
                <div>
                  ⚠️ 今学期登録した {creditStats.registered} 単位のうち、{creditStats.safeFailCredits} 単位までは落としても目標達成見込みです。
                  ただし、あと {creditStats.failDangerCredits} 単位落としたらあなたは留年リスクがあります。
                </div>
              )}
            </div>
          </div>

          {/* 📊 選択コース別単位進捗 */}
          {courseCreditStats.length > 0 && (
            <div
              style={{
                background: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>👥 選択コース別の単位進捗</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>
                主コースは 3年次まで18単位・卒業まで26単位、副コースは 3年次まで5単位・卒業まで8単位として表示しています。
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {courseCreditStats.map((course) => (
                  <div
                    key={`${course.role}-${course.id}`}
                    style={{
                      border: `1px solid ${course.theme}55`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: `${course.theme}10`
                    }}
                  >
                    <div style={{ textAlign: 'center', padding: '14px', borderBottom: `1px solid ${course.theme}55`, background: 'rgba(255,255,255,0.65)' }}>
                      <div style={{ fontSize: '22px' }}>{course.icon}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '17px' }}>{course.roleLabel}：{course.id}</div>
                      <div style={{ fontSize: '13px' }}>{course.name}</div>
                    </div>

                    <div style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        取得＋登録見込み: {course.projectedTotal} 単位
                      </div>

                      <div style={{ width: '100%', height: '16px', background: '#e1e5ea', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: `${course.thirdYearPercent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #3498db, #2ecc71)'
                          }}
                        />
                      </div>

                      <div style={{ fontSize: '13px', lineHeight: 1.8 }}>
                        <div>3年次までの目標: <b>{course.thirdYear}</b> 単位</div>
                        <div>3年次進捗率: <b>{course.thirdYearPercent}%</b></div>
                        <hr style={{ border: 'none', borderTop: '1px dashed #d0d7de', margin: '10px 0' }} />
                        <div>卒業までの目標: <b>{course.graduation}</b> 単位</div>
                        <div>卒業進捗率: <b>{course.graduationPercent}%</b></div>
                      </div>

                      <div
                        style={{
                          marginTop: '12px',
                          padding: '10px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.75)',
                          fontSize: '13px',
                          lineHeight: 1.8
                        }}
                      >
                        <div>3年次進級まであと <b>{course.thirdYearRemaining}</b> 単位必要</div>
                        <div>卒業まであと <b>{course.graduationRemaining}</b> 単位必要</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '18px', border: '1px solid #dfe6e9', borderRadius: '12px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '760px' }}>
                  <thead>
                    <tr style={{ background: '#f1f3f5' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>区分</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>コース</th>
                      <th style={{ padding: '10px' }}>3年次目標</th>
                      <th style={{ padding: '10px' }}>取得＋登録</th>
                      <th style={{ padding: '10px' }}>3年次進捗</th>
                      <th style={{ padding: '10px' }}>卒業目標</th>
                      <th style={{ padding: '10px' }}>卒業進捗</th>
                      <th style={{ padding: '10px' }}>卒業まであと</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseCreditStats.map((course) => (
                      <tr key={`row-${course.role}-${course.id}`} style={{ borderTop: '1px solid #e9ecef' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center' }}>{course.roleLabel}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{course.id}　{course.name}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{course.thirdYear} 単位</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{course.projectedTotal} 単位</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{course.thirdYearPercent}%</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{course.graduation} 単位</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{course.graduationPercent}%</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: course.graduationRemaining === 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                          {course.graduationRemaining} 単位
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: '5px 0 0 0', fontSize: '24px' }}>📅 時間割メインシート</h1>
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#7f8c8d' }}>
                ここで前期・後期を切り替えて授業を登録できます。
              </p>
            </div>
            <button
              type="button"
              onClick={resetToInitialScreen}
              style={{ padding: '9px 16px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 'bold' }}
            >
              初期画面へ戻る
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '18px',
              background: '#eef3f7',
              padding: '8px',
              borderRadius: '14px'
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedTerm('spring')}
              style={{
                padding: '13px',
                borderRadius: '10px',
                border: semester === 'spring' ? '2px solid #00796b' : '1px solid transparent',
                background: semester === 'spring' ? '#00796b' : '#fff',
                color: semester === 'spring' ? '#fff' : '#2c3e50',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              前期
            </button>
            <button
              type="button"
              onClick={() => setSelectedTerm('fall')}
              style={{
                padding: '13px',
                borderRadius: '10px',
                border: semester === 'fall' ? '2px solid #00796b' : '1px solid transparent',
                background: semester === 'fall' ? '#00796b' : '#fff',
                color: semester === 'fall' ? '#fff' : '#2c3e50',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              後期
            </button>
          </div>

          <div
            className="timetable-grid"
            onContextMenu={resetToInitialScreen}
            style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', gap: '6px', background: '#f5f5f5', padding: '8px', borderRadius: '8px' }}
          >
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
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{period}限目</div>
                  <div style={{ fontSize: '10px', color: '#555', marginTop: '4px', lineHeight: 1.3 }}>
                    {PERIOD_TIMES[period]}
                  </div>
                </div>
                
                {DAYS.map(day => {
                  const key = getCellKey(day, period)
                  const entry = (timetable[semester] || {})[key]
                  const entryMaster = entry ? COURSE_MASTER.find(c => c.name === entry.name && c.semester === semester) : null
                  const entryTarget = entryMaster?.target || entry?.target || ''
                  const entryColorKey = entry ? getCourseColorKey(entryTarget, mainCourse) : 'default'
                  const entryColor = entry ? getCourseColor(entryTarget, mainCourse) : undefined
                  const isRequiredCourse = entry ? (entryMaster?.type === '必修' || entry?.type === '必修') : false
                  const cellBackground = isRequiredCourse ? '#FFCDD2' : entryColor
                  const isEditing = editingCell === key
                  const availableCourses = getFilteredCourses(day, period);
                  
                  const noAttendanceCourses = ['現代マスコミ論', 'インタラクティブデザイン論'];
                  const isNoAttendanceCourse = entry && noAttendanceCourses.includes(entry.name);
                  const hasAttendance = isNoAttendanceCourse ? false : (entry?.hasAttendance ?? true);

                  const isTodayCell = pageMode === 'view' && day === todayDayOfWeek;

                  return (
                    <div key={key} className={`timetable-cell timetable-cell--body ${entry ? 'timetable-cell--filled' : ''}`}
                      style={{
                        '--cell-color': cellBackground,
                        background: cellBackground,
                        border: isTodayCell ? '3px solid #f1c40f' : undefined,
                        cursor: pageMode === 'edit' ? 'pointer' : 'default',
                        minHeight: '130px',
                        position: 'relative'
                      }}
                     onClick={() => {
  if (pageMode === 'edit' && !isEditing) {
    handleCellClick(day, period)
  }
}}
                    >
                      {isEditing ? (
                        <select value={editValue} onChange={e => { setEditValue(e.target.value); handleSaveCell(e.target.value); }} onBlur={() => handleSaveCell(editValue)} autoFocus style={{ width: '100%', padding: '4px', fontSize: '11px' }}>
                          <option value="">-- 科目を選択 --</option>
                          {availableCourses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          {entry && <option value="">❌ この枠を削除</option>}
                        </select>
                      ) : entry ? (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                          <div>
<Link
  to={`/course/${encodeURIComponent(entry.name)}`}
  className="timetable-cell-name"
  style={{
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
    display: 'block',
    width: '100%'
  }}
  onClick={(e) => {
    e.stopPropagation()
    sessionStorage.setItem('isd_restore_timetable_from_course', 'true')
    sessionStorage.setItem('isd_timetable_screen_state', JSON.stringify({
      pageMode,
      editStep,
      viewStep,
      simulatedDateTime,
      activePeriodName,
      todayDate,
      todayDayOfWeek,
      lessonCount,
    }))
  }}
>
  {entry.name}

  <div
    style={{
      fontSize: '9px',
      color: '#00796b',
      marginTop: '4px'
    }}
  >
    口コミを見る →
  </div>
</Link>
                            {entry && (
                              <div
                                style={{
                                  display: 'inline-block',
                                  marginTop: '4px',
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  background: 'rgba(255,255,255,0.75)',
                                  fontSize: '9px',
                                  fontWeight: 'bold',
                                  color: '#555'
                                }}
                              >
                                {COURSE_LABELS[entryColorKey] || COURSE_LABELS.default}
                              </div>
                            )}
                            {isRequiredCourse && (
                              <div
                                style={{
                                  display: 'inline-block',
                                  marginTop: '4px',
                                  marginLeft: '4px',
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  background: '#c62828',
                                  color: 'white',
                                  fontSize: '9px',
                                  fontWeight: 'bold'
                                }}
                              >
                                必修
                              </div>
                            )}
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
                          
                        </div>
                      ) : (pageMode === 'edit' && availableCourses.length > 0) ? (
                        <span className="timetable-cell-placeholder">+</span>
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