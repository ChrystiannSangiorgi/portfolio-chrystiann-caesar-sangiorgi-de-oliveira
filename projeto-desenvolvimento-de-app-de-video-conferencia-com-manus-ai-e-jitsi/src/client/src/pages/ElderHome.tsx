/* ============================================================
   PERTINHO — Tela Inicial do Modo Idoso
   Design: Calor Familiar — fundo creme, cards brancos, botões verdes
   Comportamento: grade 2×3, toque longo no canto inferior direito → PIN
   ============================================================ */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getContacts, Contact } from '@/lib/store';

export default function ElderHome() {
  const { config, startCall, simulateIncomingCall, showReminder, setElderScreen } = useApp();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  // Long press on bottom-right corner to enter PIN mode
  const startLongPress = useCallback(() => {
    setIsLongPressing(true);
    setLongPressProgress(0);

    const startTime = Date.now();
    const duration = 3000;

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setLongPressProgress(pct);
    }, 50);

    longPressTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current!);
      setIsLongPressing(false);
      setLongPressProgress(0);
      setElderScreen('pin-entry');
    }, duration);
  }, [setElderScreen]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);
    setIsLongPressing(false);
    setLongPressProgress(0);
  }, []);

  return (
    <div
      className="screen-enter min-h-screen flex flex-col"
      style={{ backgroundColor: '#FBF7F0', fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Greeting */}
      <div className="pt-10 pb-6 px-6 text-center">
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#2B2B2B',
            lineHeight: 1.2,
          }}
        >
          Olá, {config.elderName}! 👋
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6B6B6B', marginTop: '0.5rem', fontWeight: 400 }}>
          Com quem você quer falar?
        </p>
      </div>

      {/* Contacts grid */}
      <div
        className="flex-1 px-4 pb-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          alignContent: 'start',
        }}
      >
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onCall={() => startCall(contact)}
          />
        ))}
      </div>

      {/* Demo buttons bar */}
      <div
        style={{
          backgroundColor: '#F3EDE3',
          borderTop: '1px solid #E8E0D4',
          padding: '0.75rem 1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#6B6B6B', width: '100%', textAlign: 'center', marginBottom: '0.25rem', fontWeight: 600 }}>
          🧪 Botões de Teste
        </span>
        {contacts.slice(0, 1).map((c) => (
          <button
            key={c.id}
            onClick={() => simulateIncomingCall(c)}
            style={{
              fontSize: '0.8rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '1rem',
              border: '1.5px solid #3B7A57',
              backgroundColor: 'transparent',
              color: '#3B7A57',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            📞 Simular chamada de {c.name}
          </button>
        ))}
        <button
          onClick={() => showReminder(contacts[0])}
          style={{
            fontSize: '0.8rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '1rem',
            border: '1.5px solid #E08D3C',
            backgroundColor: 'transparent',
            color: '#E08D3C',
            fontWeight: 700,
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          🔔 Simular lembrete
        </button>
      </div>

      {/* Long press zone — bottom right corner (invisible) */}
      <div
        onMouseDown={startLongPress}
        onMouseUp={cancelLongPress}
        onMouseLeave={cancelLongPress}
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '80px',
          height: '80px',
          zIndex: 50,
          cursor: 'default',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        aria-label="Acesso ao Modo Família"
        role="button"
      >
        {isLongPressing && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid #E8E0D4',
              overflow: 'hidden',
              backgroundColor: '#FBF7F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ position: 'absolute', top: 0, left: 0 }}>
              <circle
                cx="22" cy="22" r="19"
                fill="none"
                stroke="#3B7A57"
                strokeWidth="3"
                strokeDasharray={`${(longPressProgress / 100) * 119.4} 119.4`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dasharray 50ms linear' }}
              />
            </svg>
            <span style={{ fontSize: '1.25rem', zIndex: 1 }}>🔒</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, onCall }: { contact: Contact; onCall: () => void }) {
  return (
    <div className="contact-card">
      {/* Avatar */}
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #FBF7F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        <img
          src={contact.photo}
          alt={contact.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=3B7A57&color=fff&size=120`;
          }}
        />
      </div>

      {/* Name & relation */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.375rem', fontWeight: 700, color: '#2B2B2B', lineHeight: 1.2 }}>
          {contact.name}
        </p>
        {contact.relation && (
          <p style={{ fontSize: '1rem', color: '#6B6B6B', fontWeight: 400, marginTop: '0.125rem' }}>
            {contact.relation}
          </p>
        )}
      </div>

      {/* Call button */}
      <button
        className="btn-call btn-call-pulse"
        onClick={onCall}
        aria-label={`Chamar ${contact.name}`}
        style={{ fontSize: '1.125rem' }}
      >
        <Phone size={22} />
        Chamar
      </button>
    </div>
  );
}
