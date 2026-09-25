import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';

export const SimpleIntegrations: React.FC = () => {
  const { currentOrg, testConnector } = useApp();
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleTest = (provider: string) => {
    const res = testConnector(provider);
    setTestStatus(res.message);
    setTimeout(() => setTestStatus(null), 4000);
  };

  return (
    <div>
      <div className="page-hero">
        <h1 className="page-hero-title">Connected Accounts</h1>
        <p className="page-hero-desc">
          Manage the accounts Virobyte connects to for messaging customers and syncing appointments.
        </p>
      </div>

      {testStatus && (
        <div style={{ padding: '14px 20px', backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', borderRadius: 10, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          <CheckCircle2 size={18} />
          <span>{testStatus}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* WhatsApp Card */}
        <div className="spacious-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>WhatsApp Business Platform</h3>
                  <span className="pill-active">Connected</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Bound Sender: <strong>+1 (555) 234-8921</strong> (Twilio ISV Production)
                </div>
              </div>
            </div>
            <button className="btn-outline" onClick={() => handleTest('whatsapp')}>
              <RefreshCw size={14} />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        {/* Google Calendar Card */}
        <div className="spacious-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={24} style={{ color: '#0284c7' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>Google Calendar</h3>
                  <span className="pill-active">Connected</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Booking Calendar: <strong>dispatch@{currentOrg.slug}.com</strong>
                </div>
              </div>
            </div>
            <button className="btn-outline" onClick={() => handleTest('google_calendar')}>
              <RefreshCw size={14} />
              <span>Test Connection</span>
            </button>
          </div>
        </div>

        {/* Google Sheets Card */}
        <div className="spacious-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileSpreadsheet size={24} style={{ color: '#059669' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>Google Sheets</h3>
                  <span className="pill-active">Connected</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Lead Mirror Sheet: <strong>Active Leads 2026</strong> (Tab: Inbound Leads)
                </div>
              </div>
            </div>
            <button className="btn-outline" onClick={() => handleTest('google_sheets')}>
              <RefreshCw size={14} />
              <span>Test Connection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
