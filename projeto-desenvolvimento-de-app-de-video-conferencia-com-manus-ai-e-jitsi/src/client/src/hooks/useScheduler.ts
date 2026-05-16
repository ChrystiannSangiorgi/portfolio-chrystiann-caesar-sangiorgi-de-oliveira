/* ============================================================
   PERTINHO — Hook de Agendamento
   Verifica a cada 30s se há chamadas agendadas próximas
   Dispara lembrete 5 min antes se configurado
   ============================================================ */

import { useEffect, useRef } from 'react';
import { getSchedules, getContacts } from '@/lib/store';
import { useApp } from '@/contexts/AppContext';

export function useScheduler() {
  const { mode, elderScreen, showReminder } = useApp();
  const lastTriggered = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = () => {
      // Only trigger in elder mode on home screen
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

        // Parse schedule time
        const [schedHour, schedMin] = schedule.time.split(':').map(Number);

        // Calculate minutes until scheduled time
        const schedTotalMin = schedHour * 60 + schedMin;
        const nowTotalMin = currentHour * 60 + currentMinute;
        const diff = schedTotalMin - nowTotalMin;

        // Trigger reminder at exactly 5 minutes before
        if (diff === 5) {
          const key = `${schedule.id}-${now.toDateString()}-${schedule.time}`;
          if (!lastTriggered.current.has(key)) {
            lastTriggered.current.add(key);
            const contact = contacts.find((c) => c.id === schedule.contactId);
            if (contact) {
              showReminder(contact);
            }
          }
        }
      }

      // Clean up old keys (keep only today's)
      const today = now.toDateString();
      Array.from(lastTriggered.current).forEach((key) => {
        if (!key.includes(today)) {
          lastTriggered.current.delete(key);
        }
      });
    };

    check(); // Run immediately
    const interval = setInterval(check, 30_000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [mode, elderScreen, showReminder]);
}
