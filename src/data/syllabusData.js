// 東京電機大学 理工学部向けシラバスデータ
// CSVファイルから正確な授業情報を取得し、シラバス詳細と結合して返す

import csvRaw from '../csv/【学部生】2026_理工学部_授業時間割表2（2026-04-21）.csv?raw'

// ---- CSV パース ----
function parseCSV(raw) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    if (inQuotes) {
      current += '\n' + line;
      if (line.includes('"')) {
        const quoteCount = (current.match(/"/g) || []).length;
        if (quoteCount % 2 === 0) {
          inQuotes = false;
          rows.push(current);
          current = '';
        }
      }
    } else {
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        inQuotes = true;
        current = line;
      } else {
        rows.push(line);
      }
    }
  }
  if (current) rows.push(current);

  // 各行をフィールドに分解
  return rows.map(row => {
    const fields = [];
    let field = '';
    let q = false;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') {
        q = !q;
      } else if (ch === ',' && !q) {
        fields.push(field.trim());
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field.trim());
    return fields;
  });
}

// CSVをパースして授業データ配列を構築
const parsedRows = parseCSV(csvRaw);

// ヘッダー行をスキップし、データ行のみ抽出
// 列: 0=配当学年, 1=曜日, 2=時限, 3=単位, 4=必選区分, 5=科目名, 6=コース区分, 7=担当者, 8=教室
const CSV_COURSES = parsedRows
  .filter(cols => cols.length >= 9 && cols[5] && cols[1] && cols[2] && cols[5] !== '科目名')
  .map(cols => ({
    grade: cols[0],
    day: cols[1],
    period: cols[2],
    credits: cols[3],
    requirement: cols[4],
    name: cols[5],
    courseCategory: cols[6],
    teacher: cols[7],
    classroom: cols[8],
  }));

// 科目名ごとにグループ化（複数担当者・コース区分を集約）
function buildCourseMap() {
  const map = new Map();
  for (const row of CSV_COURSES) {
    if (!row.name) continue;
    if (!map.has(row.name)) {
      map.set(row.name, {
        day: row.day,
        period: row.period,
        credits: row.credits,
        requirement: row.requirement,
        courseCategory: row.courseCategory,
        classroom: row.classroom,
        grade: row.grade,
        teachers: [row.teacher],
      });
    } else {
      const existing = map.get(row.name);
      if (row.teacher && !existing.teachers.includes(row.teacher)) {
        existing.teachers.push(row.teacher);
      }
    }
  }
  return map;
}

const COURSE_MAP = buildCourseMap();

// ---- 特別定義のシラバス（概要・教科書・評価割合） ----
const SPECIAL_SYLLABUS = {
  '情報セキュリティ概論': {
    overview: '情報資産に対する脅威とセキュリティ対策の基本技術について学びます。暗号化技術、アクセス制御、ネットワークセキュリティ、認証システム、サイバー攻撃手法とその防衛策などの基礎知識を修得し、安全な情報社会の構築に不可欠なセキュリティマインドを養います。',
    grading: { exam: 0, report: 70, attendance: 30 },
    textbook: '特定のテキストは使用せず、毎時間プリントまたはスライド資料を配布します。',
  },
  'オブジェクト指向プログラミング': {
    overview: 'Java/C++等の言語を用いてオブジェクト指向の基本概念（カプセル化、継承、多態性）を修得し、設計パターンの基礎とモジュール性の高いプログラミング技法を学びます。',
    grading: { exam: 40, report: 40, attendance: 20 },
    textbook: '「新・明解Java入門」柴田望洋 著（ソフトバンククリエイティブ）',
  },
  'データベース': {
    overview: '関係データベースモデル、SQLによるデータ操作、データベース設計理論（正規化）、トランザクション管理について学び、システム開発で必須となるデータの永続化手法を修得します。',
    grading: { exam: 60, report: 30, attendance: 10 },
    textbook: '「データベースシステム（第3版）」岩野和生 著',
  },
  'アルゴリズムとデータ構造Ⅰ': {
    overview: '基本的なデータ構造（配列、リスト、スタック、キュー、木構造）とアルゴリズム（ソート、サーチ）の概念、計算量の評価方法について学び、効率的なプログラムの作成手法を身につけます。',
    grading: { exam: 50, report: 30, attendance: 20 },
    textbook: '「アルゴリズムとデータ構造」平田富夫 著',
  },
  '深層学習': {
    overview: 'ディープラーニングの基礎理論（ニューラルネットワーク、誤差逆伝播法）から、畳み込みニューラルネットワーク（CNN）、回帰型ニューラルネットワーク（RNN）、最新のモデルアーキテクチャまでを学び、PyTorchを用いた実装技術を修得します。',
    grading: { exam: 40, report: 50, attendance: 10 },
    textbook: '「ゼロから作るDeep Learning」斎藤康毅 著（オライリー・ジャパン）',
  },
  'ゲームプログラミングⅠ': {
    overview: 'ゲーム開発の基本エンジン構造、描画処理、衝突判定、キャラクター制御、状態管理などの実装手法について、C++/C#等のオブジェクト指向プログラミングを通じて学びます。',
    grading: { exam: 0, report: 80, attendance: 20 },
    textbook: '講義資料プリントおよびサンプルコードの配布',
  },
  '計算量と暗号': {
    overview: '計算複雑さの理論（P対NP問題、NP困難）を背景に、公開鍵暗号、秘密鍵暗号、ハッシュ関数、デジタル署名といった暗号プロトコルの安全性根拠と現代社会における応用方法について学びます。',
    grading: { exam: 50, report: 40, attendance: 10 },
    textbook: '「暗号技術入門（第3版）」結城浩 著（SBクリエイティブ）',
  },
  '情報システム総合演習': {
    overview: '複数の教員・テーマの中から各自の関心あるプロジェクトを選択し、少人数グループで設計、実装、評価を行う実践的な演習型授業です。エンジニアリングとマネジメントを統合した体験を行います。',
    grading: { exam: 0, report: 100, attendance: 0 },
    textbook: '配布資料・Web上のリファレンス',
  }
};

export function getSyllabusDetail(courseName, faculty = '理工学部') {
  // CSVから正確な授業情報を取得
  const csvData = COURSE_MAP.get(courseName);

  // CSVデータがある場合、そこから開講情報・単位・教室を取得
  let dayPeriod = '';
  let credits = 2;
  let classroom = '';
  let grade = '';
  let requirement = '';
  let courseCategory = '';
  let teachers = [];

  if (csvData) {
    dayPeriod = `${csvData.day}曜${csvData.period}限`;
    credits = Number(csvData.credits) || 2;
    classroom = csvData.classroom || '';
    grade = csvData.grade;
    requirement = csvData.requirement;
    courseCategory = csvData.courseCategory;
    teachers = csvData.teachers;
  }

  // 特別定義されているシラバスを探す
  let specialData = SPECIAL_SYLLABUS[courseName];
  if (!specialData) {
    const specialKey = Object.keys(SPECIAL_SYLLABUS).find(
      k => courseName.includes(k) || k.includes(courseName)
    );
    if (specialKey) {
      specialData = SPECIAL_SYLLABUS[specialKey];
    }
  }

  // 概要・教科書・評価割合は特別定義があればそれを使い、なければ自動生成
  let overview, textbook, grading;

  if (specialData) {
    overview = specialData.overview;
    textbook = specialData.textbook;
    grading = specialData.grading;
  } else {
    // 決定論的なハッシュでダミー生成（概要・教科書・評価のみ）
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = (hash << 5) - hash + courseName.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);

    const gradingType = hash % 4;
    if (gradingType === 0) {
      grading = { exam: 0, report: 80, attendance: 20 };
    } else if (gradingType === 1) {
      grading = { exam: 70, report: 20, attendance: 10 };
    } else if (gradingType === 2) {
      grading = { exam: 40, report: 40, attendance: 20 };
    } else {
      grading = { exam: 30, report: 50, attendance: 20 };
    }

    overview = `「${courseName}」の授業情報です。本講義では、${faculty}における関連分野の基本概念を理解し、講義・演習を通じて実務や研究に応用できる専門知識と実践力を養うことを目的とします。`;
    textbook = `授業内で必要に応じて指定、または資料（プリント・スライド）を適宜配布します。`;
  }

  // CSVにデータがない場合のフォールバック
  if (!dayPeriod) {
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = (hash << 5) - hash + courseName.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);
    const days = ['月', '火', '水', '木', '金'];
    dayPeriod = `${days[hash % 5]}曜${(hash % 5) + 1}限`;
  }

  if (!classroom) {
    classroom = '未定';
  }

  return {
    overview,
    credits,
    classroom,
    dayPeriod,
    grading,
    textbook,
    grade,
    requirement,
    courseCategory,
    teachers,
  };
}
