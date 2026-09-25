import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cable, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Settings2, 
  ShieldCheck,
  Calendar,
  FileSpreadsheet,
  Mail,
  MessageSquare
} from 'lucide-react';
import { ConnectorBinding } from '../types/domain';

export const ConnectorsHubView: React.FC = () => {
  const { connectors, updateConnectorBinding, testConnector, currentOrg, canManageTeam } = useApp();

  const [activeModalConnector, setActiveModalConnector] = useState<ConnectorBinding | null>(null);
  const [testResult, setTestResult] = useState<{ provider: string; message: string; success: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  // Modal edit fields
  const [calendarId, setCalendarId] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [sheetTab, setSheetTab] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const openEditModal = (c: ConnectorBinding) => {
    setActiveModalConnector(c);
    setCalendarId(c.selectedCalendarId || '');
    setSheetId(c.selectedSheetId || '');
    setSheetTab(c.selectedSheetTab || 'Sheet1');
    setRecipientEmail(c.alertEmailRecipient || '');
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalConnector) return;

    updateConnectorBinding(activeModalConnector.provider, {
      selectedCalendarId: calendarId,
      selectedSheetId: sheetId,
      selectedSheetTab: sheetTab,
      alertEmailRecipient: recipientEmail,
    });

    setActiveModalConnector(null);
  };

  const handleTestProbe = (provider: string) => {
    setIsTesting(provider);
    setTimeout(() => {
      const res = testConnector(provider);
      setTestResult({ provider, message: res.message, success: res.success });
      setIsTesting(null);
      setTimeout(() => setTestResult(null), 5000);
    }, 400);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'whatsapp': return <MessageSquare size={20} style={{ color: 'var(--primary)' }} />;
      case 'google_calendar': return <Calendar size={20} style={{ color: '#0284c7' }} />;
      case 'google_sheets': return <FileSpreadsheet size={20} style={{ color: '#059669' }} />;
      case 'resend': return <Mail size={20} style={{ color: '#d97706' }} />;
      default: return <Cable size={20} />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Integrations & Connectors Hub</h1>
          <p className="page-subtitle">
            Tenant: <strong>{currentOrg.name}</strong> • Provider credentials, OAuth tokens, and destination bindings for automated workflows.
          </p>
        </div>
      </div>

      {testResult && (
        <div className={`alert-box ${testResult.success ? 'alert-success' : 'alert-warning'}`} style={{ marginBottom: 20 }}>
          <CheckCircle2 size={16} />
          <span><strong>{testResult.provider.toUpperCase()}:</strong> {testResult.message}</span>
        </div>
      )}

      {/* Security Vault Banner */}
      <div className="card" style={{ marginBottom: 24, backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck size={28} style={{ color: 'var(--primary)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Encrypted Credential Vault Active</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              OAuth refresh tokens and API secrets are encrypted with AES-256-GCM. Raw credentials are never transmitted to client view layers or stored in plain JSON logs.
            </div>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {connectors.map((c) => (
          <div key={c.provider} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ padding: 10, backgroundColor: 'var(--bg-app)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                  {getProviderIcon(c.provider)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{c.name}</h3>
                    {c.status === 'connected' && (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Connected
                      </span>
                    )}
                    {c.status === 'pending' && (
                      <span className="badge badge-warning">
                        <Clock size={12} /> Action Needed
                      </span>
                    )}
                    {c.status === 'disconnected' && (
                      <span className="badge badge-danger">
                        <AlertTriangle size={12} /> Disconnected
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Account: <code>{c.accountIdentifier || c.details || 'Pending Authorization'}</code>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Last verified: {c.lastChecked}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleTestProbe(c.provider)}
                  disabled={isTesting === c.provider}
                >
                  <RefreshCw size={14} className={isTesting === c.provider ? 'spin-icon' : ''} />
                  <span>Test Permissions</span>
                </button>
                <button className="btn btn-secondary" onClick={() => openEditModal(c)}>
                  <Settings2 size={14} />
                  <span>Configure Destinations</span>
                </button>
              </div>
            </div>

            {/* Destination Specific Details */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 13 }}>
              {c.provider === 'google_calendar' && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Bound Booking Calendar: </span>
                  <strong>{c.selectedCalendarId || 'c_sparkle_dispatch@group.calendar.google.com'}</strong>
                </div>
              )}
              {c.provider === 'google_sheets' && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Target Spreadsheet: </span>
                  <strong>{c.selectedSheetId || '1a9B7cK90xZ893LkD21'}</strong> (Tab: <code>{c.selectedSheetTab || 'New Inquiries'}</code>)
                </div>
              )}
              {c.provider === 'resend' && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Staff Alert Recipient: </span>
                  <strong>{c.alertEmailRecipient || 'alerts@sparkleshine.com'}</strong>
                </div>
              )}
              {c.provider === 'whatsapp' && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Inbound Webhook Verification: </span>
                  <span className="badge badge-success" style={{ fontSize: 11 }}>HMAC-SHA256 Signed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Destination Configuration Modal */}
      {activeModalConnector && (
        <div className="modal-overlay" onClick={() => setActiveModalConnector(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                Configure {activeModalConnector.name} Destinations
              </h3>
              <button onClick={() => setActiveModalConnector(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleSaveDestination}>
              <div className="modal-body">
                {activeModalConnector.provider === 'google_calendar' && (
                  <div className="form-group">
                    <label className="form-label">Google Calendar Resource ID</label>
                    <input 
                      className="form-input" 
                      value={calendarId} 
                      onChange={e => setCalendarId(e.target.value)} 
                      placeholder="e.g. primary or your_crew@group.calendar.google.com"
                      required 
                    />
                    <div className="form-hint">Appointments booked by Workflow W2 will be inserted into this calendar.</div>
                  </div>
                )}

                {activeModalConnector.provider === 'google_sheets' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Google Spreadsheet ID</label>
                      <input 
                        className="form-input" 
                        value={sheetId} 
                        onChange={e => setSheetId(e.target.value)} 
                        placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                        required 
                      />
                      <div className="form-hint">Internal lead IDs and customer details are mirrored to this sheet.</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sheet Tab / Worksheet Name</label>
                      <input 
                        className="form-input" 
                        value={sheetTab} 
                        onChange={e => setSheetTab(e.target.value)} 
                        placeholder="e.g. Inbound Leads"
                        required 
                      />
                    </div>
                  </>
                )}

                {activeModalConnector.provider === 'resend' && (
                  <div className="form-group">
                    <label className="form-label">Staff Notification Recipient Email</label>
                    <input 
                      type="email"
                      className="form-input" 
                      value={recipientEmail} 
                      onChange={e => setRecipientEmail(e.target.value)} 
                      placeholder="e.g. operations@sparkleshine.com"
                      required 
                    />
                    <div className="form-hint">Receives transactional alerts when appointments are reserved or human intervention is needed.</div>
                  </div>
                )}

                {activeModalConnector.provider === 'whatsapp' && (
                  <div className="form-group">
                    <label className="form-label">Inbound Webhook Endpoint</label>
                    <input 
                      className="form-input" 
                      value={`https://api.virobyte.dev/webhooks/whatsapp/${currentOrg.id}`}
                      readOnly 
                    />
                    <div className="form-hint">Configured in Twilio / Meta Cloud Console with your verified signature secret.</div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModalConnector(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Bindings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
