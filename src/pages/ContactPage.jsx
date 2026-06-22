import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../pages-styles/LegalPage.css'

function ContactPage() {
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // 実際にはFirebase等にデータを送信する処理を入れる
    setSubmitted(true)
  }

  return (
    <main className="legal-page">
      <div className="legal-container">
        <Link to="/settings" className="legal-back">← 設定に戻る</Link>
        <h1 className="legal-title">📧 お問い合わせ</h1>
        <p className="legal-updated">お気軽にご連絡ください</p>

        {submitted ? (
          <div className="contact-success">
            <div className="contact-success-icon">✅</div>
            <h2 className="contact-success-title">送信完了しました</h2>
            <p className="contact-success-text">お問い合わせありがとうございます。内容を確認の上、必要に応じてメールにてご返信いたします。</p>
            <button className="contact-back-btn" onClick={() => setSubmitted(false)}>
              新しいお問い合わせ
            </button>
          </div>
        ) : (
          <>
            <section className="legal-section">
              <div className="contact-info-cards">
                <div className="contact-info-card">
                  <span className="contact-info-icon">⏰</span>
                  <div>
                    <strong>対応時間</strong>
                    <p>原則3営業日以内に返信</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <span className="contact-info-icon">📩</span>
                  <div>
                    <strong>メールでも受付</strong>
                    <p>support@minpass.example.com</p>
                  </div>
                </div>
              </div>
            </section>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-category">お問い合わせ種別 <span className="contact-required">*</span></label>
                <select
                  id="contact-category"
                  className="contact-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  <option value="bug">不具合の報告</option>
                  <option value="feature">機能の要望</option>
                  <option value="report">不適切な投稿の報告</option>
                  <option value="account">アカウントに関して</option>
                  <option value="delete">データ削除の依頼</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-email">メールアドレス <span className="contact-required">*</span></label>
                <input
                  id="contact-email"
                  className="contact-input"
                  type="email"
                  placeholder="返信先のメールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-subject">件名 <span className="contact-required">*</span></label>
                <input
                  id="contact-subject"
                  className="contact-input"
                  type="text"
                  placeholder="お問い合わせの件名"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-message">お問い合わせ内容 <span className="contact-required">*</span></label>
                <textarea
                  id="contact-message"
                  className="contact-textarea"
                  placeholder="できるだけ詳しくお書きください"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                送信する
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

export default ContactPage
