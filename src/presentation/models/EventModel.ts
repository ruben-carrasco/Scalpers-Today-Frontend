
import { EconomicEvent } from '../../domain/entities/EconomicEvent';
import { Importance } from '../../domain/entities/Importance';

export interface EventModel extends EconomicEvent {
  isExpanded: boolean;
  isLoading: boolean;
  showAnalysis: boolean;
  importanceStars: string;
  importanceColor: string;
  hasData: boolean;
  surpriseIcon: string | null;
}

export function createEventModel(event: EconomicEvent): EventModel {
  const importanceStars: Record<Importance, string> = {
    1: '★',
    2: '★★',
    3: '★★★',
  };

  const importanceColors: Record<Importance, string> = {
    1: '#64748B',
    2: '#F59E0B',
    3: '#EF4444',
  };

  const surpriseIcons: Record<string, string> = {
    positive: '↑',
    negative: '↓',
    neutral: '→',
  };

  return {
    ...event,
    isExpanded: false,
    isLoading: false,
    showAnalysis: false,
    importanceStars: importanceStars[event.importance],
    importanceColor: importanceColors[event.importance],
    hasData: event.actual !== null,
    surpriseIcon: event.surprise ? surpriseIcons[event.surprise] : null,
  };
}
