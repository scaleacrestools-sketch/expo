import type { Rep, Team } from '@/types';

/** Illustrative demo data — fictional teams; the brief supplies none. */
export const demoTeams: Team[] = [
  { id: 'team-emea', name: 'EMEA Enterprise' },
  { id: 'team-mid', name: 'Mid-Market' },
];

/**
 * Illustrative demo data — eight fictional reps so the headcount matches the supplied
 * "8 sales representatives" figure. Names are invented.
 */
export const demoReps: Rep[] = [
  { id: 'rep-1', name: 'Aoife Byrne', teamId: 'team-emea' },
  { id: 'rep-2', name: 'Mateo Rossi', teamId: 'team-emea' },
  { id: 'rep-3', name: 'Priya Natarajan', teamId: 'team-emea' },
  { id: 'rep-4', name: 'Jonas Weber', teamId: 'team-emea' },
  { id: 'rep-5', name: 'Lena Kowalski', teamId: 'team-mid' },
  { id: 'rep-6', name: 'Samir Haddad', teamId: 'team-mid' },
  { id: 'rep-7', name: 'Ingrid Solberg', teamId: 'team-mid' },
  { id: 'rep-8', name: 'Tomás Ferreira', teamId: 'team-mid' },
];

export const repById = new Map(demoReps.map((r) => [r.id, r]));
export const teamById = new Map(demoTeams.map((t) => [t.id, t]));
