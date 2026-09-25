import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export const OnboardingWizardView: React.FC = () => {
  const { config, updateBusinessConfig, publishBusinessConfig, currentOrg, canPublish, services } = useApp();

  const [step, setStep] = useState<number>(1);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  // Form Fields
  const [bizName, setBizName] = useState(config.businessName);
  const [phone, setPhone] = useState(config.publicContactPhone);
  const [email, setEmail] = useState(config.publicContactEmail);
  const [timezone, setTimezone] = useState(config.timezone);
  
  const [minNotice, setMinNotice] = useState(config.minNoticeHours);
  const [maxHorizon, setMaxHorizon] = useState(config.maxHorizonDays);
  const [cancellation, setCancellation] = useState(config.cancellationPolicyHours);
  const [requireApproval, setRequireApproval] = useState(config.requireHumanApprovalForBookings);

  const [tone, setTone] = useState(config.tone);

  const handleSaveDraft = () => {
    updateBusinessConfig({
      businessName: bizName,
      publicContactPhone: phone,
      publicContactEmail: email,
      timezone,
      minNoticeHours: Number(minNotice),
      maxHorizonDays: Number(maxHorizon),
      cancellationPolicyHours: Number(cancellation),
      requireHumanApprovalForBookings: requireApproval,
      tone: tone as any,
    });
    setDraftNotice('Draft saved successfully. Progress is preserved.');
    setTimeout(() => setDraftNotice(null), 3000);
  };

  const handlePublish = () => {
    updateBusinessConfig({
      businessName: bizName,
      publicContactPhone: phone,
      publicContactEmail: email,
      timezone,
      minNoticeHours: Number(minNotice),
      maxHorizonDays: Number(maxHorizon),
      cancellationPolicyHours: Number(cancellation),
      requireHumanApprovalForBookings: requireApproval,
      tone: tone as any,
    });
    publishBusinessConfig();
    setDraftNotice(`Configuration v${config.version + 1} published to live assistant!`);
    setTimeout(() => setDraftNotice(null), 4000);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Guided Setup Wizard</h1>
          <p className="page-subtitle">
            Configure {currentOrg.name} in 4 structured steps. Non-technical owners can complete setup without understanding APIs or code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleSaveDraft}>
            <Bookmark size={15} />
            <span>Save Draft</span>
          </button>
          {canPublish && (
            <button className="btn btn-primary" onClick={handlePublish}>
              <Send size={15} />
              <span>Publish Live Config</span>
            </button>
          )}
        </div>
      </div>

      {draftNotice && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={16} />
          <span>{draftNotice}</span>
        </div>
      )}

      {/* Progress Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, backgroundColor: 'var(--bg-surface)', padding: '16px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setStep(1)}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: step >= 1 ? 'var(--primary)' : 'var(--bg-subtle)', color: step >= 1 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>1</div>
          <span style={{ fontSize: 13, fontWeight: step === 1 ? 700 : 500 }}>Identity</span>
        </div>
        <div style={{ flex: 1, height: 2, backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--border-light)', margin: '0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setStep(2)}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: step >= 2 ? 'var(--primary)' : 'var(--bg-subtle)', color: step >= 2 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>2</div>
          <span style={{ fontSize: 13, fontWeight: step === 2 ? 700 : 500 }}>Services ({services.length})</span>
        </div>
        <div style={{ flex: 1, height: 2, backgroundColor: step >= 3 ? 'var(--primary)' : 'var(--border-light)', margin: '0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setStep(3)}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: step >= 3 ? 'var(--primary)' : 'var(--bg-subtle)', color: step >= 3 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>3</div>
          <span style={{ fontSize: 13, fontWeight: step === 3 ? 700 : 500 }}>Operating Rules</span>
        </div>
        <div style={{ flex: 1, height: 2, backgroundColor: step >= 4 ? 'var(--primary)' : 'var(--border-light)', margin: '0 12px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setStep(4)}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: step >= 4 ? 'var(--primary)' : 'var(--bg-subtle)', color: step >= 4 ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>4</div>
          <span style={{ fontSize: 13, fontWeight: step === 4 ? 700 : 500 }}>Live Review</span>
        </div>
      </div>

      {/* Step 1: Identity */}
      {step === 1 && (
        <div className="card">
          <div className="card-title">
            <span>Step 1: Business Identity & Contact</span>
            <Building2 size={16} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
            <div className="form-group">
              <label className="form-label">Legal & Brand Business Name</label>
              <input className="form-input" value={bizName} onChange={e => setBizName(e.target.value)} required />
              <div className="form-hint">Used in WhatsApp greetings and Google Calendar appointment descriptions.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Operational Timezone</label>
              <input className="form-input" value={timezone} onChange={e => setTimezone(e.target.value)} required />
              <div className="form-hint">All booking slots and customer confirmations are computed in this IANA timezone.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Customer Support Phone</label>
              <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Staff Notifications Email</label>
              <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
              <div className="form-hint">Receives instant notifications when new leads are captured or human review is needed.</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => { handleSaveDraft(); setStep(2); }}>
              <span>Continue to Services</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <div className="card">
          <div className="card-title">
            <span>Step 2: Service Catalog Overview</span>
            <Sparkles size={16} />
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 16 }}>
            The AI and booking state machine strictly quote and schedule these validated services. Free-form text can never invent prices or services outside this catalog.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {services.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, backgroundColor: 'var(--bg-app)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Areas: <strong>{s.allowedAreas.join(', ')}</strong> • Duration: <strong>{s.durationMinutes}m</strong> (+{s.bufferMinutes}m buffer)
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>
                  ${(s.priceMinor / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              <span>Continue to Rules</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Rules */}
      {step === 3 && (
        <div className="card">
          <div className="card-title">
            <span>Step 3: Scheduling Rules & AI Persona</span>
            <Clock size={16} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 16 }}>
            <div className="form-group">
              <label className="form-label">Minimum Booking Notice</label>
              <input type="number" className="form-input" value={minNotice} onChange={e => setMinNotice(Number(e.target.value))} />
              <div className="form-hint">Hours before appointment time.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Max Booking Horizon</label>
              <input type="number" className="form-input" value={maxHorizon} onChange={e => setMaxHorizon(Number(e.target.value))} />
              <div className="form-hint">Days into the future allowed.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Cancellation Deadline</label>
              <input type="number" className="form-input" value={cancellation} onChange={e => setCancellation(Number(e.target.value))} />
              <div className="form-hint">Hours before booking start.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Assistant Tone</label>
              <select className="select-input" style={{ width: '100%' }} value={tone} onChange={e => setTone(e.target.value as any)}>
                <option value="friendly">Friendly & Warm</option>
                <option value="professional">Professional & Crisp</option>
                <option value="concise">Concise & Direct</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={requireApproval} onChange={e => setRequireApproval(e.target.checked)} style={{ width: 16, height: 16 }} />
              <span style={{ fontWeight: 500 }}>Require human staff approval in Operator Inbox before confirming calendar appointments</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            <button className="btn btn-primary" onClick={() => { handleSaveDraft(); setStep(4); }}>
              <span>Review Compiled Workflow</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Live Review & Compilation */}
      {step === 4 && (
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">
              <span>Step 4: Compiled Workflow Definition (Ready for Activation)</span>
              <span className="badge badge-success">Valid Schema</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              All configuration rules have been compiled into an immutable JSON DAG. Inbound messages from WhatsApp will be routed through this graph.
            </p>
          </div>

          <div className="card" style={{ backgroundColor: 'var(--bg-app)', fontFamily: 'monospace', fontSize: 12, padding: 18, marginBottom: 24, overflowX: 'auto' }}>
            <pre style={{ margin: 0, color: 'var(--text-main)' }}>
{JSON.stringify({
  tenantId: currentOrg.id,
  configVersion: config.version + 1,
  businessName: bizName,
  timezone,
  activeServicesCount: services.length,
  schedulingPolicy: {
    minNoticeHours: minNotice,
    maxHorizonDays: maxHorizon,
    cancellationPolicyHours: cancellation,
    requireApproval,
  },
  aiGuardrails: {
    tone,
    escalationKeywordsCount: config.escalationKeywords.length,
    boundedIntelligence: true,
  },
  compiledWorkflows: ['W1_LEAD_CAPTURE', 'W2_APPOINTMENT_BOOKING', 'W3_HUMAN_TAKEOVER'],
}, null, 2)}
            </pre>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setStep(3)}>
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
            {canPublish ? (
              <button className="btn btn-primary" onClick={handlePublish}>
                <Send size={15} />
                <span>Publish Version v{config.version + 1}</span>
              </button>
            ) : (
              <button className="btn btn-secondary" disabled>
                Publish (Requires Owner or Manager role)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
