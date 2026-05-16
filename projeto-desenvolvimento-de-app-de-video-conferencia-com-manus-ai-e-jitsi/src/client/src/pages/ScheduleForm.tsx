/* ============================================================
   PERTINHO — Formulário de Agendamento de Chamada
   Design: Seleção de contato, dias da semana, horário, lembrete
   ============================================================ */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { addSchedule, generateId, getContacts, DAY_NAMES_FULL } from '@/lib/store';

export default function ScheduleForm() {
  const { setFamilyScreen } = useApp();
  const contacts = getContacts();

  const [contactId, setContactId] = useState(contacts[0]?.id ?? '');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [time, setTime] = useState('16:00');
  const [reminder, setReminder] = useState(true);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!contactId) {
      alert('Selecione um contato.');
      return;
    }
    if (selectedDays.length === 0) {
      alert('Selecione pelo menos um dia da semana.');
      return;
    }
    setSaving(true);
    addSchedule({
      id: generateId(),
      contactId,
      days: selectedDays.sort(),
      time,
      reminder,
    });
    setFamilyScreen('dashboard');
  };

  return (
    <div
      className="screen-enter min-h-screen flex flex-col"
      style={{ backgroundColor: '#F3EDE3', fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#3B7A57',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => setFamilyScreen('dashboard')}
          style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '0.25rem' }}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#FFFFFF' }}>
          Agendar Chamada
        </h1>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Contact selector */}
        <FormCard>
          <label style={labelStyle}>Contato</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setContactId(c.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: `2px solid ${contactId === c.id ? '#3B7A57' : '#E8E0D4'}`,
                  backgroundColor: contactId === c.id ? '#3B7A5710' : '#FAFAFA',
                  transition: 'border-color 150ms ease',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                <img
                  src={c.photo}
                  alt={c.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=3B7A57&color=fff&size=40`;
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2B2B2B' }}>{c.name}</p>
                  {c.relation && <p style={{ fontSize: '0.8rem', color: '#6B6B6B' }}>{c.relation}</p>}
                </div>
                {contactId === c.id && (
                  <div style={{ marginLeft: 'auto', color: '#3B7A57', fontWeight: 700 }}>✓</div>
                )}
              </button>
            ))}
          </div>
        </FormCard>

        {/* Days of week */}
        <FormCard>
          <label style={labelStyle}>Dias da semana</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DAY_NAMES_FULL.map((day, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '2rem',
                  border: `2px solid ${selectedDays.includes(i) ? '#3B7A57' : '#E8E0D4'}`,
                  backgroundColor: selectedDays.includes(i) ? '#3B7A57' : '#FAFAFA',
                  color: selectedDays.includes(i) ? '#FFFFFF' : '#6B6B6B',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'Nunito, sans-serif',
                  transition: 'all 150ms ease',
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </FormCard>

        {/* Time picker */}
        <FormCard>
          <label style={labelStyle}>Horário</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '0.875rem',
              border: '1.5px solid #E8E0D4',
              fontSize: '1.5rem',
              fontFamily: 'Nunito, sans-serif',
              color: '#2B2B2B',
              backgroundColor: '#FAFAFA',
              outline: 'none',
              textAlign: 'center',
              fontWeight: 700,
            }}
          />
        </FormCard>

        {/* Reminder toggle */}
        <FormCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2B2B2B' }}>
                🔔 Lembrar 5 min antes
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>
                Avisa a {getContacts().find(c => c.id === contactId)?.name ?? 'idosa'} antes da chamada
              </p>
            </div>
            <ToggleSwitch checked={reminder} onChange={setReminder} />
          </div>
        </FormCard>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: '#3B7A57',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '1rem',
            height: '60px',
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'Nunito, sans-serif',
            boxShadow: '0 4px 12px rgba(59, 122, 87, 0.3)',
            transition: 'transform 160ms ease',
            opacity: saving ? 0.7 : 1,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Salvar Agendamento
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#6B6B6B',
  marginBottom: '0.75rem',
};

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: checked ? '#3B7A57' : '#D4CCC0',
        border: 'none',
        position: 'relative',
        transition: 'background-color 200ms ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '27px' : '3px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 200ms ease',
        }}
      />
    </button>
  );
}
