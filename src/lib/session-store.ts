
export type SessionStatus = 'waiting' | 'active' | 'disconnected';

export interface SupportSession {
  id: string;
  createdAt: Date;
  status: SessionStatus;
  userSharedScreen: boolean;
  userSharedAudio: boolean;
  logs: string[];
}

// In a real app, this would be a Redis store or database
const sessions: Map<string, SupportSession> = new Map();

export const createSession = () => {
  const id = Math.random().toString(36).substring(2, 8).toUpperCase();
  const session: SupportSession = {
    id,
    createdAt: new Date(),
    status: 'waiting',
    userSharedScreen: false,
    userSharedAudio: false,
    logs: [`SESSION CREATED: ${id}`]
  };
  sessions.set(id, session);
  return session;
};

export const getSession = (id: string) => sessions.get(id);

export const updateSession = (id: string, updates: Partial<SupportSession>) => {
  const session = sessions.get(id);
  if (session) {
    const updated = { ...session, ...updates };
    sessions.set(id, updated);
    return updated;
  }
  return null;
};
