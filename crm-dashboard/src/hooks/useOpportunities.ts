import { useCallback, useEffect, useReducer } from 'react';
import { demoOpportunities } from '@/data/demoOpportunities';
import type { Opportunity, Stage } from '@/types';

const STORAGE_KEY = 'crm-prototype:v1';

type Action =
  | { type: 'scheduleFollowUp'; id: string; dueDate: string; note: string; todayIso: string }
  | { type: 'updateStage'; id: string; stage: Stage; todayIso: string }
  | { type: 'completeTask'; id: string; todayIso: string }
  | { type: 'reset' };

interface State {
  opportunities: Opportunity[];
}

let activitySeq = 1000;
const nextActivityId = () => `a-${activitySeq++}`;

function update(state: State, id: string, mutate: (opp: Opportunity) => Opportunity): State {
  return {
    opportunities: state.opportunities.map((opp) => (opp.id === id ? mutate(opp) : opp)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'scheduleFollowUp':
      return update(state, action.id, (opp) => ({
        ...opp,
        dueDate: action.dueDate,
        completed: false,
        activity: [
          {
            id: nextActivityId(),
            date: action.todayIso,
            summary: `Follow-up scheduled for ${action.dueDate}${action.note ? ` — ${action.note}` : ''}`,
          },
          ...opp.activity,
        ],
      }));
    case 'updateStage':
      return update(state, action.id, (opp) => ({
        ...opp,
        stage: action.stage,
        activity: [
          {
            id: nextActivityId(),
            date: action.todayIso,
            summary: `Stage changed from ${opp.stage} to ${action.stage}`,
          },
          ...opp.activity,
        ],
      }));
    case 'completeTask':
      return update(state, action.id, (opp) => ({
        ...opp,
        completed: true,
        activity: [
          { id: nextActivityId(), date: action.todayIso, summary: `${opp.nextAction} marked complete` },
          ...opp.activity,
        ],
      }));
    case 'reset':
      return { opportunities: demoOpportunities };
  }
}

function loadInitial(): State {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === demoOpportunities.length) {
        return { opportunities: parsed as Opportunity[] };
      }
    }
  } catch {
    // Ignore storage errors (private mode, quota) and fall back to defaults.
  }
  return { opportunities: demoOpportunities };
}

/** Owns the illustrative opportunity records and persists them to localStorage. */
export function useOpportunities(todayIso: string) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.opportunities));
    } catch {
      // Storage is a convenience only.
    }
  }, [state.opportunities]);

  const scheduleFollowUp = useCallback(
    (id: string, dueDate: string, note: string) =>
      dispatch({ type: 'scheduleFollowUp', id, dueDate, note, todayIso }),
    [todayIso],
  );
  const updateStage = useCallback(
    (id: string, stage: Stage) => dispatch({ type: 'updateStage', id, stage, todayIso }),
    [todayIso],
  );
  const completeTask = useCallback(
    (id: string) => dispatch({ type: 'completeTask', id, todayIso }),
    [todayIso],
  );
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return { opportunities: state.opportunities, scheduleFollowUp, updateStage, completeTask, reset };
}
