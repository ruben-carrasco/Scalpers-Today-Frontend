export interface ApiBriefing {
  general_outlook: string;
  impacted_assets: string[];
  cautionary_hours: string[];
  statistics: {
    sentiment: string;
    volatility_level: string;
    total_events_today: number;
    high_impact_count: number;
  };
}
