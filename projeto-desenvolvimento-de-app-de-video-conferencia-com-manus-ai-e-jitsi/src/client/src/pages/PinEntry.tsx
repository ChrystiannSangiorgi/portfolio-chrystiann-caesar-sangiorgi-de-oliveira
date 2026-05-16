/* ============================================================
   PERTINHO — Tela de Entrada de PIN
   Design: Teclado numérico grande, feedback visual de erro
   Comportamento: PIN correto → Modo Família; errado → shake
   ============================================================ */

import { useState } from 'react';
import { Delete, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getConfig } from '@/lib/store';

export default function PinEntry() {
  const { setElderScreen, enterFamilyMode } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      setTimeout(() => {
        const config = getConfig();
        if (newPin === config.pin) {
          enterFamilyMode();
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
          }, 600);
        }
      }, 100);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClose = () => {
    setElderScreen('home');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div
      className="screen-enter"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        backgroundColor: '#FBF7F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          color: '#6B6B6B',
          padding: '0.5rem',
        }}
        aria-label="Fechar"
      >
        <X size={28} />
      </button>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2B2B2B' }}>
          Modo Família
        </h2>
        <p style={{ fontSize: '1rem', color: '#6B6B6B', marginTop: '0.25rem' }}>
          Digite o PIN de 4 dígitos
        </p>
      </div>

      {/* PIN dots */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          animation: shake ? 'pinShake 0.5s ease' : 'none',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: error
                ? '#C7423B'
                : pin.length > i
                ? '#3B7A57'
                : '#E8E0D4',
              transition: 'background-color 150ms ease',
              border: `2px solid ${error ? '#C7423B' : pin.length > i ? '#3B7A57' : '#D4CCC0'}`,
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: '#C7423B', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          PIN incorreto. Tente novamente.
        </p>
      )}

      {/* Keypad */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        {digits.map((d, i) => {
          if (d === '') return <div key={i} />;
          if (d === 'del') {
            return (
              <button
                key={i}
                onClick={handleDelete}
                disabled={pin.length === 0}
                aria-label="Apagar"
                style={{
                  height: '72px',
                  borderRadius: '1rem',
                  border: 'none',
                  backgroundColor: pin.length > 0 ? '#F3EDE3' : '#F9F5EF',
                  color: '#6B6B6B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 160ms ease',
                  opacity: pin.length === 0 ? 0.4 : 1,
                }}
                onMouseDown={(e) => pin.length > 0 && (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Delete size={24} />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => handleDigit(d)}
              aria-label={`Dígito ${d}`}
              style={{
                height: '72px',
                borderRadius: '1rem',
                border: 'none',
                backgroundColor: '#FFFFFF',
                color: '#2B2B2B',
                fontSize: '1.75rem',
                fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 160ms ease, background-color 160ms ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {d}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
