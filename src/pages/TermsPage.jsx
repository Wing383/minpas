import { Link } from 'react-router-dom'
import '../pages-styles/LegalPage.css'

function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link to="/settings" className="legal-back">← 設定に戻る</Link>
        <h1 className="legal-title">📄 利用規約</h1>
        <p className="legal-updated">最終更新日: 2026年6月1日</p>

        <section className="legal-section">
          <h2>第1条（適用）</h2>
          <p>本利用規約（以下「本規約」）は、みんパス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーの皆さまは、本規約に同意の上、本サービスをご利用ください。</p>
        </section>

        <section className="legal-section">
          <h2>第2条（定義）</h2>
          <ol className="legal-list">
            <li>「本サービス」とは、東京電機大学の授業に関する口コミ・評価情報の閲覧・投稿ができるWebサービスを指します。</li>
            <li>「ユーザー」とは、本サービスを利用するすべての方を指します。</li>
            <li>「投稿コンテンツ」とは、ユーザーが本サービスに投稿した口コミ、評価、コメント等のすべてのコンテンツを指します。</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第3条（アカウント登録）</h2>
          <ol className="legal-list">
            <li>本サービスの一部機能を利用するには、Googleアカウントによるログインが必要です。</li>
            <li>ユーザーは、自身のアカウント情報を適切に管理する責任を負います。</li>
            <li>アカウントの第三者への譲渡・貸与は禁止します。</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第4条（口コミの投稿）</h2>
          <ol className="legal-list">
            <li>ユーザーは、自身が実際に履修した授業についてのみ口コミを投稿できます。</li>
            <li>投稿コンテンツは、事実に基づいた内容であることを求めます。</li>
            <li>投稿されたコンテンツの著作権はユーザーに帰属しますが、本サービスでの表示・利用について許諾されたものとします。</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第5条（禁止事項）</h2>
          <p>ユーザーは、以下の行為を行ってはなりません。</p>
          <ol className="legal-list">
            <li>虚偽の情報や誤解を招く内容の投稿</li>
            <li>教員や他のユーザーに対する誹謗中傷、名誉毀損</li>
            <li>個人情報（教員の私的な連絡先等）の無断公開</li>
            <li>試験問題や課題の解答など、学術的不正を助長する情報の投稿</li>
            <li>営利目的の広告・宣伝行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセスやサーバーへの過度な負荷をかける行為</li>
            <li>その他、法令に違反する行為、または公序良俗に反する行為</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第6条（投稿の管理）</h2>
          <ol className="legal-list">
            <li>運営は、本規約に違反する投稿を事前の通知なく削除できるものとします。</li>
            <li>繰り返し規約に違反するユーザーのアカウントを停止・削除できるものとします。</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第7条（免責事項）</h2>
          <ol className="legal-list">
            <li>本サービスに掲載されている口コミ・評価情報は、ユーザー個人の意見であり、大学公式の情報ではありません。</li>
            <li>本サービスの情報に基づく履修選択等について、運営は一切の責任を負いません。</li>
            <li>本サービスの提供の中断・停止・終了により生じた損害について、運営は責任を負いません。</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>第8条（規約の変更）</h2>
          <p>運営は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。</p>
        </section>

        <section className="legal-section">
          <h2>第9条（準拠法・管轄）</h2>
          <p>本規約の解釈は日本法に準拠し、紛争が生じた場合は東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        </section>
      </div>
    </main>
  )
}

export default TermsPage
