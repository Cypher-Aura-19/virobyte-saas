import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit3, Trash2, ShieldAlert, Sparkles, MapPin, Clock, Tag } from 'lucide-react';
import { Service } from '../types/domain';
import { ServiceFormData } from '../lib/schemas';

export const ServicesConfigView: React.FC = () => {
  const { services, addService, updateService, deleteService, canEditServices, currentRole, currentOrg } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [bufferMinutes, setBufferMinutes] = useState(30);
  const [priceDollars, setPriceDollars] = useState(150);
  const [areasInput, setAreasInput] = useState('Manhattan, Brooklyn');
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingServiceId(null);
    setName('');
    setDescription('');
    setDurationMinutes(120);
    setBufferMinutes(30);
    setPriceDollars(150);
    setAreasInput('Manhattan, Brooklyn');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingServiceId(service.id);
    setName(service.name);
    setDescription(service.description);
    setDurationMinutes(service.durationMinutes);
    setBufferMinutes(service.bufferMinutes);
    setPriceDollars(service.priceMinor / 100);
    setAreasInput(service.allowedAreas.join(', '));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const areas = areasInput.split(',').map(a => a.trim()).filter(Boolean);
    const serviceData: ServiceFormData = {
      name,
      description,
      durationMinutes: Number(durationMinutes),
      bufferMinutes: Number(bufferMinutes),
      priceMinor: Math.round(Number(priceDollars) * 100), // convert to minor units
      allowedAreas: areas,
      active: true,
    };

    if (editingServiceId) {
      const res = updateService(editingServiceId, serviceData);
      if (!res.success) {
        setFormError(res.error || 'Failed to update service');
        return;
      }
    } else {
      const res = addService(serviceData);
      if (!res.success) {
        setFormError(res.error || 'Failed to add service');
        return;
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Catalog & Rules</h1>
          <p className="page-subtitle">
            Configure standardized services for {currentOrg.name}. The AI and booking engine match incoming requests strictly to these definitions.
          </p>
        </div>

        {canEditServices ? (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        ) : (
          <button className="btn btn-secondary" disabled title="Operators cannot create or modify services">
            <ShieldAlert size={16} />
            <span>Add Service (Locked for {currentRole})</span>
          </button>
        )}
      </div>

      {!canEditServices && (
        <div className="alert-box alert-warning">
          <ShieldAlert size={18} />
          <div>
            <strong>RBAC Enforcement Active:</strong> You are currently simulating the <strong>Operator</strong> role. Operators have reply-only access and are prohibited from modifying pricing, durations, or service definitions.
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="table-container">
        <div className="table-header-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} style={{ color: 'var(--text-muted)' }} />
            <h2 className="table-heading">Active Services ({services.length})</h2>
          </div>
          <span className="badge badge-neutral">Validated Schema</span>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <Sparkles className="empty-icon" />
            <h3 className="empty-title">No services configured yet</h3>
            <p className="empty-desc">Create your first service offering to allow the WhatsApp assistant to quote and book appointments.</p>
            {canEditServices && (
              <button className="btn btn-primary" onClick={openAddModal}>
                <Plus size={16} /> Add First Service
              </button>
            )}
          </div>
        ) : (
          <table className="neat-table">
            <thead>
              <tr>
                <th>Service Name & Details</th>
                <th>Duration & Buffer</th>
                <th>Price (USD)</th>
                <th>Allowed Areas</th>
                <th>Status</th>
                {canEditServices && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  <td style={{ maxWidth: 320 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{srv.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {srv.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontWeight: 500 }}>{srv.durationMinutes} min</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      +{srv.bufferMinutes} min buffer
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 15 }}>
                      <Tag size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>${(srv.priceMinor / 100).toFixed(2)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      ({srv.priceMinor} minor units)
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {srv.allowedAreas.map((area, i) => (
                        <span key={i} className="badge badge-neutral" style={{ fontSize: 11, padding: '2px 6px' }}>
                          <MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />
                          {area}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  {canEditServices && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 10px' }} 
                          onClick={() => openEditModal(srv)}
                          title="Edit Service"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px 10px' }} 
                          onClick={() => deleteService(srv.id)}
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                {editingServiceId ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="alert-box alert-warning" style={{ marginBottom: 16 }}>
                    {formError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Service Name</label>
                  <input 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Standard Apartment Clean"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description for AI Assistant</label>
                  <textarea 
                    className="form-textarea" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Clear summary of what is included so the AI can explain it accurately..."
                    required
                  />
                  <div className="form-hint">Used by the WhatsApp bot to verify whether customer requests are covered.</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Price (USD $)</label>
                    <input 
                      type="number"
                      step="1"
                      className="form-input" 
                      value={priceDollars} 
                      onChange={(e) => setPriceDollars(Number(e.target.value))} 
                      required
                    />
                    <div className="form-hint">Stored as integer cents</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration (min)</label>
                    <input 
                      type="number"
                      step="15"
                      className="form-input" 
                      value={durationMinutes} 
                      onChange={(e) => setDurationMinutes(Number(e.target.value))} 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Buffer (min)</label>
                    <input 
                      type="number"
                      step="15"
                      className="form-input" 
                      value={bufferMinutes} 
                      onChange={(e) => setBufferMinutes(Number(e.target.value))} 
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Allowed Service Areas (Comma separated)</label>
                  <input 
                    className="form-input" 
                    value={areasInput} 
                    onChange={(e) => setAreasInput(e.target.value)} 
                    placeholder="Manhattan, Brooklyn Heights, Queens"
                    required
                  />
                  <div className="form-hint">Inquiries outside these areas trigger W3 exception routing.</div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingServiceId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
