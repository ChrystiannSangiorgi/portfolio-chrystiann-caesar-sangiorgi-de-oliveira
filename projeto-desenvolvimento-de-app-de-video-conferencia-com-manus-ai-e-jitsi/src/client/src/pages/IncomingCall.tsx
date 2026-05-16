/* ============================================================
   PERTINHO — Tela de Chamada Recebida
   Design: Foto em tela cheia com desfoque, dois botões enormes
   Comportamento: auto-atender após N segundos se configurado
   ============================================================ */

import { useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function IncomingCall() {
  const { incomingCall, answerCall, declineCall, config } = useApp();
  const [countdown, setCountdown] = useState(config.autoAnswerDelay);

  useEffect(() => {
    if (!config.autoAnswer) return;
    setCountdown(config.autoAnswerDelay);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [config.autoAnswer, config.autoAnswerDelay]);

  if (!incomingCall) return null;

  const { contact } = incomingCall;

  return (
    <div
      className="screen-enter"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflow: 'hidden',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {/* Background — blurred photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${contact.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.5)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '3rem 2rem 3rem',
        }}
      >
        {/* Top: name + avatar */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Ligando para você...
          </p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem' }}>
            {contact.name}
          </h1>
          <div
            className="incoming-pulse"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.8)',
              margin: '0 auto',
            }}
          >
            <img
              src={contact.photo}
              alt={contact.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=3B7A57&color=fff&size=160`;
              }}
            />
          </div>
          {contact.relation && (
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.75rem', fontWeight: 400 }}>
              {contact.relation}
            </p>
          )}
        </div>

        {/* Auto-answer countdown */}
        {config.autoAnswer && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
              Atendendo automaticamente em {countdown}s
            </p>
          </div>
        )}

        {/* Bottom: action buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            width: '100%',
            maxWidth: '480px',
          }}
        >
          {/* Decline */}
          <button
            onClick={declineCall}
            aria-label="Recusar chamada"
            style={{
              backgroundColor: '#C7423B',
              color: '#FFFFFF',
              height: '120px',
              borderRadius: '1.5rem',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 8px 24px rgba(199, 66, 59, 0.4)',
              transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <PhoneOff size={36} />
            Recusar
          </button>

          {/* Answer */}
          <button
            onClick={answerCall}
            aria-label="Atender chamada"
            style={{
              backgroundColor: '#3B7A57',
              color: '#FFFFFF',
              height: '120px',
              borderRadius: '1.5rem',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 8px 24px rgba(59, 122, 87, 0.4)',
              transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Phone size={36} />
            Atender
          </button>
        </div>
      </div>
    </div>
  );
}
