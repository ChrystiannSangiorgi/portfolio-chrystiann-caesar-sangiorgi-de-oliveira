/* ============================================================
   PERTINHO — Tela Em Chamada com Jitsi Meet Real
   Integração com Jitsi External API para vídeo real
   Botões customizados: Silenciar, Câmera, Desligar
   ============================================================ */

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getConfig } from '@/lib/store';

interface JitsiAPI {
  executeCommand: (command: string, ...args: unknown[]) => void;
  dispose: () => void;
  addListener: (event: string, handler: () => void) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any;
  }
}

export default function InCall() {
  const { activeCall, endCall } = useApp();
  const config = getConfig();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [jitsiError, setJitsiError] = useState(false);
  const jitsiRef = useRef<JitsiAPI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (!activeCall || !containerRef.current || initializingRef.current) return;

    initializingRef.current = true;

    // Aguardar o script Jitsi carregar
    const checkJitsi = setInterval(() => {
      if (window.JitsiMeetExternalAPI) {
        clearInterval(checkJitsi);
        initializeJitsi();
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkJitsi);
      if (!jitsiLoaded) {
        setJitsiError(true);
        initializingRef.current = false;
      }
    }, 5000);

    return () => {
      clearInterval(checkJitsi);
      clearTimeout(timeout);
    };
  }, [activeCall, jitsiLoaded]);

  const initializeJitsi = () => {
    if (!containerRef.current || !activeCall) return;

    try {
      const domain = 'meet.jit.si';
      const options = {
        roomName: activeCall.roomId,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          toolbarButtons: [],
          hideConferenceTimer: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          DISABLE_VIDEO_BACKGROUND: true,
          DISABLE_AUDIO_LEVELS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
        userInfo: {
          displayName: config.elderName || 'Cida',
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiRef.current = api;

      // Listener para quando Jitsi estiver pronto
      api.addListener('videoConferenceJoined', () => {
        setJitsiLoaded(true);
      });

      // Listener para quando o usuário sair
      api.addListener('readyToClose', () => {
        handleHangup();
      });

      // Listener para mudanças de áudio
      api.addListener('audioMuteStatusChanged', (data: { muted: boolean }) => {
        setIsMuted(data.muted);
      });

      // Listener para mudanças de vídeo
      api.addListener('videoMuteStatusChanged', (data: { muted: boolean }) => {
        setIsCameraOff(data.muted);
      });

      setJitsiLoaded(true);
    } catch (error) {
      console.error('Erro ao inicializar Jitsi:', error);
      setJitsiError(true);
    }
  };

  const toggleMute = () => {
    if (jitsiRef.current) {
      jitsiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleCamera = () => {
    if (jitsiRef.current) {
      jitsiRef.current.executeCommand('toggleVideo');
    }
  };

  const handleHangup = () => {
    if (jitsiRef.current) {
      jitsiRef.current.dispose();
      jitsiRef.current = null;
    }
    endCall();
  };

  if (jitsiError) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F3EDE3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Nunito, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2B2B2B', marginBottom: '1rem' }}>
            ⚠️ Erro ao conectar
          </p>
          <p style={{ fontSize: '1rem', color: '#6B6B6B', marginBottom: '2rem' }}>
            Não foi possível carregar o Jitsi Meet. Verifique sua conexão e tente novamente.
          </p>
          <button
            onClick={handleHangup}
            style={{
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
              cursor: 'pointer',
            }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Jitsi Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          width: '100%',
          position: 'relative',
          backgroundColor: '#1a1a1a',
        }}
      />

      {/* Loading state */}
      {!jitsiLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: '#FFFFFF',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600 }}>
              Conectando...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Custom Controls Bar */}
      {jitsiLoaded && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            zIndex: 200,
          }}
        >
          {/* Mute Button */}
          <ControlButton
            icon={isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            onClick={toggleMute}
            isActive={isMuted}
            label={isMuted ? 'Dessilenciar' : 'Silenciar'}
          />

          {/* Camera Button */}
          <ControlButton
            icon={isCameraOff ? <VideoOff size={28} /> : <Video size={28} />}
            onClick={toggleCamera}
            isActive={isCameraOff}
            label={isCameraOff ? 'Ligar câmera' : 'Desligar câmera'}
          />

          {/* Hangup Button */}
          <ControlButton
            icon={<PhoneOff size={28} />}
            onClick={handleHangup}
            isActive={false}
            isHangup={true}
            label="Desligar"
          />
        </div>
      )}
    </div>
  );
}

interface ControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  isHangup?: boolean;
  label: string;
}

function ControlButton({ icon, onClick, isActive, isHangup, label }: ControlButtonProps) {
  const bgColor = isHangup ? '#D32F2F' : isActive ? '#F57C00' : '#3B7A57';

  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: bgColor,
        border: 'none',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 160ms ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.92)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {icon}
    </button>
  );
}
