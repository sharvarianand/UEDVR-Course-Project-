import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSync } from '../services/offlineSync';

export default function HazardModal({ language, onClose }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const [hazardType, setHazardType] = useState('Methane Gas Anomaly');
  const [zone, setZone] = useState('Sector 4 Mine • Pit 4');
  const [severity, setSeverity] = useState('High');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await offlineSync.recordHazardReport(
        hazardType,
        zone,
        severity,
        description || `${hazardType} reported at ${zone}`
      );
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <AlertTriangle size={22} color="var(--safety-amber)" />
            {t.hazardTitle}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="var(--safety-emerald)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#FFF', fontSize: '1.2rem' }}>Hazard Report Dispatched</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                Safety officers and triage teams have received this incident.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t.hazardTypeLabel}</label>
                <select 
                  className="form-input"
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                >
                  <option value="Methane Gas Anomaly">Methane Gas (CH4) Concentration Spike</option>
                  <option value="Structural Wall Fracture">Structural Rock / Wall Fracture</option>
                  <option value="Electrical Cable Damage">Exposed High-Voltage Cable / Sparking</option>
                  <option value="Water Influx">Uncontrolled Water Seepage</option>
                  <option value="Conveyor Friction & Overheat">Conveyor Belt Idler Friction / Smoke</option>
                  <option value="Ventilation Failure">Ventilation Fan Flutter / Airflow Drop</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t.zoneLabel}</label>
                  <select 
                    className="form-input"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                  >
                    <option value="Sector 4 Mine • Pit 4">Sector 4 • Pit 4</option>
                    <option value="Sector 2 Deep Shaft (-150m)">Sector 2 • Deep Shaft</option>
                    <option value="Sector 3 Incline Shaft">Sector 3 • Incline</option>
                    <option value="Exit Shaft B / Zone 4">Exit Shaft B</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.severityLabel}</label>
                  <select 
                    className="form-input"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Critical">🔴 Critical (Immediate Action)</option>
                    <option value="High">🟠 High Priority</option>
                    <option value="Medium">🟡 Medium Triage</option>
                    <option value="Low">🟢 Low / Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.descLabel}</label>
                <textarea 
                  className="form-input"
                  rows={3}
                  placeholder="Provide any sensory or visual details (odor, crack width, smoke color)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                disabled={isSubmitting}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Dispatching...' : t.submitHazard}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
