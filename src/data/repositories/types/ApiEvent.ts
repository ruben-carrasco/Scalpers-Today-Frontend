import { ApiAIAnalysis } from './ApiAIAnalysis';

export interface ApiEvent {
  id: string;
  time: string;
  title: string;
  country: string;
  currency: string;
  importance: number;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  surprise: string | null;
  url: string | null;
  ai_analysis: ApiAIAnalysis | null;
}
