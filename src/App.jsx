import React, { useState } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import AITransformationDashboard from './AITransformationDashboard';
import AdminPanel from './AdminPanel';
import AILearningHub from './AILearningHub';
import ForgeCoach from './components/ForgeCoach.jsx';
import { Login } from './pages/Login.jsx';

const App = () => {
  const [view, setView] = useState('learning');

  return (
    <AuthProvider>
      <AppContent view={view} setView={setView} />
    </AuthProvider>
  );
};

const AppContent = ({ view, setView }) => {
  const auth = React.useContext(AuthContext);

  if (auth.loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Login onSuccess={() => {}} />;
  }

  const styles = {
    navBar: {
      background: '#0f172a',
      padding: '16px 32px',
      borderBottom: '1px solid #475569',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
    },
    navLinks: {
      display: 'flex',
      gap: '16px',
    },
    navButton: {
      padding: '8px 16px',
      background: 'transparent',
      color: '#cbd5e1',
      border: '1px solid #475569',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    navButtonActive: {
      background: '#3b82f6',
      color: 'white',
      border: '1px solid #3b82f6',
    },
  };

  return (
    <>
      <div style={styles.navBar}>
        <div style={styles.logo}>🚀 AI Tools Hub</div>
        <div style={styles.navLinks}>
          <button
            style={{
              ...styles.navButton,
              ...(view === 'learning' ? styles.navButtonActive : {}),
            }}
            onClick={() => setView('learning')}
          >
            📚 AI Learning
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(view === 'dashboard' ? styles.navButtonActive : {}),
            }}
            onClick={() => setView('dashboard')}
          >
            📊 AI Dashboard
          </button>
          <button
            style={{
              ...styles.navButton,
              ...(view === 'admin' ? styles.navButtonActive : {}),
            }}
            onClick={() => setView('admin')}
          >
            🔧 Admin
          </button>
          <button
            style={{
              ...styles.navButton,
              borderColor: '#dc2626',
              color: '#dc2626',
            }}
            onClick={() => auth.logout()}
          >
            Logout ({auth.user?.email})
          </button>
        </div>
      </div>
      {view === 'learning' ? <AILearningHub /> : view === 'dashboard' ? <AITransformationDashboard /> : <AdminPanel />}
      <ForgeCoach />
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', background: 'black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', zIndex: 9999, cursor: 'pointer' }}>🐂</div>
    </>
  );
};

export default App;
