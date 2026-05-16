/* ============================================================
   PERTINHO — Painel do Modo Família
   Design: Lista de contatos, agendamentos, configurações
   Comportamento: CRUD de contatos e agendamentos
   ============================================================ */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Settings, LogOut, Phone, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  getContacts,
  getSchedules,
  deleteContact,
  deleteSchedule,
  Contact,
  Schedule,
  DAY_NAMES,
  getConfig,
  saveConfig,
  AppConfig,
} from '@/lib/store';

export default function FamilyDashboard() {
  const { setFamilyScreen, exitFamilyMode, setEditingContact, refreshConfig } = useApp();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [config, setConfigState] = useState<AppConfig>(getConfig());
  const [activeTab, setActiveTab] = useState<'contacts' | 'schedules' | 'settings'>('contacts');

  const reload = () => {
    setContacts(getContacts());
    setSchedules(getSchedules());
    setConfigState(getConfig());
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDeleteContact = (id: string) => {
    if (confirm('Remover este contato?')) {
      deleteContact(id);
      reload();
    }
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Remover este agendamento?')) {
      deleteSchedule(id);
      reload();
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setFamilyScreen('edit-contact');
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    saveConfig(newConfig);
    setConfigState(newConfig);
    refreshConfig();
  };

  const getContactById = (id: string) => contacts.find((c) => c.id === id);

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
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
            Modo Família
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.125rem' }}>
            Configurações de {config.elderName}
          </p>
        </div>
        <button
          onClick={exitFamilyMode}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.5rem 0.75rem',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            fontFamily: 'Nunito, sans-serif',
          }}
          aria-label="Sair do Modo Família"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E0D4',
        }}
      >
        {[
          { id: 'contacts', icon: <Phone size={16} />, label: 'Contatos' },
          { id: 'schedules', icon: <Calendar size={16} />, label: 'Agendamentos' },
          { id: 'settings', icon: <Settings size={16} />, label: 'Config.' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              flex: 1,
              padding: '1rem 0.5rem',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #3B7A57' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#3B7A57' : '#6B6B6B',
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: '0.875rem',
              fontFamily: 'Nunito, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              transition: 'color 150ms ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2B2B2B' }}>
                Contatos ({contacts.length})
              </h2>
              <button
                onClick={() => setFamilyScreen('add-contact')}
                style={{
                  backgroundColor: '#3B7A57',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>

            {contacts.length === 0 ? (
              <EmptyState icon="👥" message="Nenhum contato cadastrado ainda." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src={contact.photo}
                      alt={contact.name}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=3B7A57&color=fff&size=56`;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2B2B2B' }}>
                        {contact.name}
                      </p>
                      {contact.relation && (
                        <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>{contact.relation}</p>
                      )}
                      <p style={{ fontSize: '0.75rem', color: '#9B9B9B', marginTop: '0.125rem' }}>
                        Sala: {contact.roomId}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <IconButton
                        onClick={() => handleEditContact(contact)}
                        icon={<Edit2 size={18} />}
                        color="#3B7A57"
                        label="Editar"
                      />
                      <IconButton
                        onClick={() => handleDeleteContact(contact.id)}
                        icon={<Trash2 size={18} />}
                        color="#C7423B"
                        label="Remover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCHEDULES TAB */}
        {activeTab === 'schedules' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2B2B2B' }}>
                Agendamentos ({schedules.length})
              </h2>
              <button
                onClick={() => setFamilyScreen('add-schedule')}
                style={{
                  backgroundColor: '#3B7A57',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  fontFamily: 'Nunito, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Plus size={16} />
                Agendar
              </button>
            </div>

            {schedules.length === 0 ? (
              <EmptyState icon="📅" message="Nenhum agendamento criado ainda." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {schedules.map((schedule) => {
                  const contact = getContactById(schedule.contactId);
                  return (
                    <div
                      key={schedule.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '1rem',
                        padding: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {contact && (
                              <img
                                src={contact.photo}
                                alt={contact.name}
                                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=3B7A57&color=fff&size=32`;
                                }}
                              />
                            )}
                            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2B2B2B' }}>
                              {contact?.name ?? 'Contato removido'}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6B6B6B' }}>
                            <Clock size={14} />
                            <span style={{ fontSize: '0.875rem' }}>
                              {schedule.days.map((d) => DAY_NAMES[d]).join(', ')} às {schedule.time}
                            </span>
                          </div>
                          {schedule.reminder && (
                            <p style={{ fontSize: '0.75rem', color: '#E08D3C', marginTop: '0.25rem', fontWeight: 600 }}>
                              🔔 Lembrete 5 min antes
                            </p>
                          )}
                        </div>
                        <IconButton
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          icon={<Trash2 size={18} />}
                          color="#C7423B"
                          label="Remover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SettingsPanel config={config} onSave={handleSaveConfig} />
        )}
      </div>
    </div>
  );
}

function IconButton({ onClick, icon, color, label }: { onClick: () => void; icon: React.ReactNode; color: string; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '0.75rem',
        border: `1.5px solid ${color}20`,
        backgroundColor: `${color}10`,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 160ms ease',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {icon}
    </button>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B6B6B' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <p style={{ fontSize: '1rem', fontWeight: 400 }}>{message}</p>
    </div>
  );
}

function SettingsPanel({ config, onSave }: { config: AppConfig; onSave: (c: AppConfig) => void }) {
  const [form, setForm] = useState({ ...config });
  const [pinConfirm, setPinConfirm] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) {
      alert('O PIN deve ter exatamente 4 dígitos numéricos.');
      return;
    }
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#2B2B2B' }}>Configurações</h2>

      <SettingCard>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6B6B', display: 'block', marginBottom: '0.5rem' }}>
          Nome do idoso
        </label>
        <input
          value={form.elderName}
          onChange={(e) => setForm({ ...form, elderName: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1.5px solid #E8E0D4',
            fontSize: '1rem',
            fontFamily: 'Nunito, sans-serif',
            color: '#2B2B2B',
            backgroundColor: '#FAFAFA',
            outline: 'none',
          }}
        />
      </SettingCard>

      <SettingCard>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B6B6B', display: 'block', marginBottom: '0.5rem' }}>
          Novo PIN (4 dígitos)
        </label>
        <input
          type="password"
          maxLength={4}
          value={form.pin}
          onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1.5px solid #E8E0D4',
            fontSize: '1rem',
            fontFamily: 'Nunito, sans-serif',
            color: '#2B2B2B',
            backgroundColor: '#FAFAFA',
            outline: 'none',
            letterSpacing: '0.5rem',
          }}
          placeholder="••••"
        />
      </SettingCard>

      <SettingCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#2B2B2B' }}>Atendimento automático</p>
            <p style={{ fontSize: '0.875rem', color: '#6B6B6B' }}>Atende a chamada sem ação do idoso</p>
          </div>
          <ToggleSwitch
            checked={form.autoAnswer}
            onChange={(v) => setForm({ ...form, autoAnswer: v })}
          />
        </div>
        {form.autoAnswer && (
          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', color: '#6B6B6B', display: 'block', marginBottom: '0.375rem' }}>
              Tempo até atender: {form.autoAnswerDelay}s
            </label>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={form.autoAnswerDelay}
              onChange={(e) => setForm({ ...form, autoAnswerDelay: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#3B7A57' }}
            />
          </div>
        )}
      </SettingCard>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: saved ? '#3B7A57' : '#3B7A57',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '1rem',
          height: '56px',
          fontSize: '1.125rem',
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          transition: 'transform 160ms ease',
          boxShadow: '0 4px 12px rgba(59, 122, 87, 0.3)',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {saved ? '✓ Salvo!' : 'Salvar Configurações'}
      </button>
    </div>
  );
}

function SettingCard({ children }: { children: React.ReactNode }) {
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
