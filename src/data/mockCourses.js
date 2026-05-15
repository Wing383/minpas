export const MOCK_COURSES = [
  {
    name: '情報セキュリティ概論',
    teacher: '橋本　侑知',
    faculty: '理工学部',
    avgContent: 3.8,
    avgEasy: 4.2,
    reviews: [
      { content: 4, easy: 5, comment: '試験はレポート形式で持ち込みOK。授業内容もわかりやすく説明してくれるので理解しやすかったです。', year: 2026, semester: '前期' },
      { content: 3, easy: 4, comment: 'セキュリティの基礎をしっかり学べる。課題が多めだが、それほど難しくはない。', year: 2025, semester: '前期' },
      { content: 4, easy: 4, comment: '実際のサイバー攻撃事例を交えた説明が面白かった。テストは過去問があれば余裕。', year: 2025, semester: '前期' },
    ],
  },
  {
    name: 'オブジェクト指向プログラミング',
    teacher: '佐藤　聖也',
    faculty: '理工学部',
    avgContent: 4.1,
    avgEasy: 3.5,
    reviews: [
      { content: 5, easy: 3, comment: 'Javaを使ってOOPの概念をしっかり学べる。最終課題のゲーム制作が楽しかった！', year: 2026, semester: '前期' },
      { content: 4, easy: 4, comment: '先生の説明がとても丁寧で、プログラミング初心者でもついていけた。', year: 2025, semester: '後期' },
      { content: 3, easy: 3, comment: 'クラス設計の概念が最初はきつかった。でも理解できると楽しくなる。', year: 2025, semester: '前期' },
    ],
  },
  {
    name: '深層学習',
    teacher: '日髙　章理',
    faculty: '理工学部',
    avgContent: 4.5,
    avgEasy: 2.8,
    reviews: [
      { content: 5, easy: 2, comment: 'PyTorchを使った実装演習が充実していて非常に勉強になった。ただしかなり重い。', year: 2026, semester: '後期' },
      { content: 4, easy: 3, comment: '数学的な背景からしっかり説明してくれる。試験は難しめだが勉強になる。', year: 2025, semester: '後期' },
      { content: 5, easy: 3, comment: '最新のDLトピックが扱われており、就活にも役立つ内容。課題は多い。', year: 2025, semester: '後期' },
    ],
  },
  {
    name: 'ゲームプログラミングⅠ',
    teacher: '柴田　良二',
    faculty: '理工学部',
    avgContent: 4.7,
    avgEasy: 4.5,
    reviews: [
      { content: 5, easy: 5, comment: 'ゲームを作りながら学べるので最高に楽しい！試験なしでレポートのみ。', year: 2026, semester: '前期' },
      { content: 4, easy: 4, comment: 'C++でゲームを実装する授業。やる気があれば非常に力がつく。', year: 2025, semester: '前期' },
      { content: 5, easy: 5, comment: '先生が面白くてモチベが上がる。楽単でありながら内容も充実している。', year: 2025, semester: '後期' },
    ],
  },
  {
    name: 'データベース',
    teacher: '中山　洋',
    faculty: '理工学部',
    avgContent: 3.5,
    avgEasy: 3.8,
    reviews: [
      { content: 4, easy: 4, comment: 'SQLの基礎から応用まで丁寧に教えてくれる。試験前に過去問を解けば大丈夫。', year: 2026, semester: '前期' },
      { content: 3, easy: 4, comment: '正規化の概念が難しかったが先生の解説が丁寧だった。', year: 2025, semester: '後期' },
    ],
  },
  {
    name: 'アルゴリズムとデータ構造Ⅰ',
    teacher: '笹川　隆史',
    faculty: '理工学部',
    avgContent: 4.2,
    avgEasy: 3.0,
    reviews: [
      { content: 4, easy: 3, comment: 'ソートやグラフ探索など基本的なアルゴリズムをしっかり学べる。試験はそこそこ難しい。', year: 2026, semester: '前期' },
      { content: 5, easy: 3, comment: '競プロやインターンに役立つ内容が多い。難しいが学ぶ価値は高い。', year: 2025, semester: '前期' },
      { content: 4, easy: 3, comment: '計算量の考え方が身についた。試験は演習問題をしっかりやれば合格できる。', year: 2025, semester: '後期' },
    ],
  },
]

/** 科目名からレビューデータを取得 */
export function getMockCourse(name) {
  return MOCK_COURSES.find((c) => c.name === name) || null
}
