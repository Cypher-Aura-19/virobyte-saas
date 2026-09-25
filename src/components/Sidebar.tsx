import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Tag, 
  Cable,
  Building
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentOrg } = useApp();

  return (
    <aside className="sidebar">
      <div>
        <ul className="nav-list">
          <li>
            <button 
              className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentView === 'tester' ? 'active' : ''}`}
              onClick={() => setCurrentView('tester')}
            >
              <MessageSquare size={20} />
              <span>WhatsApp Simulator</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentView === 'business' ? 'active' : ''}`}
              onClick={() => setCurrentView('business')}
            >
              <Tag size={20} />
              <span>Services & Pricing</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${currentView === 'integrations' ? 'active' : ''}`}
              onClick={() => setCurrentView('integrations')}
            >
              <Cable size={20} />
              <span>Connected Accounts</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-status-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Building size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            ACTIVE BUSINESS
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)', marginTop: 2 }}>
          {currentOrg.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          Timezone: {currentOrg.timezone}
        </div>
      </div>
    </aside>
  );
};
