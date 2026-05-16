/* ============================================================
   PERTINHO — Componente Raiz do App
   Orquestra: Modo Idoso ↔ Modo Família, todas as telas
   ============================================================ */

import { useApp } from '@/contexts/AppContext';
import ElderHome from './ElderHome';
import IncomingCall from './IncomingCall';
import InCall from './InCall';
import PinEntry from './PinEntry';
import ReminderScreen from './ReminderScreen';
import FamilyDashboard from './FamilyDashboard';
import ContactForm from './ContactForm';
import ScheduleForm from './ScheduleForm';

export default function Home() {
  const { mode, elderScreen, familyScreen } = useApp();

  // Overlay screens (rendered on top of elder home)
  if (elderScreen === 'incoming-call') return <IncomingCall />;
  if (elderScreen === 'in-call') return <InCall />;
  if (elderScreen === 'reminder') return <ReminderScreen />;
  if (elderScreen === 'pin-entry') return <PinEntry />;

  // Family mode screens
  if (mode === 'family') {
    if (familyScreen === 'add-contact') return <ContactForm mode="add" />;
    if (familyScreen === 'edit-contact') return <ContactForm mode="edit" />;
    if (familyScreen === 'add-schedule') return <ScheduleForm />;
    return <FamilyDashboard />;
  }

  // Default: Elder home
  return <ElderHome />;
}
