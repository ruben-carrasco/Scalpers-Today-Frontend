export interface ApiAIAnalysis {
  summary: string;
  impact: string;
  sentiment: string;
  macro_context?: string;
  technical_levels?: string;
  trading_strategies?: string;
  impacted_assets?: string[] | string;
}
