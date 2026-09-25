import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const SimpleDashboard: React.FC = () => {
  const { currentOrg, usage, setCurrentView, connectors } = useApp();

  return (
    <div>
      {/* Page Hero */}
      <div className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span className="pill-active">
            <span className="status-dot"></span> System Live & Active
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Operating in {currentOrg.timezone}
          </span>
        </div>
        <h1 className="page-hero-title">{currentOrg.name}</h1>
        <p className="page-hero-desc">
          Virobyte automatically answers incoming WhatsApp inquiries, checks your availability, and schedules appointments directly into your Google Calendar.
        </p>
      </div>

      {/* 3 Clear, Big Outcome Metrics */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Leads Captured</div>
          <div className="metric-value">{usage.leadsCaptured}</div>
          <div className="metric-helper">
            Mirrored automatically to Google Sheets
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Bookings Confirmed</div>
          <div className="metric-value">{usage.appointmentsBooked}</div>
          <div className="metric-helper">
            Zero double-bookings • Synced to Calendar
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Admin Time Saved</div>
          <div className="metric-value">{usage.staffHoursSaved} hrs</div>
          <div className="metric-helper">
            ~22 minutes saved per customer inquiry
          </div>
        </div>
      </div>

      {/* How the System Works in 3 Clean Steps */}
      <div className="spacious-card">
        <div className="spacious-card-header">
          <div>
            <h2 className="spacious-card-title">How Your Automation Works</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              Zero manual copying. Inquiries flow seamlessly from WhatsApp into your business tools.
            </p>
          </div>
          <button className="btn-solid" onClick={() => setCurrentView('tester')}>
            <span>Try WhatsApp Simulator</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 16 }}>
          <div style={{ padding: 24, backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                1
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Inbound WhatsApp</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              A customer texts your WhatsApp number asking for a cleaning quote or an appointment.
            </p>
          </div>

          <div style={{ padding: 24, backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                2
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Bounded AI Validation</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The AI verifies your service area, checks Google Calendar free/busy slots, and offers exact times.
            </p>
          </div>

          <div style={{ padding: 24, backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                3
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Instant Confirmation</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The event is booked directly into Google Calendar, logged in Sheets, and confirmed to the customer.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Channels Summary */}
      <div className="spacious-card">
        <div className="spacious-card-header">
          <h2 className="spacious-card-title">Connected Tools & Accounts</h2>
          <button className="btn-outline" onClick={() => setCurrentView('integrations')}>
            Manage Connections
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, border: '1px solid var(--border-light)', borderRadius: 10 }}>
            <MessageSquare size={24} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>WhatsApp Business</div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 500, marginTop: 2 }}>
                ✓ Connected & Listening
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, border: '1px solid var(--border-light)', borderRadius: 10 }}>
            <Calendar size={24} style={{ color: '#0284c7' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Google Calendar</div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 500, marginTop: 2 }}>
                ✓ Synced for Bookings
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, border: '1px solid var(--border-light)', borderRadius: 10 }}>
            <FileSpreadsheet size={24} style={{ color: '#059669' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Google Sheets</div>
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 500, marginTop: 2 }}>
                ✓ Mirroring Inquiries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
