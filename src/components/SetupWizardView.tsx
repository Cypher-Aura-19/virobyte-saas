import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Sliders, 
  Send, 
  FileCheck, 
  ShieldAlert,
  Zap,
  ArrowRight
} from 'lucide-react';

export const SetupWizardView: React.FC = () => {
  const { config, updateBusinessConfig, publishBusinessConfig, canPublish, currentRole, currentOrg } = useApp();

  const [activeTab, setActiveTab] = useState<'rules' | 'knowledge' | 'workflow'>('rules');

  // Local state for rules
  const [minNotice, setMinNotice] = useState(config.minNoticeHours);
  const [maxHorizon, setMaxHorizon] = useState(config.maxHorizonDays);
  const [cancellation, setCancellation] = useState(config.cancellationPolicyHours);
  const [tone, setTone] = useState(config.tone);
  const [requireApproval, setRequireApproval] = useState(config.requireHumanApprovalForBookings);
  
  // Feedback status
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveDraft = () => {
    const res = updateBusinessConfig({
      minNoticeHours: Number(minNotice),
      maxHorizonDays: Number(maxHorizon),
      cancellationPolicyHours: Number(cancellation),
      tone: tone as any,
      requireHumanApprovalForBookings: requireApproval,
    });
    if (res.success) {
      setSaveMessage('Changes saved as draft. Publish to push to live WhatsApp assistant.');
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handlePublish = () => {
    const res = publishBusinessConfig();
    if (res.success) {
      setSaveMessage(`Successfully published Configuration v${config.version + 1}! Live assistant updated.`);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Workflow & Business Configuration</h1>
          <p className="page-subtitle">
            Tenant: <strong>{currentOrg.name}</strong> • Current Version: <strong>v{config.version}</strong> ({config.status.toUpperCase()})
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={!canPublish}>
            Save as Draft
          </button>
          {canPublish ? (
            <button className="btn btn-primary" onClick={handlePublish}>
              <Send size={15} />
              <span>Publish v{config.version + 1}</span>
            </button>
          ) : (
            <button className="btn btn-secondary" disabled title="Operators cannot publish workflow configurations">
              <ShieldAlert size={15} />
              <span>Publish (Locked for {currentRole})</span>
            </button>
          )}
        </div>
      </div>

      {saveMessage && (
        <div className="alert-box alert-success">
          <CheckCircle size={16} />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
        <button 
          className={`btn ${activeTab === 'rules' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rules')}
        >
          <Sliders size={15} />
          <span>Operational Rules</span>
        </button>
        <button 
          className={`btn ${activeTab === 'knowledge' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('knowledge')}
        >
          <HelpCircle size={15} />
          <span>Knowledge & Tone</span>
        </button>
        <button 
          className={`btn ${activeTab === 'workflow' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('workflow')}
        >
          <FileCheck size={15} />
          <span>Compiled Workflow Graph</span>
        </button>
      </div>

      {activeTab === 'rules' && (
        <div className="card">
          <div className="card-title">
            <span>Scheduling & Guardrail Constraints</span>
            <Clock size={16} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 16 }}>
            <div className="form-group">
              <label className="form-label">Minimum Booking Notice (Hours)</label>
              <input 
                type="number"
                className="form-input" 
                value={minNotice} 
                onChange={(e) => setMinNotice(Number(e.target.value))} 
                min={0}
                max={168}
              />
              <div className="form-hint">Prevents customers from booking slots on less than this notice.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Booking Horizon (Days)</label>
              <input 
                type="number"
                className="form-input" 
                value={maxHorizon} 
                onChange={(e) => setMaxHorizon(Number(e.target.value))} 
                min={1}
                max={365}
              />
              <div className="form-hint">Furthest future date customers can schedule an appointment.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Cancellation Policy Window (Hours)</label>
              <input 
                type="number"
                className="form-input" 
                value={cancellation} 
                onChange={(e) => setCancellation(Number(e.target.value))} 
                min={0}
                max={72}
              />
              <div className="form-hint">Minimum advance warning required for customer cancellations without penalty.</div>
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input 
                type="checkbox" 
                checked={requireApproval} 
                onChange={(e) => setRequireApproval(e.target.checked)} 
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontWeight: 500 }}>Require explicit staff approval in Operator Inbox before confirming calendar bookings</span>
            </label>
            <div className="form-hint" style={{ marginLeft: 26 }}>
              Recommended during initial pilot phases to allow staff oversight of all incoming reservations.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="card">
          <div className="card-title">
            <span>AI Assistant Persona & Business FAQs</span>
            <HelpCircle size={16} />
          </div>

          <div className="form-group" style={{ marginTop: 16, maxWidth: 360 }}>
            <label className="form-label">Communication Tone</label>
            <select 
              className="select-input" 
              style={{ width: '100%' }}
              value={tone} 
              onChange={(e) => setTone(e.target.value as any)}
            >
              <option value="friendly">Friendly & Warm</option>
              <option value="professional">Professional & Direct</option>
              <option value="concise">Concise & Minimal</option>
            </select>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Approved Business FAQs (Zero Hallucination Grounding)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {config.faqs.map((faq, idx) => (
                <div key={idx} style={{ padding: 14, backgroundColor: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Q: {faq.question}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>A: {faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">
              <span>Active Workflow Pipeline Blueprint (v{config.version})</span>
              <span className="badge badge-success">Compiled & Validated</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              This blueprint executes deterministically on every inbound WhatsApp message. AI models are strictly constrained to schema extraction nodes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* W1 */}
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Workflow 1: Inquiry to Validated Lead</h3>
                </div>
                <span className="badge badge-neutral">W1 Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>WhatsApp Inbound</span>
                <ArrowRight size={14} />
                <span>AI Schema Extraction (Name, Area, Service)</span>
                <ArrowRight size={14} />
                <span>Save to Postgres</span>
                <ArrowRight size={14} />
                <span>Mirror to Google Sheets</span>
                <ArrowRight size={14} />
                <span>Staff Email Alert</span>
              </div>
            </div>

            {/* W2 */}
            <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} style={{ color: '#0284c7' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Workflow 2: Inquiry to Confirmed Appointment</h3>
                </div>
                <span className="badge badge-neutral">W2 Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>Date Extraction</span>
                <ArrowRight size={14} />
                <span>Google Calendar Free/Busy Check</span>
                <ArrowRight size={14} />
                <span>Propose Slots</span>
                <ArrowRight size={14} />
                <span>Postgres Interval Lock</span>
                <ArrowRight size={14} />
                <span>Calendar Insert</span>
                <ArrowRight size={14} />
                <span>Confirmation Message</span>
              </div>
            </div>

            {/* W3 */}
            <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldAlert size={18} style={{ color: '#d97706' }} />
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>Workflow 3: Human Takeover & Exception Handling</h3>
                </div>
                <span className="badge badge-neutral">W3 Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>Exception Trigger (Complaint / Out of Area / Human Request)</span>
                <ArrowRight size={14} />
                <span>Pause Bot Engine</span>
                <ArrowRight size={14} />
                <span>Route to Operator Inbox</span>
                <ArrowRight size={14} />
                <span>Manual Staff Reply</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
