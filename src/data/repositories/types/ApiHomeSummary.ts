import { ApiEvent } from './ApiEvent';

export interface ApiHomeSummary {
  welcome: {
    greeting: string;
    date: string;
    time: string;
  };
  today_stats: {
    total_events: number;
    high_impact: number;
    medium_impact: number;
    low_impact: number;
  };
  next_event: ApiEvent | null;
  market_sentiment: {
    overall: string;
    volatility: string;
  };
  highlights: ApiEvent[];
}
