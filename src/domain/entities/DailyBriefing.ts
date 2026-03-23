import { BriefingStats } from './BriefingStats';

export interface DailyBriefing {
  generalOutlook: string;
  impactedAssets: string[];
  cautionaryHours: string[];
  statistics: BriefingStats;
}
