import { Impact } from './Impact';
import { Sentiment } from './Sentiment';

export interface AIAnalysis {
  summary: string;
  impact: Impact;
  sentiment: Sentiment;
  macroContext?: string;
  technicalLevels?: string;
  tradingStrategies?: string;
  impactedAssets?: string[];
}
