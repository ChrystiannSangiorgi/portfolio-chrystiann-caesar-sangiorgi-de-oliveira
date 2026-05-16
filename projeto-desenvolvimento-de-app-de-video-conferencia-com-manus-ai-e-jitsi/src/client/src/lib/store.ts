/* ============================================================
   PERTINHO — Store de dados com persistência em localStorage
   Contatos, agendamentos e configurações do app
   ============================================================ */

export interface Contact {
  id: string;
  name: string;
  relation: string;
  photo: string;
  roomId: string;
}

export interface Schedule {
  id: string;
  contactId: string;
  days: number[]; // 0=Dom, 1=Seg, ..., 6=Sáb
  time: string; // "HH:MM"
  reminder: boolean;
}

export interface AppConfig {
  elderName: string;
  pin: string;
  autoAnswer: boolean;
  autoAnswerDelay: number; // segundos
}

const STORAGE_KEYS = {
  contacts: 'pertinho_contacts',
  schedules: 'pertinho_schedules',
  config: 'pertinho_config',
};

// Dados mock iniciais
const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'marina',
    name: 'Marina',
    relation: 'Filha',
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663664608314/dfvoc5hA4JGAXkTK8b4VEQ/avatar-marina-U2wu97x2wc7TQiJtQKPgDD.webp',
    roomId: 'pertinho-cida-marina',
  },
  {
    id: 'pedro',
    name: 'Pedro',
    relation: 'Filho',
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663664608314/dfvoc5hA4JGAXkTK8b4VEQ/avatar-pedro-7nfRfvwNXWsxH53LYnYcLm.webp',
    roomId: 'pertinho-cida-pedro',
  },
  {
    id: 'helena',
    name: 'Helena',
    relation: 'Neta',
    photo: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663664608314/dfvoc5hA4JGAXkTK8b4VEQ/avatar-helena-5kKqGecukZHuXZAQ2ZwM8P.webp',
    roomId: 'pertinho-cida-helena',
  },
];

const DEFAULT_SCHEDULES: Schedule[] = [
  {
    id: 'sched-1',
    contactId: 'marina',
    days: [3], // Quarta-feira
    time: '16:00',
    reminder: true,
  },
];

const DEFAULT_CONFIG: AppConfig = {
  elderName: 'Cida',
  pin: '1234',
  autoAnswer: true,
  autoAnswerDelay: 30,
};

function load<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Initialize defaults if not set
function initDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.contacts)) {
    save(STORAGE_KEYS.contacts, DEFAULT_CONTACTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.schedules)) {
    save(STORAGE_KEYS.schedules, DEFAULT_SCHEDULES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.config)) {
    save(STORAGE_KEYS.config, DEFAULT_CONFIG);
  }
}

initDefaults();

// Contacts
export function getContacts(): Contact[] {
  return load(STORAGE_KEYS.contacts, DEFAULT_CONTACTS);
}

export function saveContacts(contacts: Contact[]): void {
  save(STORAGE_KEYS.contacts, contacts);
}

export function addContact(contact: Contact): void {
  const contacts = getContacts();
  contacts.push(contact);
  saveContacts(contacts);
}

export function updateContact(contact: Contact): void {
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.id === contact.id);
  if (idx >= 0) contacts[idx] = contact;
  saveContacts(contacts);
}

export function deleteContact(id: string): void {
  const contacts = getContacts().filter(c => c.id !== id);
  saveContacts(contacts);
}

// Schedules
export function getSchedules(): Schedule[] {
  return load(STORAGE_KEYS.schedules, DEFAULT_SCHEDULES);
}

export function saveSchedules(schedules: Schedule[]): void {
  save(STORAGE_KEYS.schedules, schedules);
}

export function addSchedule(schedule: Schedule): void {
  const schedules = getSchedules();
  schedules.push(schedule);
  saveSchedules(schedules);
}

export function deleteSchedule(id: string): void {
  const schedules = getSchedules().filter(s => s.id !== id);
  saveSchedules(schedules);
}

// Config
export function getConfig(): AppConfig {
  return load(STORAGE_KEYS.config, DEFAULT_CONFIG);
}

export function saveConfig(config: AppConfig): void {
  save(STORAGE_KEYS.config, config);
}

// Utilities
export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateRoomId(elderName: string, contactName: string): string {
  return `pertinho-${generateSlug(elderName)}-${generateSlug(contactName)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const DAY_NAMES_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
