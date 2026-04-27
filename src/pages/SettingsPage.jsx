import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import '../pages-styles/SettingsPage.css'

function SettingsPage() {
  const { user, isLoggedIn, loginWithGoogle, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <main className="settings-page">
      <div className="settings-container">
        <div className="settings-page-header">
          <h1 className="settings-title">⚙️ 設定</h1>
          <p className="settings-subtitle">アカウントとアプリの設定</p>
        </div>

        {/* Account Section */}
        <div className="settings-section">
          <h2 className="settings-section-title">アカウント</h2>
          <div className="settings-card">
            {isLoggedIn ? (
              <div className="settings-account-info">
                <img className="settings-avatar" src={user.photoURL || ''} alt="" referrerPolicy="no-referrer" />
                <div className="settings-account-details">
                  <div className="settings-account-name">{user.displayName}</div>
                  <div className="settings-account-email">{user.email}</div>
                </div>
                <button className="settings-logout-btn" onClick={logout}>ログアウト</button>
              </div>
            ) : (
              <div className="settings-login-prompt">
                <p>ログインすると口コミの投稿や時間割の保存ができます</p>
                <button className="settings-login-btn" onClick={loginWithGoogle}>
                  Googleでログイン
                </button>
              </div>
            )}
          </div>
        </div>

        {/* App Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">アプリ設定</h2>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">🌙 ダークモード</span>
                <span className="settings-row-desc">画面を暗いテーマに変更</span>
              </div>
              <label className="settings-toggle">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">🔔 通知</span>
                <span className="settings-row-desc">新しい口コミの通知を受け取る</span>
              </div>
              <label className="settings-toggle">
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h2 className="settings-section-title">情報</h2>
          <div className="settings-card">
            <div className="settings-row settings-row--link">
              <span className="settings-row-label">📄 利用規約</span>
              <span className="settings-row-arrow">›</span>
            </div>
            <div className="settings-divider" />
            <div className="settings-row settings-row--link">
              <span className="settings-row-label">🔒 プライバシーポリシー</span>
              <span className="settings-row-arrow">›</span>
            </div>
            <div className="settings-divider" />
            <div className="settings-row settings-row--link">
              <span className="settings-row-label">📧 お問い合わせ</span>
              <span className="settings-row-arrow">›</span>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <span className="settings-row-label">📱 バージョン</span>
              <span className="settings-version">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SettingsPage
