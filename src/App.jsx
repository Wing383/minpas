import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import HomePage from './pages/HomePage.jsx'
import TimetablePage from './pages/TimetablePage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import BottomNav from './components/BottomNav.jsx'
import './App.css'

function App() {
  const { user, loading, loginWithGoogle, logout, isLoggedIn } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <Router>
      <div className="app-layout">
        {/* ===== Header ===== */}
        <header className="header">
          <div className="header-inner">
            <Link to="/" className="logo">
              <div className="logo-icon">電</div>
              <div className="logo-text">
                <span className="logo-title">みんパス</span>
                <span className="logo-subtitle">東京電機大学</span>
              </div>
            </Link>
            <nav className="header-nav">
              {loading ? (
                <div className="auth-loading">読込中...</div>
              ) : isLoggedIn ? (
                <div className="user-menu-wrapper">
                  <button
                    id="btn-user-menu"
                    className="user-menu-trigger"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <img
                      className="user-avatar"
                      src={user.photoURL || ''}
                      alt={user.displayName || 'ユーザー'}
                      referrerPolicy="no-referrer"
                    />
                    <span className="user-display-name">{user.displayName}</span>
                    <span className={`user-menu-arrow ${userMenuOpen ? 'user-menu-arrow--open' : ''}`}>▼</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="user-menu-backdrop" onClick={() => setUserMenuOpen(false)} />
                      <div className="user-menu-dropdown">
                        <div className="user-menu-header">
                          <img
                            className="user-menu-avatar"
                            src={user.photoURL || ''}
                            alt={user.displayName || 'ユーザー'}
                            referrerPolicy="no-referrer"
                          />
                          <div className="user-menu-info">
                            <div className="user-menu-name">{user.displayName}</div>
                            <div className="user-menu-email">{user.email}</div>
                          </div>
                        </div>
                        <div className="user-menu-divider" />
                        <button
                          id="btn-logout"
                          className="user-menu-item user-menu-item--logout"
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                        >
                          🚪 ログアウト
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  id="btn-google-login"
                  className="nav-btn nav-btn--google"
                  onClick={loginWithGoogle}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Googleでログイン
                </button>
              )}
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <BottomNav />
      </div>
    </Router>
  )
}

export default App
