/* ============================================================
   PERTINHO — Formulário de Cadastro/Edição de Contato
   Design: Campos grandes, foto com upload, sala gerada automaticamente
   ============================================================ */

import { useState, useRef } from 'react';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  addContact,
  updateContact,
  generateRoomId,
  generateId,
  getConfig,
  Contact,
} from '@/lib/store';

interface Props {
  mode: 'add' | 'edit';
}

export default function ContactForm({ mode }: Props) {
  const { setFamilyScreen, editingContact, setEditingContact } = useApp();
  const config = getConfig();

  const [name, setName] = useState(mode === 'edit' && editingContact ? editingContact.name : '');
  const [relation, setRelation] = useState(mode === 'edit' && editingContact ? editingContact.relation : '');
  const [photo, setPhoto] = useState(mode === 'edit' && editingContact ? editingContact.photo : '');
  const [photoPreview, setPhotoPreview] = useState(mode === 'edit' && editingContact ? editingContact.photo : '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const roomId = name.trim()
    ? generateRoomId(config.elderName, name.trim())
    : 'pertinho-cida-...';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhoto(dataUrl);
      setPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('O nome é obrigatório.');
      return;
    }
    setSaving(true);

    const contact: Contact = {
      id: mode === 'edit' && editingContact ? editingContact.id : generateId(),
      name: name.trim(),
      relation: relation.trim(),
      photo: photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=3B7A57&color=fff&size=200`,
      roomId,
    };

    if (mode === 'edit') {
      updateContact(contact);
    } else {
      addContact(contact);
    }

    setEditingContact(null);
    setFamilyScreen('dashboard');
  };

  const handleBack = () => {
    setEditingContact(null);
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
          onClick={handleBack}
          style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '0.25rem' }}
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#FFFFFF' }}>
          {mode === 'add' ? 'Adicionar Contato' : 'Editar Contato'}
        </h1>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #3B7A57',
              backgroundColor: '#E8E0D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Foto do contato"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <User size={48} color="#6B6B6B" />
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3B7A57',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}
            >
              <Camera size={16} color="#FFFFFF" />
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'none',
              border: '1.5px solid #3B7A57',
              borderRadius: '0.75rem',
              padding: '0.5rem 1rem',
              color: '#3B7A57',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            {photoPreview ? 'Trocar foto' : 'Adicionar foto'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Name */}
        <FormField label="Nome *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Marina"
            style={inputStyle}
          />
        </FormField>

        {/* Relation */}
        <FormField label="Relação (opcional)">
          <input
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Ex: Filha, Neto, Amiga..."
            style={inputStyle}
          />
        </FormField>

        {/* Room ID (read-only) */}
        <FormField label="Sala Jitsi (gerada automaticamente)">
          <div
            style={{
              ...inputStyle,
              backgroundColor: '#F0EBE3',
              color: '#9B9B9B',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              cursor: 'default',
            }}
          >
            {roomId}
          </div>
        </FormField>

        {/* Save button */}
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
            marginTop: '0.5rem',
            boxShadow: '0 4px 12px rgba(59, 122, 87, 0.3)',
            transition: 'transform 160ms ease',
            opacity: saving ? 0.7 : 1,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {saving ? 'Salvando...' : 'Salvar Contato'}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '0.875rem',
  border: '1.5px solid #E8E0D4',
  fontSize: '1rem',
  fontFamily: 'Nunito, sans-serif',
  color: '#2B2B2B',
  backgroundColor: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#6B6B6B',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
