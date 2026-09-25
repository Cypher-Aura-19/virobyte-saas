import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Tag, Clock, CheckCircle2 } from 'lucide-react';
import { ServiceFormData } from '../lib/schemas';

export const SimpleBusinessSettings: React.FC = () => {
  const { services, addService, config, updateBusinessConfig, currentOrg } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState(140);
  const [serviceDuration, setServiceDuration] = useState(120);
  const [serviceAreas, setServiceAreas] = useState('Manhattan, Brooklyn');

  const [minNotice, setMinNotice] = useState(config.minNoticeHours);
  const [tone, setTone] = useState(config.tone);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const areas = serviceAreas.split(',').map(a => a.trim()).filter(Boolean);
    const data: ServiceFormData = {
      name: serviceName,
      description: `${serviceName} service for local clients.`,
      durationMinutes: Number(serviceDuration),
      bufferMinutes: 30,
      priceMinor: Math.round(Number(servicePrice) * 100),
      allowedAreas: areas,
      active: true,
    };
    addService(data);
    setIsModalOpen(false);
    setServiceName('');
  };

  const handleSaveRules = () => {
    updateBusinessConfig({
      minNoticeHours: Number(minNotice),
      tone: tone as any,
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 3000);
  };

  return (
    <div>
      <div className="page-hero">
        <h1 className="page-hero-title">Services & Business Rules</h1>
        <p className="page-hero-desc">
          Configure the services, pricing, and operating rules your WhatsApp AI assistant uses to quote customers.
        </p>
      </div>

      {saveBanner && (
        <div style={{ padding: '12px 18px', backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', borderRadius: 8, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <CheckCircle2 size={16} />
          <span>Business rules saved successfully!</span>
        </div>
      )}

      {/* Services Section */}
      <div className="spacious-card">
        <div className="spacious-card-header">
          <div>
            <h2 className="spacious-card-title">Available Services ({services.length})</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              The AI strictly quotes these verified prices and durations.
            </p>
          </div>
          <button className="btn-solid" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {services.map((srv) => (
            <div 
              key={srv.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff'
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{srv.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {srv.description}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  Covered Areas: <strong>{srv.allowedAreas.join(', ')}</strong> • Duration: <strong>{srv.durationMinutes} min</strong>
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>
                ${(srv.priceMinor / 100).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Guardrails */}
      <div className="spacious-card">
        <div className="spacious-card-header">
          <h2 className="spacious-card-title">Booking Guardrails</h2>
          <button className="btn-outline" onClick={handleSaveRules}>
            Save Rules
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              Minimum Booking Notice (Hours)
            </label>
            <input 
              type="number"
              className="input-clean"
              value={minNotice}
              onChange={e => setMinNotice(Number(e.target.value))}
            />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Customers cannot book an appointment on shorter notice than this.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              WhatsApp Assistant Tone
            </label>
            <select 
              className="input-clean"
              value={tone}
              onChange={e => setTone(e.target.value as any)}
            >
              <option value="friendly">Friendly & Warm</option>
              <option value="professional">Professional & Direct</option>
              <option value="concise">Concise & Minimal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setIsModalOpen(false)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add New Service</h3>
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Service Name</label>
                <input className="input-clean" value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="e.g. Move-out Deep Clean" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Price ($ USD)</label>
                  <input type="number" className="input-clean" value={servicePrice} onChange={e => setServicePrice(Number(e.target.value))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Duration (Minutes)</label>
                  <input type="number" step="15" className="input-clean" value={serviceDuration} onChange={e => setServiceDuration(Number(e.target.value))} required />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Allowed Service Areas (Comma-separated)</label>
                <input className="input-clean" value={serviceAreas} onChange={e => setServiceAreas(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-solid">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
