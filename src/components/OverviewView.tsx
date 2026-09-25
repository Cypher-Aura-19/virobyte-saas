import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { currentOrg, usage, connectors, config, setCurrentView } = useApp();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{currentOrg.name} — Operations Overview</h1>
          <p className="page-subtitle">
            Sprint 1 Foundation Active • Monitoring WhatsApp lead capture and calendar scheduling performance.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCurrentView('setup')}>
          <span>View Active Workflow</span>
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-title">
            <span>Leads Captured</span>
            <Users size={16} />
          </div>
          <div className="stat-number">{usage.leadsCaptured}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Outcome: Customer Saved</span> • In internal DB & Sheets
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Confirmed Bookings</span>
            <CalendarCheck size={16} />
          </div>
          <div className="stat-number">{usage.appointmentsBooked}</div>
          <div className="stat-subtext">
            <span>Zero double-bookings</span> • Synced with Google Calendar
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Staff Admin Hours Saved</span>
            <Clock size={16} />
          </div>
          <div className="stat-number">{usage.staffHoursSaved} hrs</div>
          <div className="stat-subtext">
            <span>Handling time reduction</span> • ~22 min saved per inquiry
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Inbound Inquiries Handled</span>
            <MessageSquare size={16} />
          </div>
          <div className="stat-number">{usage.messagesThisMonth}</div>
          <div className="stat-subtext">
            <span>{usage.messagesCap - usage.messagesThisMonth} messages remaining</span> in tier cap
          </div>
        </div>
      </div>

      {/* Integration Connectors Status */}
      <div className="table-container">
        <div className="table-header-box">
          <div>
            <h2 className="table-heading">Connected Infrastructure Adapters</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              Active provider credentials and OAuth token health for this tenant.
            </p>
          </div>
          <span className="badge badge-neutral">Tenant Scoped</span>
        </div>

        <table className="neat-table">
          <thead>
            <tr>
              <th>Provider / Connector</th>
              <th>Status</th>
              <th>Bound Account / Identifier</th>
              <th>Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr key={c.provider}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.provider}</div>
                </td>
                <td>
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
                </td>
                <td>
                  <code style={{ fontSize: 13, backgroundColor: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: 4 }}>
                    {c.accountIdentifier || c.details || 'Not bound yet'}
                  </code>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.lastChecked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operational Rules Summary */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div className="card-title">
          <span>Active Operating Guardrails (Config v{config.version})</span>
          <Activity size={16} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>BOOKING NOTICE</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{config.minNoticeHours} hours advance</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>BOOKING HORIZON</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{config.maxHorizonDays} days ahead</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>CANCELLATION WINDOW</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{config.cancellationPolicyHours} hours before</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI ASSISTANT TONE</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2, textTransform: 'capitalize' }}>{config.tone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
