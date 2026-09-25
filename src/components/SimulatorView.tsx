import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Calendar, 
  FileSpreadsheet, 
  Mail, 
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';

export const SimulatorView: React.FC = () => {
  const { 
    simulatorMessages, 
    lastSimulationTrace, 
    actionLedger, 
    runSimulator, 
    clearSimulator, 
    currentOrg,
    services,
    config 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    runSimulator(text.trim());
    setInputMessage('');
  };

  const scenarios = [
    {
      title: 'Standard Inquiry (W1)',
      prompt: 'Hi, my name is David. How much for an apartment cleaning in Brooklyn?',
      desc: 'Triggers W1: Extracts name/area/service, quotes price, upserts to Google Sheets, alerts staff.',
    },
    {
      title: 'Booking with Slot (W2)',
      prompt: 'Hello! I need to book a Deep Sanitation for tomorrow 10:00 AM in Manhattan.',
      desc: 'Triggers W2: Evaluates working hours, checks calendar free/busy, acquires Postgres slot lock.',
    },
    {
      title: 'Out of Area (W3 Exception)',
      prompt: 'Can you clean an office in Staten Island this Friday?',
      desc: 'Triggers W3: Area is outside allowed coverage. Pauses bot and routes to operator inbox.',
    },
    {
      title: 'Complaint & Takeover (W3)',
      prompt: 'I want to speak to a manager right now, the previous cleaner was late!',
      desc: 'Triggers W3: Escalation keyword detected. Halts bot output and flags priority alert.',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Interactive Staging Simulator</h1>
          <p className="page-subtitle">
            Sprint 2 Test Harness • Test the compiled workflow end-to-end with simulated customer messages.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={clearSimulator}>
          <RotateCcw size={15} />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Zero Write Guarantee Banner */}
      <div className="card" style={{ marginBottom: 20, backgroundColor: 'var(--bg-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck size={28} style={{ color: 'var(--success-text)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Safe Staging Sandbox Mode Active</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Zero external side-effects. Messages are never sent to real customers, and calendar slots are recorded only in the local Action Ledger for verification.
            </div>
          </div>
        </div>
      </div>

      {/* Preset Test Scenarios */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 8 }}>
          One-Click Test Scenarios
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {scenarios.map((sc, i) => (
            <div 
              key={i} 
              className="card" 
              style={{ cursor: 'pointer', padding: 14, transition: 'border-color 0.15s ease' }}
              onClick={() => handleSendMessage(sc.prompt)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{sc.title}</span>
                <Play size={13} style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                {sc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Left: Chat Simulator */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 600 }}>
          <div style={{ padding: '14px 18px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare size={18} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{config.businessName}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>WhatsApp Sandbox Assistant</div>
              </div>
            </div>
            <span className="badge badge-success" style={{ fontSize: 10, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>
              Online
            </span>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: 16, overflowY: 'auto', backgroundColor: '#f4f6f8', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {simulatorMessages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: msg.sender === 'customer' ? 'flex-end' : (msg.sender === 'bot' ? 'flex-start' : 'center'),
                  maxWidth: msg.sender === 'system' ? '100%' : '85%',
                }}
              >
                {msg.sender === 'system' ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 12px', backgroundColor: '#e2e8f0', borderRadius: 999 }}>
                    {msg.text}
                  </div>
                ) : (
                  <div 
                    style={{ 
                      padding: '10px 14px', 
                      borderRadius: 12, 
                      backgroundColor: msg.sender === 'customer' ? 'var(--primary)' : '#ffffff',
                      color: msg.sender === 'customer' ? '#ffffff' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      border: msg.sender === 'bot' ? '1px solid var(--border-light)' : 'none',
                      fontSize: 13,
                      lineHeight: 1.45,
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{ fontSize: 10, color: msg.sender === 'customer' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                      {msg.timestamp}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--border-light)', backgroundColor: '#fff', display: 'flex', gap: 8 }}>
            <input 
              className="form-input" 
              placeholder="Type simulated customer message..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              style={{ fontSize: 13 }}
            />
            <button className="btn btn-primary" onClick={() => handleSendMessage()} style={{ padding: '8px 14px' }}>
              <Play size={14} />
            </button>
          </div>
        </div>

        {/* Right: Execution Trace & Action Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {lastSimulationTrace ? (
            <>
              {/* Trigger & Extraction Card */}
              <div className="card" style={{ borderLeft: lastSimulationTrace.workflowTriggered === 'W3' ? '4px solid #dc2626' : '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                      Workflow Triggered: {lastSimulationTrace.workflowTriggered} ({lastSimulationTrace.intentDetected})
                    </h3>
                  </div>
                  <span className={`badge ${lastSimulationTrace.workflowTriggered === 'W3' ? 'badge-danger' : 'badge-success'}`}>
                    {lastSimulationTrace.workflowTriggered === 'W3' ? 'Exception Handled' : 'Automated Success'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, fontSize: 12, backgroundColor: 'var(--bg-app)', padding: 12, borderRadius: 6 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>CUSTOMER NAME</span>
                    <strong style={{ fontSize: 13 }}>{lastSimulationTrace.extractedFields.customerName || 'Unknown'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>SERVICE MATCH</span>
                    <strong style={{ fontSize: 13 }}>{lastSimulationTrace.extractedFields.serviceName || 'None'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>SERVICE AREA</span>
                    <strong style={{ fontSize: 13 }}>{lastSimulationTrace.extractedFields.area || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>REQUESTED TIME</span>
                    <strong style={{ fontSize: 13 }}>{lastSimulationTrace.extractedFields.requestedTime || 'N/A'}</strong>
                  </div>
                </div>

                {lastSimulationTrace.ruleEvaluation.reason && (
                  <div style={{ marginTop: 10, fontSize: 12, color: 'var(--danger-text)', fontWeight: 500 }}>
                    Notice: {lastSimulationTrace.ruleEvaluation.reason}
                  </div>
                )}
              </div>

              {/* Action Ledger Table */}
              <div className="table-container">
                <div className="table-header-box">
                  <div>
                    <h3 className="table-heading">Simulated Action Ledger</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Deterministic operations queued for execution with provider destination bindings.
                    </p>
                  </div>
                  <span className="badge badge-neutral">Dry Run Log</span>
                </div>

                <table className="neat-table">
                  <thead>
                    <tr>
                      <th>Node Action</th>
                      <th>Target Destination</th>
                      <th>Status</th>
                      <th>Payload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastSimulationTrace.ledgerEntries.map((entry) => (
                      <React.Fragment key={entry.id}>
                        <tr>
                          <td>
                            <code style={{ fontWeight: 600, fontSize: 12 }}>{entry.nodeType}</code>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.operationKey}</div>
                          </td>
                          <td style={{ fontSize: 12 }}>
                            {entry.targetDestination}
                          </td>
                          <td>
                            {entry.status === 'simulated_success' && (
                              <span className="badge badge-success" style={{ fontSize: 11 }}>
                                <CheckCircle2 size={11} /> Success
                              </span>
                            )}
                            {entry.status === 'simulated_exception' && (
                              <span className="badge badge-warning" style={{ fontSize: 11 }}>
                                <AlertTriangle size={11} /> Halted
                              </span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '3px 8px', fontSize: 11 }}
                              onClick={() => setExpandedPayloadId(expandedPayloadId === entry.id ? null : entry.id)}
                            >
                              <Code size={11} />
                              <span>{expandedPayloadId === entry.id ? 'Hide' : 'Inspect'}</span>
                            </button>
                          </td>
                        </tr>
                        {expandedPayloadId === entry.id && (
                          <tr>
                            <td colSpan={4} style={{ backgroundColor: 'var(--bg-app)', padding: 12 }}>
                              <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto' }}>
                                {JSON.stringify(entry.dryRunPayload, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Sparkles size={36} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>No simulation run yet</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400, margin: '8px auto 0' }}>
                Pick one of the test scenarios above or type an inbound message in the chat box to observe real-time AI extraction and ledger generation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
