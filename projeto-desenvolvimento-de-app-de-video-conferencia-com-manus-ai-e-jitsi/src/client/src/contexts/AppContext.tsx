/* ============================================================
   PERTINHO — Contexto global do app
   Gerencia: modo atual (idoso/família), tela ativa, chamadas
   ============================================================ */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Contact, getConfig, AppConfig, getContacts, getSchedules } from '@/lib/store';

export type AppMode = 'elder' | 'family';

export type ElderScreen =
  | 'home'
  | 'incoming-call'
  | 'in-call'
  | 'pin-entry'
  | 'reminder';

export type FamilyScreen =
  | 'dashboard'
  | 'add-contact'
  | 'edit-contact'
  | 'add-schedule';

export interface CallState {
  contact: Contact;
  roomId: string;
}

interface AppContextValue {
  mode: AppMode;
  elderScreen: ElderScreen;
  familyScreen: FamilyScreen;
  activeCall: CallState | null;
  incomingCall: CallState | null;
  reminderContact: Contact | null;
  editingContact: Contact | null;
  config: AppConfig;

  // Actions
  setElderScreen: (screen: ElderScreen) => void;
  setFamilyScreen: (screen: FamilyScreen) => void;
  startCall: (contact: Contact) => void;
  endCall: () => void;
  simulateIncomingCall: (contact: Contact) => void;
  answerCall: () => void;
  declineCall: () => void;
  enterFamilyMode: () => void;
  exitFamilyMode: () => void;
  showReminder: (contact: Contact) => void;
  dismissReminder: () => void;
  setEditingContact: (contact: Contact | null) => void;
  refreshConfig: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>('elder');
  const [elderScreen, setElderScreen] = useState<ElderScreen>('home');
  const [familyScreen, setFamilyScreen] = useState<FamilyScreen>('dashboard');
  const [activeCall, setActiveCall] = useState<CallState | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallState | null>(null);
  const [reminderContact, setReminderContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [config, setConfig] = useState<AppConfig>(getConfig());

  const refreshConfig = useCallback(() => {
    setConfig(getConfig());
  }, []);

  const startCall = useCallback((contact: Contact) => {
    setActiveCall({ contact, roomId: contact.roomId });
    setElderScreen('in-call');
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
    setIncomingCall(null);
    setElderScreen('home');
  }, []);

  const simulateIncomingCall = useCallback((contact: Contact) => {
    setIncomingCall({ contact, roomId: contact.roomId });
    setElderScreen('incoming-call');
  }, []);

  const answerCall = useCallback(() => {
    if (incomingCall) {
      setActiveCall(incomingCall);
      setIncomingCall(null);
      setElderScreen('in-call');
    }
  }, [incomingCall]);

  const declineCall = useCallback(() => {
    setIncomingCall(null);
    setElderScreen('home');
  }, []);

  const enterFamilyMode = useCallback(() => {
    setMode('family');
    setFamilyScreen('dashboard');
  }, []);

  const exitFamilyMode = useCallback(() => {
    setMode('elder');
    setElderScreen('home');
  }, []);

  const showReminder = useCallback((contact: Contact) => {
    setReminderContact(contact);
    setElderScreen('reminder');
  }, []);

  const dismissReminder = useCallback(() => {
    setReminderContact(null);
    setElderScreen('home');
  }, []);

  // Auto-answer timer
  useEffect(() => {
    if (elderScreen === 'incoming-call' && incomingCall && config.autoAnswer) {
      const timer = setTimeout(() => {
        answerCall();
      }, config.autoAnswerDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [elderScreen, incomingCall, config.autoAnswer, config.autoAnswerDelay, answerCall]);

  // Scheduler: check for reminders every 30s
  const lastTriggeredRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const check = () => {
      if (mode !== 'elder' || elderScreen !== 'home') return;
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const schedules = getSchedules();
      const contacts = getContacts();
      for (const schedule of schedules) {
        if (!schedule.reminder) continue;
        if (!schedule.days.includes(currentDay)) continue;
        const [schedHour, schedMin] = schedule.time.split(':').map(Number);
        const schedTotalMin = schedHour * 60 + schedMin;
        const nowTotalMin = currentHour * 60 + currentMinute;
        const diff = schedTotalMin - nowTotalMin;
        if (diff === 5) {
          const key = `${schedule.id}-${now.toDateString()}-${schedule.time}`;
          if (!lastTriggeredRef.current.has(key)) {
            lastTriggeredRef.current.add(key);
            const contact = contacts.find((c) => c.id === schedule.contactId);
            if (contact) showReminder(contact);
          }
        }
      }
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [mode, elderScreen, showReminder]);

  return (
    <AppContext.Provider
      value={{
        mode,
        elderScreen,
        familyScreen,
        activeCall,
        incomingCall,
        reminderContact,
        editingContact,
        config,
        setElderScreen,
        setFamilyScreen,
        startCall,
        endCall,
        simulateIncomingCall,
        answerCall,
        declineCall,
        enterFamilyMode,
        exitFamilyMode,
        showReminder,
        dismissReminder,
        setEditingContact,
        refreshConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
