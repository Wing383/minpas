// 東京電機大学 理工学部向けのダミーシラバスデータおよび自動生成ロジック

const SPECIAL_SYLLABUS = {
  '情報セキュリティ概論': {
    overview: '情報資産に対する脅威とセキュリティ対策の基本技術について学びます。暗号化技術、アクセス制御、ネットワークセキュリティ、認証システム、サイバー攻撃手法とその防衛策などの基礎知識を修得し、安全な情報社会の構築に不可欠なセキュリティマインドを養います。',
    credits: 2,
    classroom: '鳩山キャンパス 2号館 2401教室',
    dayPeriod: '月曜2限',
    grading: { exam: 0, report: 70, attendance: 30 },
    textbook: '特定のテキストは使用せず、毎時間プリントまたはスライド資料を配布します。',
  },
  'オブジェクト指向プログラミング': {
    overview: 'Java/C++等の言語を用いてオブジェクト指向の基本概念（カプセル化、継承、多態性）を修得し、設計パターンの基礎とモジュール性の高いプログラミング技法を学びます。',
    credits: 2,
    classroom: '鳩山キャンパス 2号館 2202教室',
    dayPeriod: '水曜5限',
    grading: { exam: 40, report: 40, attendance: 20 },
    textbook: '「新・明解Java入門」柴田望洋 著（ソフトバンククリエイティブ）',
  },
  'データベース': {
    overview: '関係データベースモデル、SQLによるデータ操作、データベース設計理論（正規化）、トランザクション管理について学び、システム開発で必須となるデータの永続化手法を修得します。',
    credits: 2,
    classroom: '鳩山キャンパス 5号館 5103教室',
    dayPeriod: '木曜2限',
    grading: { exam: 60, report: 30, attendance: 10 },
    textbook: '「データベースシステム（第3版）」岩野和生 著',
  },
  'アルゴリズムとデータ構造Ⅰ': {
    overview: '基本的なデータ構造（配列、リスト、スタック、キュー、木構造）とアルゴリズム（ソート、サーチ）の概念、計算量の評価方法について学び、効率的なプログラムの作成手法を身につけます。',
    credits: 2,
    classroom: '鳩山キャンパス 2号館 2304教室',
    dayPeriod: '火曜3限',
    grading: { exam: 50, report: 30, attendance: 20 },
    textbook: '「アルゴリズムとデータ構造」平田富夫 著',
  },
  '深層学習': {
    overview: 'ディープラーニングの基礎理論（ニューラルネットワーク、誤差逆伝播法）から、畳み込みニューラルネットワーク（CNN）、回帰型ニューラルネットワーク（RNN）、最新のモデルアーキテクチャまでを学び、PyTorchを用いた実装技術を修得します。',
    credits: 2,
    classroom: '鳩山キャンパス 2号館 計算機実習室',
    dayPeriod: '木曜4限',
    grading: { exam: 40, report: 50, attendance: 10 },
    textbook: '「ゼロから作るDeep Learning」斎藤康毅 著（オライリー・ジャパン）',
  },
  'ゲームプログラミングⅠ': {
    overview: 'ゲーム開発の基本エンジン構造、描画処理、衝突判定、キャラクター制御、状態管理などの実装手法について、C++/C#等のオブジェクト指向プログラミングを通じて学びます。',
    credits: 2,
    classroom: '鳩山キャンパス 5号館 5201教室',
    dayPeriod: '月曜5限',
    grading: { exam: 0, report: 80, attendance: 20 },
    textbook: '講義資料プリントおよびサンプルコードの配布',
  },
  '計算量と暗号': {
    overview: '計算複雑さの理論（P対NP問題、NP困難）を背景に、公開鍵暗号、秘密鍵暗号、ハッシュ関数、デジタル署名といった暗号プロトコルの安全性根拠と現代社会における応用方法について学びます。',
    credits: 2,
    classroom: '鳩山キャンパス 2号館 2401教室',
    dayPeriod: '月曜3限',
    grading: { exam: 50, report: 40, attendance: 10 },
    textbook: '「暗号技術入門（第3版）」結城浩 著（SBクリエイティブ）',
  },
  '情報システム総合演習': {
    overview: '複数の教員・テーマの中から各自の関心あるプロジェクトを選択し、少人数グループで設計、実装、評価を行う実践的な演習型授業です。エンジニアリングとマネジメントを統合した体験を行います。',
    credits: 2,
    classroom: '各研究室またはシステム演習室',
    dayPeriod: '月曜4限',
    grading: { exam: 0, report: 100, attendance: 0 },
    textbook: '配布資料・Web上のリファレンス',
  }
};

// TimetablePageで定義されているのと同様のマスター
const COURSE_MASTER = [
  { day: '月', period: 2, name: '情報セキュリティ概論' },
  { day: '月', period: 3, name: '計算量と暗号' },
  { day: '月', period: 4, name: '情報システム総合演習' },
  { day: '水', period: 1, name: '情報産業論' },
  { day: '水', period: 2, name: '多変量解析' },
  { day: '水', period: 3, name: '人間関係の心理(鳩山C)' },
  { day: '水', period: 4, name: 'アジア文化研究' },
  { day: '水', period: 5, name: 'オブジェクト指向' },
  { day: '木', period: 4, name: '深層学習' },
  { day: '金', period: 2, name: '数理とデザイン' },
  { day: '金', period: 3, name: '数理最適化入門' },
  { day: '金', period: 4, name: '統計学Ⅰ' },
];

export function getSyllabusDetail(courseName, faculty = '理工学部') {
  // 特別定義されているシラバスを返す
  if (SPECIAL_SYLLABUS[courseName]) {
    return SPECIAL_SYLLABUS[courseName];
  }

  // なければ部分一致で探す
  const specialKey = Object.keys(SPECIAL_SYLLABUS).find(
    k => courseName.includes(k) || k.includes(courseName)
  );
  if (specialKey) {
    return SPECIAL_SYLLABUS[specialKey];
  }

  // 決定論的なハッシュを計算してダミーデータを生成
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = (hash << 5) - hash + courseName.charCodeAt(i);
    hash |= 0; // 32bit integerにする
  }
  hash = Math.abs(hash);

  // 時間割マスターから検索
  const masterCourse = COURSE_MASTER.find(c =>
    courseName.includes(c.name) || c.name.includes(courseName)
  );

  let dayPeriod = '';
  if (masterCourse) {
    dayPeriod = `${masterCourse.day}曜${masterCourse.period}限`;
  } else {
    const days = ['月', '火', '水', '木', '金'];
    const selectedDay = days[hash % 5];
    const selectedPeriod = (hash % 5) + 1;
    dayPeriod = `${selectedDay}曜${selectedPeriod}限`;
  }

  // 教室生成
  const building = (hash % 4) + 2; // 2号館〜5号館
  const floor = (hash % 3) + 1;    // 1階〜3階
  const roomNum = String((hash % 8) + 1).padStart(2, '0');
  const classroom = `鳩山キャンパス ${building}号館 ${floor}${roomNum}教室`;

  // 評価方法生成 (合計が100%になるようにする)
  const gradingType = hash % 4;
  let grading = { exam: 50, report: 30, attendance: 20 };
  if (gradingType === 0) {
    grading = { exam: 0, report: 80, attendance: 20 }; // レポートメイン
  } else if (gradingType === 1) {
    grading = { exam: 70, report: 20, attendance: 10 }; // テストメイン
  } else if (gradingType === 2) {
    grading = { exam: 40, report: 40, attendance: 20 }; // バランス型
  } else {
    grading = { exam: 30, report: 50, attendance: 20 }; // 中間バランス型
  }

  const overview = `「${courseName}」の授業情報です。本講義では、${faculty}における関連分野の基本概念を理解し、講義・演習を通じて実務や研究に応用できる専門知識と実践力を養うことを目的とします。`;
  const textbook = `授業内で必要に応じて指定、または資料（プリント・スライド）を適宜配布します。`;

  return {
    overview,
    credits: 2,
    classroom,
    dayPeriod,
    grading,
    textbook
  };
}
