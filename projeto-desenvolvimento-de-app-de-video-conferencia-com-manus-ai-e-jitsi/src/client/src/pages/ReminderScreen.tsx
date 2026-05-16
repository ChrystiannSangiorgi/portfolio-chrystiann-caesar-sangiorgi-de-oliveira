/* ============================================================
   PERTINHO — Tela de Lembrete de Chamada Agendada
   Design: Sobreposição em tela cheia, laranja, botão OK gigante
   ============================================================ */

import { useApp } from '@/contexts/AppContext';
import { Bell } from 'lucide-react';

export default function ReminderScreen() {
  const { reminderContact, dismissReminder } = useApp();

  if (!reminderContact) return null;

  return (
    <div
      className="screen-enter"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: '#FBF7F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
      }}
    >
      {/* Bell icon */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#E08D3C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(224, 141, 60, 0.4)',
          animation: 'bellRing 1s ease-in-out infinite',
        }}
      >
        <Bell size={52} color="#FFFFFF" />
      </div>

      {/* Message */}
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#2B2B2B',
          lineHeight: 1.3,
          marginBottom: '1rem',
          maxWidth: '340px',
        }}
      >
        Daqui a pouco a {reminderContact.name} vai te ligar! ❤️
      </h1>

      {/* Avatar */}
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #E08D3C',
          marginBottom: '2rem',
          boxShadow: '0 4px 16px rgba(224, 141, 60, 0.3)',
        }}
      >
        <img
          src={reminderContact.photo}
          alt={reminderContact.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reminderContact.name)}&background=E08D3C&color=fff&size=120`;
          }}
        />
      </div>

      {/* OK button */}
      <button
        onClick={dismissReminder}
        aria-label="Ok, entendi"
        style={{
          backgroundColor: '#E08D3C',
          color: '#FFFFFF',
          height: '80px',
          width: '100%',
          maxWidth: '320px',
          borderRadius: '2rem',
          border: 'none',
          fontSize: '1.75rem',
          fontWeight: 800,
          fontFamily: 'Nunito, sans-serif',
          boxShadow: '0 8px 24px rgba(224, 141, 60, 0.4)',
          transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Ok! 👍
      </button>

      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(12deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(8deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
}
