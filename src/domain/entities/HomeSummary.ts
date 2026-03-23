import { EconomicEvent } from './EconomicEvent';

export interface HomeSummary {
  welcome: {
    greeting: string;
    date: string;
    time: string;
  };
  todayStats: {
    totalEvents: number;
    highImpact: number;
    mediumImpact: number;
    lowImpact: number;
  };
  nextEvent: EconomicEvent | null;
  marketSentiment: {
    overall: string;
    volatility: string;
  };
  highlights: EconomicEvent[];
}
