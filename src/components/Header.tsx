import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentOrg, orgs, switchOrg, currentUser } = useApp();

  return (
    <header className="top-header">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Layers size={20} />
        </div>
        <span className="brand-title">Virobyte</span>
      </div>

      <div className="header-controls">
        {/* Simple Business Switcher */}
        <div className="business-selector">
          <Building2 size={16} style={{ color: 'var(--text-secondary)' }} />
          <select 
            aria-label="Active Business"
            value={currentOrg.id} 
            onChange={(e) => switchOrg(e.target.value)}
          >
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Info */}
        <div className="user-badge">
          <div className="avatar">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.fullName} />
            ) : (
              currentUser.fullName.charAt(0)
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currentUser.fullName}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Owner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
