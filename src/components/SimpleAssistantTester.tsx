import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  FileSpreadsheet,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const SimpleAssistantTester: React.FC = () => {
  const { 
    simulatorMessages, 
    lastSimulationTrace, 
    runSimulator, 
    clearSimulator, 
    currentOrg,
    config 
  } = useApp();

  const [inputText, setInputText] = useState('');

  const handleSend = (text?: string) => {
    const msg = text || inputText;
    if (!msg.trim()) return;
    runSimulator(msg.trim());
    setInputText('');
  };

  const samplePrompts = [
    {
      label: '1. Standard Lead Inquiry',
      text: 'Hi, my name is David. How much is an apartment cleaning in Brooklyn?',
    },
    {
      label: '2. Book Appointment with Date',
      text: 'Hello! I would like to book a Deep Sanitation for tomorrow at 10:00 AM.',
    },
    {
      label: '3. Out of Area Request',
      text: 'Can you come clean our office in Staten Island this Friday?',
    },
  ];

  return (
    <div>
      <div className="page-hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-hero-title">Live WhatsApp Simulator</h1>
            <p className="page-hero-desc">
              Test how your AI assistant replies to customers and executes bookings in real time. (Safe test mode: no real messages are sent).
            </p>
          </div>
          <button className="btn-outline" onClick={clearSimulator}>
            <RotateCcw size={15} />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Preset Test Prompts */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>
          Quick Test:
        </span>
        {samplePrompts.map((p, i) => (
          <button 
            key={i} 
            className="btn-outline"
            style={{ fontSize: 13, padding: '8px 14px' }}
            onClick={() => handleSend(p.text)}
          >
            <Play size={12} style={{ color: 'var(--accent-green)' }} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* 2-Column Split: Chat on Left, Outcome on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* WhatsApp Phone Mockup */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', height: 560 }}>
          {/* Header */}
          <div style={{ backgroundColor: '#0f172a', padding: '16px 20px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{config.businessName}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>WhatsApp Business • Automated</div>
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {simulatorMessages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'customer' ? 'flex-end' : (msg.sender === 'bot' ? 'flex-start' : 'center'),
                  maxWidth: msg.sender === 'system' ? '100%' : '82%',
                }}
              >
                {msg.sender === 'system' ? (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 12px', backgroundColor: '#e2e8f0', borderRadius: 999 }}>
                    {msg.text}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      backgroundColor: msg.sender === 'customer' ? '#0f172a' : '#ffffff',
                      color: msg.sender === 'customer' ? '#ffffff' : '#0f172a',
                      border: msg.sender === 'bot' ? '1px solid var(--border-light)' : 'none',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{ fontSize: 10, color: msg.sender === 'customer' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                      {msg.timestamp}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Text Input */}
          <div style={{ padding: 14, borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8, backgroundColor: '#ffffff' }}>
            <input 
              className="input-clean"
              style={{ fontSize: 13, padding: '10px 14px' }}
              placeholder="Type customer WhatsApp message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="btn-solid" style={{ padding: '0 16px' }} onClick={() => handleSend()}>
              <Play size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: What the System Did */}
        <div>
          {lastSimulationTrace ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Outcome Card */}
              <div className="spacious-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {lastSimulationTrace.workflowTriggered === 'W3' ? (
                      <AlertCircle size={22} style={{ color: '#dc2626' }} />
                    ) : (
                      <CheckCircle2 size={22} style={{ color: 'var(--accent-green)' }} />
                    )}
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                      {lastSimulationTrace.workflowTriggered === 'W1' && 'Lead Saved Successfully'}
                      {lastSimulationTrace.workflowTriggered === 'W2' && 'Booking Available & Slot Reserved'}
                      {lastSimulationTrace.workflowTriggered === 'W3' && 'Human Staff Action Needed'}
                    </h3>
                  </div>
                  <span className="pill-active">
                    Workflow {lastSimulationTrace.workflowTriggered}
                  </span>
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {lastSimulationTrace.workflowTriggered === 'W1' && 'The AI captured the customer inquiry, extracted the service details, and automatically mirrored the new lead into your Google Sheet.'}
                  {lastSimulationTrace.workflowTriggered === 'W2' && 'The customer requested a specific time. Availability was checked against Google Calendar, a hold was placed on the slot, and a confirmation reply was formatted.'}
                  {lastSimulationTrace.workflowTriggered === 'W3' && (lastSimulationTrace.ruleEvaluation.reason || 'This inquiry required human review. Automated bot replies were paused to avoid errors.')}
                </p>
              </div>

              {/* Extracted Details Box */}
              <div className="spacious-card" style={{ marginBottom: 0 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Extracted Customer Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>CUSTOMER NAME</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{lastSimulationTrace.extractedFields.customerName || 'Customer'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>SERVICE REQUESTED</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{lastSimulationTrace.extractedFields.serviceName || 'Cleaning Service'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>SERVICE LOCATION</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{lastSimulationTrace.extractedFields.area || 'Standard Area'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PREFERRED TIME</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{lastSimulationTrace.extractedFields.requestedTime || 'Flexible'}</div>
                  </div>
                </div>
              </div>

              {/* Executed Destinations */}
              <div className="spacious-card" style={{ marginBottom: 0 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Actions Performed in Connected Tools
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lastSimulationTrace.ledgerEntries.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--bg-app)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.targetDestination}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {entry.nodeType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="spacious-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <MessageSquare size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Ready to Test</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 360, margin: '8px auto 0' }}>
                Click one of the test buttons above or type a message in the phone mockup to see how Virobyte handles inquiries.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
