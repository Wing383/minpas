import { Link } from 'react-router-dom'
import '../pages-styles/LegalPage.css'

function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link to="/settings" className="legal-back">← 設定に戻る</Link>
        <h1 className="legal-title">🔒 プライバシーポリシー</h1>
        <p className="legal-updated">最終更新日: 2026年6月1日</p>

        <section className="legal-section">
          <h2>1. はじめに</h2>
          <p>みんパス（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーでは、本サービスが収集する情報とその取り扱いについて説明します。</p>
        </section>

        <section className="legal-section">
          <h2>2. 収集する情報</h2>
          <h3>2-1. Googleアカウント情報</h3>
          <p>ログイン時に、以下のGoogleアカウント情報を取得します。</p>
          <ul className="legal-list">
            <li>表示名（ニックネーム）</li>
            <li>メールアドレス</li>
            <li>プロフィール画像のURL</li>
          </ul>

          <h3>2-2. 投稿データ</h3>
          <p>ユーザーが投稿した口コミ、評価、コメント等のデータを保存します。</p>

          <h3>2-3. 利用データ</h3>
          <p>サービス改善のため、以下の情報を自動的に取得する場合があります。</p>
          <ul className="legal-list">
            <li>アクセス日時</li>
            <li>使用しているブラウザ・デバイスの種類</li>
            <li>ページの閲覧履歴</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します。</p>
          <ol className="legal-list">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザー認証とアカウント管理</li>
            <li>投稿コンテンツの表示と管理</li>
            <li>不正利用の検出と防止</li>
            <li>サービスに関する重要なお知らせの通知</li>
          </ol>
        </section>

        <section className="legal-section">
          <h2>4. 情報の共有・第三者提供</h2>
          <p>本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
          <ul className="legal-list">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく開示請求があった場合</li>
            <li>本サービスの運営に必要なインフラ提供者（Google Firebase等）への委託</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. データの保管</h2>
          <p>ユーザーのデータは、Google Firebaseのサーバーに安全に保管されます。適切なセキュリティ対策を講じ、不正アクセスやデータ漏洩の防止に努めます。</p>
        </section>

        <section className="legal-section">
          <h2>6. Cookieの使用</h2>
          <p>本サービスでは、ログイン状態の維持やユーザー設定の保存のためにCookieおよびローカルストレージを使用します。ブラウザの設定でCookieを無効にすることが可能ですが、一部機能が制限される場合があります。</p>
        </section>

        <section className="legal-section">
          <h2>7. ユーザーの権利</h2>
          <p>ユーザーは以下の権利を有します。</p>
          <ul className="legal-list">
            <li><strong>アクセス権:</strong> 自身の個人情報の開示を請求できます</li>
            <li><strong>訂正権:</strong> 不正確な個人情報の訂正を請求できます</li>
            <li><strong>削除権:</strong> 自身のアカウントおよび投稿データの削除を請求できます</li>
          </ul>
          <p>これらの権利行使については、お問い合わせページよりご連絡ください。</p>
        </section>

        <section className="legal-section">
          <h2>8. 未成年者の保護</h2>
          <p>本サービスは主に大学生を対象としていますが、18歳未満の方が利用する場合は保護者の同意を推奨します。</p>
        </section>

        <section className="legal-section">
          <h2>9. ポリシーの変更</h2>
          <p>本プライバシーポリシーは、法令の改正やサービスの変更に伴い、予告なく改定する場合があります。改定後のポリシーは本サービス上に掲載した時点で効力を生じます。</p>
        </section>

        <section className="legal-section">
          <h2>10. お問い合わせ</h2>
          <p>プライバシーに関するご質問やご要望は、<Link to="/contact" className="legal-link">お問い合わせページ</Link>よりご連絡ください。</p>
        </section>
      </div>
    </main>
  )
}

export default PrivacyPage
